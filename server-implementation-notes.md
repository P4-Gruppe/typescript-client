# Server-Side Implementation Notes

To complete the schema validation system, the following changes need to be made to the Rust server code:

## 1. Add Schema Hash Storage

The server needs to store the hash of each schema alongside the schema itself:

```rust
#[derive(Debug, Clone)]
struct SchemaWithHash {
    schema: Schema,
    hash: String,
}

type SchemaStore = Arc<RwLock<HashMap<String, SchemaWithHash>>>;
```

## 2. Update the Schema Creation Endpoint

Modify the `create_schema` function to calculate and store the hash:

```rust
async fn create_schema(
    State((schema_store, _)): State<(SchemaStore, DataStore)>,
    Json(schema): Json<Schema>,
) -> impl IntoResponse {
    // Calculate hash (implementation depends on the hashing approach)
    let hash = calculate_schema_hash(&schema);
    
    let mut schemas = schema_store.write().await;
    schemas.insert(schema.name.clone(), SchemaWithHash { schema, hash: hash.clone() });
    
    (StatusCode::OK, Json(serde_json::json!({
        "success": true,
        "message": "Schema created successfully",
        "hash": hash
    })))
}
```

## 3. Add a Schema Validation Endpoint

Create a new endpoint to validate schema hashes:

```rust
#[derive(Debug, Serialize, Deserialize)]
struct SchemaValidationRequest {
    schema_name: String,
    hash: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct SchemaValidationResponse {
    valid: bool,
    message: String,
}

async fn validate_schema(
    State((schema_store, _)): State<(SchemaStore, DataStore)>,
    Json(validation_req): Json<SchemaValidationRequest>,
) -> impl IntoResponse {
    let schemas = schema_store.read().await;
    
    if let Some(schema_with_hash) = schemas.get(&validation_req.schema_name) {
        let valid = schema_with_hash.hash == validation_req.hash;
        let message = if valid {
            "Schema hash matches".to_string()
        } else {
            "Schema hash mismatch".to_string()
        };
        
        (StatusCode::OK, Json(SchemaValidationResponse { valid, message }))
    } else {
        (StatusCode::NOT_FOUND, Json(SchemaValidationResponse {
            valid: false,
            message: format!("Schema '{}' not found", validation_req.schema_name),
        }))
    }
}
```

## 4. Register the New Endpoint

Add the validation endpoint to the router:

```rust
let app = Router::new()
    .route("/", get(health_check))
    .route("/schema", post(create_schema))
    .route("/validate-schema", post(validate_schema))
    .route("/query", post(query_data))
    .route("/insert", post(insert_data))
    .layer(CorsLayer::permissive())
    .with_state((schema_store, data_store));
```

## 5. Implement Hash Calculation

Add a function to calculate the schema hash in a way that matches the client-side implementation:

```rust
fn calculate_schema_hash(schema: &Schema) -> String {
    // Sort fields by name for consistent hashing
    let mut fields = schema.fields.clone();
    fields.sort_by(|a, b| a.name.cmp(&b.name));
    
    // Create a normalized schema
    let normalized_schema = serde_json::json!({
        "name": schema.name,
        "fields": fields.iter().map(|field| {
            serde_json::json!({
                "name": field.name,
                "type": field.field_type,
                "required": field.required,
                "unique": field.unique,
            })
        }).collect::<Vec<_>>(),
    });
    
    // Convert to string and hash
    let schema_string = normalized_schema.to_string();
    
    // Use a SHA-256 hash function (you'll need to add a crate like `sha2` to dependencies)
    use sha2::{Sha256, Digest};
    let mut hasher = Sha256::new();
    hasher.update(schema_string.as_bytes());
    format!("{:x}", hasher.finalize())
}
```

## 6. Update Cargo.toml

Add the necessary dependency:

```toml
[dependencies]
# ... existing dependencies
sha2 = "0.10"
```

These changes will enable the server to store schema hashes and validate client schema hashes against them.

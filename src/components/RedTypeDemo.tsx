"use client";

import { useState } from "react";
import { RedTypeClient } from "@/lib/redtype-client";
import { AxiosError } from "axios";

export default function RedTypeDemo() {
  const [output, setOutput] = useState<string>("");
  const [schema, setSchema] = useState<string>(`User {
    id: Int @primary,
    name: String,
    age: Int,
    email: String
},`);

  const client = new RedTypeClient();

  const handleSetSchema = async () => {
    try {
      await client.setSchema(schema);
      setOutput("Schema set successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError && error.response?.data
          ? JSON.stringify(error.response.data)
          : `${error}`;
      setOutput(`Error setting schema: ${errorMessage}`);
    }
  };

  const handleGetSchema = async () => {
    try {
      const currentSchema = await client.getSchema();
      setOutput(`Current schema:\n${currentSchema}`);
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError && error.response?.data
          ? JSON.stringify(error.response.data)
          : `${error}`;
      setOutput(`Error getting schema: ${errorMessage}`);
    }
  };

  const handleInsertUser = async () => {
    try {
      const commands = [
        'SET User[1].name TO "John Doe";',
        "SET User[1].age TO 30;",
        'SET User[1].email TO "john@example.com";',
        'SET User[2].name TO "Jane Doe";',
        "SET User[2].age TO 25;",
        'SET User[2].email TO "jane@example.com";',
        'SET User[3].name TO "John Smith";',
      ].join("\n");

      const result = await client.executeCommand(commands);
      setOutput(
        `User inserted successfully!\nResult: ${JSON.stringify(
          result,
          null,
          2
        )}`
      );
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError && error.response?.data
          ? JSON.stringify(error.response.data)
          : `${error}`;
      setOutput(`Error inserting user: ${errorMessage}`);
    }
  };

  const handleQueryUser = async () => {
    try {
      const query = `
                x: Option<String> = GET User[1].name;
                match x {
                    Some(value) => {
                        return value;
                    }
                    None => {
                        return "None";
                    }
                };
            `;
      const result = await client.executeQuery(query);
      setOutput(`Query results:\n${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError && error.response?.data
          ? JSON.stringify(error.response.data)
          : `${error}`;
      setOutput(`Error querying user: ${errorMessage}`);
    }
  };

  const handleGetStats = async () => {
    try {
      const stats = await client.getDbStats();
      setOutput(`Database stats:\n${JSON.stringify(stats, null, 2)}`);
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError && error.response?.data
          ? JSON.stringify(error.response.data)
          : `${error}`;
      setOutput(`Error getting stats: ${errorMessage}`);
    }
  };

  const handleBigExample = async () => {
    try {
      setOutput("Starting big example operation...");

      // First set up a more complex schema with multiple entities
      const complexSchema = `
Product {
  id: Int @primary,
  name: String,
  price: Double,
  category: String,
  inStock: Bool
},
Order {
  id: Int @primary,
  customerName: String,
  total: Double,
  date: String,
  status: String
},
OrderItem {
  id: Int @primary,
  orderId: Int,
  productId: Int,
  quantity: Int
},
Inventory {
  productId: Int @primary,
  quantity: Int,
  lastUpdated: String
}
`;

      await client.setSchema(complexSchema);
      setOutput("Complex schema set successfully!");

      // Generate commands for inserting 1000 products
      let commands = [];
      for (let i = 1; i <= 1000; i++) {
        const price = (Math.random() * 100 + 10).toFixed(2);
        const categories = ["Electronics", "Clothing", "Food", "Books", "Toys"];
        const category =
          categories[Math.floor(Math.random() * categories.length)];
        const inStock = Math.random() > 0.2;

        commands.push(`SET Product[${i}].name TO "Product ${i}";`);
        commands.push(`SET Product[${i}].price TO ${price};`);
        commands.push(`SET Product[${i}].category TO "${category}";`);
        commands.push(`SET Product[${i}].inStock TO ${inStock};`);
      }

      // Execute all product commands at once
      await client.executeCommand(commands.join("\n"));
      setOutput("Inserted all 1000 products");

      // Generate inventory for each product
      commands = [];
      for (let i = 1; i <= 1000; i++) {
        const quantity = Math.floor(Math.random() * 100);
        const now = new Date().toISOString();

        commands.push(`SET Inventory[${i}].productId TO ${i};`);
        commands.push(`SET Inventory[${i}].quantity TO ${quantity};`);
        commands.push(`SET Inventory[${i}].lastUpdated TO "${now}";`);
      }

      // Execute all inventory commands at once
      await client.executeCommand(commands.join("\n"));
      setOutput("Created all 1000 inventory entries");

      // Create 50 orders with random items
      commands = [];
      for (let i = 1; i <= 50; i++) {
        const customerNames = [
          "John Doe",
          "Jane Smith",
          "Alex Johnson",
          "Maria Garcia",
          "Wei Chen",
        ];
        const customerName =
          customerNames[Math.floor(Math.random() * customerNames.length)];
        const itemCount = Math.floor(Math.random() * 5) + 1;
        const total = (Math.random() * 500 + 50).toFixed(2);
        const date = new Date().toLocaleDateString();
        const statuses = ["Pending", "Processing", "Shipped", "Delivered"];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        commands.push(`SET Order[${i}].customerName TO "${customerName}";`);
        commands.push(`SET Order[${i}].total TO ${total};`);
        commands.push(`SET Order[${i}].date TO "${date}";`);
        commands.push(`SET Order[${i}].status TO "${status}";`);

        // Create separate order items instead of using arrays
        for (let j = 0; j < itemCount; j++) {
          const orderItemId = i * 100 + j;
          const productId = Math.floor(Math.random() * 1000) + 1;
          const quantity = Math.floor(Math.random() * 5) + 1;

          commands.push(`SET OrderItem[${orderItemId}].orderId TO ${i};`);
          commands.push(
            `SET OrderItem[${orderItemId}].productId TO ${productId};`
          );
          commands.push(
            `SET OrderItem[${orderItemId}].quantity TO ${quantity};`
          );
        }
      }

      // Execute all order commands at once
      await client.executeCommand(commands.join("\n"));
      setOutput("Created all 50 orders with their items");
      // Now run a complex query to analyze the data
      const query = `
        /* Count products by category */
        electronicsCount: Int = 0;
        clothingCount: Int = 0;
        foodCount: Int = 0;
        booksCount: Int = 0;
        toysCount: Int = 0;
        
        /* Track highest priced product */
        maxPrice: Double = 0.0;
        maxPriceProduct: Int = 0;
        
        /* Calculate inventory stats */
        totalInventory: Int = 0;
        lowStockCount: Int = 0;
        
        /* Iterate through all products */
        i: Int = 1;
        while (i <= 1000) do {
          /* Get product category */
          category: Option<String> = GET Product[i].category;;
          match category {
            Some(cat) => {
              if (cat == "Electronics") {
                electronicsCount = electronicsCount + 1;
              } elif (cat == "Clothing") {
                clothingCount = clothingCount + 1;
              } elif (cat == "Food") {
                foodCount = foodCount + 1;
              } elif (cat == "Books") {
                booksCount = booksCount + 1;
              } elif (cat == "Toys") {
                toysCount = toysCount + 1;
              };
            }
          };;
          
          /* Check for highest price */
          price: Option<Double> = GET Product[i].price;;
          match price {
            Some(p) => {
              if (p > maxPrice) {
                maxPrice = p;;
                maxPriceProduct = i;
              };
            }
          };;
          
          /* Get inventory quantity */
          quantity: Option<Int> = GET Inventory[i].quantity;;
          match quantity {
            Some(q) => {
              totalInventory = totalInventory + q;;
              if (q < 10) {
                lowStockCount = lowStockCount + 1;
              };
            }
          };;
          
          
          i = i + 1;
        };
        
        /* Get name of highest priced product */
        maxProductName: Option<String> = GET Product[maxPriceProduct].name;
        
        /* Find customer with most orders */
        /* First count orders per customer without using maps */
        customerCount1: Int = 0;
        customerCount2: Int = 0;
        customerCount3: Int = 0;
        customerCount4: Int = 0;
        customerCount5: Int = 0;
        
        topCustomer: String = "";
        topCustomerOrders: Int = 0;
        
        /* Count for John Doe */
        i = 1;
        while (i <= 50) do {
          customer: Option<String> = GET Order[i].customerName;;
          match customer {
            Some(name) => {
              if (name == "John Doe") {
                customerCount1 = customerCount1 + 1;
              };
            }
          };;
          
          i = i + 1;
        };
        
        /* Count for Jane Smith */
        i = 1;
        while (i <= 50) do {
          customer: Option<String> = GET Order[i].customerName;;
          match customer {
            Some(name) => {
              if (name == "Jane Smith") {
                customerCount2 = customerCount2 + 1;
              };
            }
          };;
          
          i = i + 1;
        };
        
        
        /* Count for Alex Johnson */
        i = 1;
        while (i <= 50) do {
          customer: Option<String> = GET Order[i].customerName;;
          match customer {
            Some(name) => {
              if (name == "Alex Johnson") {
                customerCount3 = customerCount3 + 1;
              };
            }
          };;
          
          i = i + 1;
        };
        
        
        /* Count for Maria Garcia */
        i = 1;
        while (i <= 50) do {
          customer: Option<String> = GET Order[i].customerName;;
          match customer {
            Some(name) => {
              if (name == "Maria Garcia") {
                customerCount4 = customerCount4 + 1;
              };
            }
          };;
          
          i = i + 1;
        };
        
        
        /* Count for Wei Chen */
        i = 1;
        while (i <= 50) do {
          customer: Option<String> = GET Order[i].customerName;;
          match customer {
            Some(name) => {
              if (name == "Wei Chen") {
                customerCount5 = customerCount5 + 1;
              };
            }
          };;
          
          i = i + 1;
        };
        
        
        /* Find the top customer */
        if (customerCount1 > topCustomerOrders) {
          topCustomerOrders = customerCount1;;
          topCustomer = "John Doe";
        };
        
        if (customerCount2 > topCustomerOrders) {
          topCustomerOrders = customerCount2;;
          topCustomer = "Jane Smith";
        };
        
        if (customerCount3 > topCustomerOrders) {
          topCustomerOrders = customerCount3;;
          topCustomer = "Alex Johnson";
        };
        
        if (customerCount4 > topCustomerOrders) {
          topCustomerOrders = customerCount4;;
          topCustomer = "Maria Garcia";
        };
        
        if (customerCount5 > topCustomerOrders) {
          topCustomerOrders = customerCount5;;
          topCustomer = "Wei Chen";
        };
        
        /* Count the total number of order items */
        totalOrderItems: Int = 0;
        i = 1;
        while (i <= 5000) do {
          orderItemExists: Option<Int> = GET OrderItem[i].orderId;;
          match orderItemExists {
            Some(_) => {
              totalOrderItems = totalOrderItems + 1;
            }
          };;
          
          i = i + 1;
        };
        
        return 1;
      `;

      const cleanQuery = query.replace(/\/\*[\s\S]*?\*\//g, "");

      const result = await client.executeQuery(cleanQuery);
      setOutput(
        `Analyzed ${1000} products and ${50} orders!\n\nResults:\n${JSON.stringify(
          result,
          null,
          2
        )}`
      );
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError && error.response?.data
          ? JSON.stringify(error.response.data)
          : `${error}`;
      setOutput(`Error running big example: ${errorMessage}`);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">RedType Demo</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Schema</h2>
        <textarea
          value={schema}
          onChange={(e) => setSchema(e.target.value)}
          className="w-full h-32 p-2 border rounded"
        />
        <div className="mt-2 space-x-2">
          <button
            onClick={handleSetSchema}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Set Schema
          </button>
          <button
            onClick={handleGetSchema}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Get Schema
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Operations</h2>
        <div className="space-x-2 flex flex-wrap gap-2">
          <button
            onClick={handleInsertUser}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Insert User
          </button>
          <button
            onClick={handleQueryUser}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Query User
          </button>
          <button
            onClick={handleGetStats}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Get Stats
          </button>
          <button
            onClick={handleBigExample}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Run Big Example
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Output</h2>
        <pre className="w-full p-4 bg-gray-100 rounded whitespace-pre-wrap">
          {output}
        </pre>
      </div>
    </div>
  );
}

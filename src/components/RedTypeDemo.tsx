"use client";

import { RedTypeClient } from "@/lib/redtype-client";
import { queryExamples } from "@/queryExamples";
import { AxiosError } from "axios";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function RedTypeDemo() {
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [schema, setSchema] = useState<string>(`User {
    id: Int @primary,
    name: String,
    age: Int,
    email: String
}`);
  const [progress, setProgress] = useState<{
    step: number;
    total: number;
    message: string;
  } | null>(null);
  const [manualCommand, setManualCommand] = useState<string>("");
  const [commandType, setCommandType] = useState<"command" | "query">(
    "command"
  );

  const client = new RedTypeClient();

  const executeOperation = async (operation: () => Promise<void>) => {
    setLoading(true);
    try {
      await operation();
    } finally {
      setLoading(false);
    }
  };

  const handleSetSchema = async () => {
    executeOperation(async () => {
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
    });
  };

  const handleGetSchema = async () => {
    executeOperation(async () => {
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
    });
  };

  const handleInsertUser = async () => {
    executeOperation(async () => {
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
    });
  };

  const handleQueryUser = async () => {
    executeOperation(async () => {
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
                }
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
    });
  };

  const handleGetStats = async () => {
    executeOperation(async () => {
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
    });
  };

  const handleBigExample = async () => {
    executeOperation(async () => {
      try {
        setProgress({ step: 1, total: 5, message: "Setting up schema..." });
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
        setProgress({ step: 2, total: 5, message: "Creating products..." });
        let commands = [];
        for (let i = 1; i <= 1000; i++) {
          const price = (Math.random() * 100 + 10).toFixed(2);
          const categories = [
            "Electronics",
            "Clothing",
            "Food",
            "Books",
            "Toys",
          ];
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
        setProgress({ step: 3, total: 5, message: "Setting up inventory..." });
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
        setProgress({ step: 4, total: 5, message: "Creating orders..." });
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
        setProgress({ step: 5, total: 5, message: "Analyzing data..." });
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
          category: Option<String> = GET Product[i].category;
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
              }
            }
          }
          
          /* Check for highest price */
          price: Option<Double> = GET Product[i].price;
          match price {
            Some(p) => {
              if (p > maxPrice) {
                maxPrice = p;
                maxPriceProduct = i;
              }
            }
          }
          
          /* Get inventory quantity */
          quantity: Option<Int> = GET Inventory[i].quantity;
          match quantity {
            Some(q) => {
              totalInventory = totalInventory + q;
              if (q < 10) {
                lowStockCount = lowStockCount + 1;
              }
            }
          }
          
          
          i = i + 1;
        }
        
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
          customer: Option<String> = GET Order[i].customerName;
          match customer {
            Some(name) => {
              if (name == "John Doe") {
                customerCount1 = customerCount1 + 1;
              }
            }
          }
          
          i = i + 1;
        }
        
        /* Count for Jane Smith */
        i = 1;
        while (i <= 50) do {
          customer: Option<String> = GET Order[i].customerName;
          match customer {
            Some(name) => {
              if (name == "Jane Smith") {
                customerCount2 = customerCount2 + 1;
              }
            }
          }
          
          i = i + 1;
        }
        
        
        /* Count for Alex Johnson */
        i = 1;
        while (i <= 50) do {
          customer: Option<String> = GET Order[i].customerName;
          match customer {
            Some(name) => {
              if (name == "Alex Johnson") {
                customerCount3 = customerCount3 + 1;
              }
            }
          }
          
          i = i + 1;
        }
        
        
        /* Count for Maria Garcia */
        i = 1;
        while (i <= 50) do {
          customer: Option<String> = GET Order[i].customerName;
          match customer {
            Some(name) => {
              if (name == "Maria Garcia") {
                customerCount4 = customerCount4 + 1;
              }
            }
          }
          
          i = i + 1;
        }
        
        
        /* Count for Wei Chen */
        i = 1;
        while (i <= 50) do {
          customer: Option<String> = GET Order[i].customerName;
          match customer {
            Some(name) => {
              if (name == "Wei Chen") {
                customerCount5 = customerCount5 + 1;
              }
            }
          }
          
          i = i + 1;
        }
        
        
        /* Find the top customer */
        if (customerCount1 > topCustomerOrders) {
          topCustomerOrders = customerCount1;
          topCustomer = "John Doe";
        }
        
        if (customerCount2 > topCustomerOrders) {
          topCustomerOrders = customerCount2;
          topCustomer = "Jane Smith";
        }
        
        if (customerCount3 > topCustomerOrders) {
          topCustomerOrders = customerCount3;
          topCustomer = "Alex Johnson";
        }
        
        if (customerCount4 > topCustomerOrders) {
          topCustomerOrders = customerCount4;
          topCustomer = "Maria Garcia";
        }
        
        if (customerCount5 > topCustomerOrders) {
          topCustomerOrders = customerCount5;
          topCustomer = "Wei Chen";
        }
        
        /* Count the total number of order items */
        totalOrderItems: Int = 0;
        i = 1;
        while (i <= 5000) do {
          orderItemExists: Option<Int> = GET OrderItem[i].orderId;
          match orderItemExists {
            Some(_) => {
              totalOrderItems = totalOrderItems + 1;
            }
          }
          
          i = i + 1;
        }
        
        return true;
      `;

        const cleanQuery = query.replace(/\/\*[\s\S]*?\*\//g, "");

        const result = await client.executeQuery(cleanQuery);
        setProgress(null);
        setOutput(
          `Analysis Complete!\n\nResults:\n${JSON.stringify(result, null, 2)}`
        );
      } catch (error) {
        setProgress(null);
        const errorMessage =
          error instanceof AxiosError && error.response?.data
            ? JSON.stringify(error.response.data)
            : `${error}`;
        setOutput(`Error running big example: ${errorMessage}`);
      }
    });
  };

  const handleConcurrencyExample = async () => {
    executeOperation(async () => {
      try {
        // Set up a simple bank account schema
        const accountSchema = `Account {
  id: Int @primary,
  balance: Double,
  owner: String
}`;

        await client.setSchema(accountSchema);
        setOutput("Bank account schema set successfully! Creating accounts...");

        // Create initial accounts
        const setupCommands = [
          "SET Account[1].balance TO 1000.0;",
          'SET Account[1].owner TO "Alice";',
          "SET Account[2].balance TO 500.0;",
          'SET Account[2].owner TO "Bob";',
        ].join("\n");

        await client.executeCommand(setupCommands);
        setOutput(
          "Created two bank accounts. Now demonstrating concurrent transfers..."
        );

        // First let's show what happens WITHOUT locking (potential race condition)
        const transferWithoutLock = `
aliceBalance: Option<Double> = GET Account[1].balance;
bobBalance: Option<Double> = GET Account[2].balance;

match aliceBalance {
  Some(aliceAmount) => {
    match bobBalance {
      Some(bobAmount) => {
        transferAmount: Double = 100.0;
        newAliceBalance: Double = aliceAmount - transferAmount;
        newBobBalance: Double = bobAmount + transferAmount;
        
        i: Int = 0;
        while (i < 1000000) do {
          i = i + 1;
        }
        
        SET Account[1].balance TO newAliceBalance;
        SET Account[2].balance TO newBobBalance;
        
        return "Transfer completed without locking!";
      }
      None => {
        return "Bob's account not found";
      }
    }
  }
  None => {
    return "Alice's account not found";
  }
}`;

        // Now let's show the CORRECT way with locking
        const transferWithLock = `
LOCK Account[1], Account[2];

aliceBalance: Option<Double> = GET Account[1].balance;
bobBalance: Option<Double> = GET Account[2].balance;

match aliceBalance {
  Some(aliceAmount) => {
    match bobBalance {
      Some(bobAmount) => {
        transferAmount: Double = 100.0;
        newAliceBalance: Double = aliceAmount - transferAmount;
        newBobBalance: Double = bobAmount + transferAmount;
        
        i: Int = 0;
        while (i < 1000000) do {
          i = i + 1;
        }
        
        SET Account[1].balance TO newAliceBalance;
        SET Account[2].balance TO newBobBalance;
        
        return "Transfer completed safely with locking!";
      }
      None => {
        return "Bob's account not found";
      }
    }
  }
  None => {
    return "Alice's account not found";
  }
}`;

        // Show account balances before transfers
        const getAliceBalanceQuery = `
balance: Option<Double> = GET Account[1].balance;
return balance;
`;

        const getBobBalanceQuery = `
balance: Option<Double> = GET Account[2].balance;
return balance;
`;

        // Get initial balances
        const aliceBalanceResult = await client.executeQuery(
          getAliceBalanceQuery
        );
        const bobBalanceResult = await client.executeQuery(getBobBalanceQuery);

        const aliceBalance = client.getResult(aliceBalanceResult)?.value;
        const bobBalance = client.getResult(bobBalanceResult)?.value;

        setOutput(
          `Initial balances: Alice: $${aliceBalance}, Bob: $${bobBalance}`
        );

        // Now simulate concurrent transfers
        setOutput((prev) => `${prev}\n\nSimulating concurrent transfers...`);

        // Execute transfers concurrently
        // We'll demo the unsafe way first, then the safe way with LOCK
        setOutput(
          (prev) => `${prev}\n\n1. Without LOCK (potential race condition)`
        );

        // In real-world, these would be from different clients, here we simulate with multiple async calls
        const promises = [
          client.executeQuery(transferWithoutLock),
          client.executeQuery(transferWithoutLock),
        ];

        await Promise.all(promises);

        // Check balances after unsafely concurrent transfers
        const aliceUnsafeResult = await client.executeQuery(
          getAliceBalanceQuery
        );
        const bobUnsafeResult = await client.executeQuery(getBobBalanceQuery);

        const aliceUnsafeBalance = client.getResult(aliceUnsafeResult)?.value;
        const bobUnsafeBalance = client.getResult(bobUnsafeResult)?.value;

        setOutput(
          (prev) =>
            `${prev}\nAfter concurrent transfers WITHOUT locking: Alice: $${aliceUnsafeBalance}, Bob: $${bobUnsafeBalance}`
        );
        setOutput(
          (prev) =>
            `${prev}\n(Note: Without locking, if both transfers execute concurrently, we might lose updates!)`
        );

        // Reset balances
        await client.executeCommand(
          "SET Account[1].balance TO 1000.0; SET Account[2].balance TO 500.0;"
        );

        // Now demonstrate with proper locking
        setOutput((prev) => `${prev}\n\n2. With LOCK (safe concurrent access)`);

        // Even though these execute concurrently, the LOCK ensures they happen one after another
        const safePromises = [
          client.executeQuery(transferWithLock),
          client.executeQuery(transferWithLock),
        ];

        await Promise.all(safePromises);

        // Check balances after safely concurrent transfers
        const aliceSafeResult = await client.executeQuery(getAliceBalanceQuery);
        const bobSafeResult = await client.executeQuery(getBobBalanceQuery);

        const aliceSafeBalance = client.getResult(aliceSafeResult)?.value;
        const bobSafeBalance = client.getResult(bobSafeResult)?.value;

        setOutput(
          (prev) =>
            `${prev}\nAfter concurrent transfers WITH locking: Alice: $${aliceSafeBalance}, Bob: $${bobSafeBalance}`
        );
        setOutput(
          (prev) =>
            `${prev}\n\nConclusion: Using LOCK ensures that all operations on specified keys are atomic, preventing race conditions even during concurrent execution.`
        );
      } catch (error) {
        const errorMessage =
          error instanceof AxiosError && error.response?.data
            ? JSON.stringify(error.response.data)
            : `${error}`;
        setOutput(`Error in concurrency example: ${errorMessage}`);
      }
    });
  };

  const handleManualExecution = async () => {
    executeOperation(async () => {
      try {
        let result;
        if (commandType === "command") {
          result = await client.executeCommand(manualCommand);
        } else {
          result = await client.executeQuery(manualCommand);
        }
        setOutput(
          `Manual ${commandType} executed successfully!\nResult: ${JSON.stringify(
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
        setOutput(`Error executing manual ${commandType}: ${errorMessage}`);
      }
    });
  };

  const handleExampleSelect = (query: string) => {
    setManualCommand(query);
  };

  return (
    <div className="p-6 px-8 max-w-[90rem] mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
        RedType Demo
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3 text-gray-700">
              Schema Definition
            </h2>
            <textarea
              value={schema}
              onChange={(e) => setSchema(e.target.value)}
              className="w-full h-40 p-3 border rounded-md font-mono text-sm bg-gray-50"
              placeholder="Define your schema here..."
              spellCheck="false"
              autoComplete="off"
            />
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleSetSchema}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Processing..." : "Set Schema"}
              </button>
              <button
                onClick={handleGetSchema}
                disabled={loading}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Get Schema
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md relative">
            <h2 className="text-xl font-semibold mb-3 text-gray-700">
              Manual Execution
            </h2>
            <div className="mb-3">
              <div className="flex gap-2 mb-2">
                <textarea
                  value={manualCommand}
                  onChange={(e) => setManualCommand(e.target.value)}
                  className="w-full h-96 mt-2 p-3 border rounded-md font-mono text-sm bg-gray-50"
                  placeholder={
                    "Select example from dropdown or type your query here..."
                  }
                  spellCheck="false"
                  autoComplete="off"
                />
              </div>
              <div className="mb-3 absolute top-6 right-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="flex items-center gap-1  bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50">
                      Insert Example <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-80">
                    {queryExamples.map((example, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={() => handleExampleSelect(example.query)}
                        className="flex flex-col items-start py-2"
                      >
                        <span className="font-medium">{example.name}</span>
                        <span className="text-xs text-gray-500">
                          {example.description}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <button
              onClick={handleManualExecution}
              disabled={loading || !manualCommand.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              Execute {commandType === "command" ? "Command" : "Query"}
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3 text-gray-700">
              Operations
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleGetStats}
                disabled={loading}
                className="px-4 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
              >
                Get Stats
              </button>
              <button
                onClick={handleBigExample}
                disabled={loading}
                className="px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Run Big Example
              </button>
              <button
                onClick={handleConcurrencyExample}
                disabled={loading}
                className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 col-span-2"
              >
                Concurrency Example (LOCK Demo)
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-gray-700">Output</h2>
            {loading && !progress && (
              <div className="flex items-center text-blue-600">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
            )}
          </div>

          {progress && (
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-blue-700">
                  {progress.message}
                </span>
                <span className="text-sm font-medium text-blue-700">
                  {progress.step}/{progress.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${(progress.step / progress.total) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          <div className="h-[calc(100vh-320px)] overflow-auto">
            <pre className="w-full p-4 bg-gray-50 rounded-md border whitespace-pre-wrap font-mono text-sm">
              {output || "No output yet. Run an operation to see results."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

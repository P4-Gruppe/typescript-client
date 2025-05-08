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
        <div className="space-x-2">
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

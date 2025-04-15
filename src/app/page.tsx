'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function SandboxPage() {
  const defaultPrompt = `type Post {
    id: String @key("primary"),
    author: Ref<User>,
    content: String @maxlen(1000),
    tags: List<String> @maxlen(20),
    views: Int @min(0) @default(0),
    created: Timestamp @index,
    updated: Timestamp @index,
}`;
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse('');

    try {
      // Replace with actual API call
      const res = await fetch('/api/redtype/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: prompt,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({})); // Try to parse error details
        throw new Error(`HTTP error! status: ${res.status} - ${errorData.error || 'Unknown error'}`);
      }

      const data = await res.text();

      setResponse(data);
    } catch (err) {
      console.error('Error sending prompt:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Redtype Sandbox</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <label htmlFor="prompt" className="block mb-2 font-medium">Enter Prompt:</label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          rows={4}
          required
          placeholder="Enter your prompt here"
        />
        <Button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          disabled={isLoading || !prompt}
        >
          {isLoading ? 'Sending...' : 'Send Prompt'}
        </Button>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {response && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Response:</h2>
          <pre className="bg-green-100 p-4 rounded text-black whitespace-pre-wrap">{response}</pre>
        </div>
      )}
    </div>
  );
} 
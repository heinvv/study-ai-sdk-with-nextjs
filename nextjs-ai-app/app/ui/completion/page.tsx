"use client";

import { useState } from "react";

export default function CompletionPage() {
  const [prompt, setPrompt] = useState("");
  const [completion, setCompletion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState< string | null>(null);
 
  const complete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setPrompt("");

    try {
        const response = await fetch("/api/completion", {
            method: "POST",
            body: JSON.stringify({ prompt }),
        });
        const data = await response.json();


        if (!response.ok) {
            throw new Error( data.error || "Failed to fetch completion");
        }

        setCompletion(data.text);
    } catch (error) {
        console.log("Error: ", error);
        setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
        setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">

        { error && <p className="text-red-500 mb-4">{error}</p> }

        { isLoading ? (
            <p>Loading...</p>
        ) : completion ? (
            <p>{completion}</p>
        ) : null }

      <form 
        className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg"
        onSubmit={complete}
      >
        <div className="flex gap-2">
          <input
            className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="How can I help you?"
          />
          <button
            disabled={isLoading }
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

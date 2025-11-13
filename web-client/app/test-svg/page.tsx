"use client"

import { useState } from "react"

export default function TestSVGPage() {
  const [username, setUsername] = useState("github")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const usernames = [
    { value: "github", label: "Github" },
    { value: "lastfm", label: "LastFM" },
    { value: "myanimelist", label: "MyAnimeList" },
  ]

  const svgUrl = `/api/svg/${username}`

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Test SVG API</h1>

      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select SVG:</label>
          <select
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            {usernames.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">API URL:</label>
          <code className="block p-2 bg-gray-100 rounded text-sm break-all">
            {svgUrl}
          </code>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Markdown:</label>
          <code className="block p-2 bg-gray-100 rounded text-sm break-all">
            {`![Profile](${svgUrl})`}
          </code>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`![Profile](${svgUrl})`)
              alert("Copied to clipboard!")
            }}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Copy Markdown
          </button>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-white">
        <h2 className="text-xl font-semibold mb-4">Preview:</h2>
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <img
            src={svgUrl}
            alt="SVG Preview"
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false)
              setError("Failed to load SVG")
            }}
            className="max-w-full"
          />
        )}
        {loading && <div>Loading...</div>}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">How to use:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Select a SVG from the dropdown</li>
          <li>Copy the markdown code</li>
          <li>Paste it in your README.md</li>
          <li>The SVG will be served from: <code>{svgUrl}</code></li>
        </ol>
      </div>
    </div>
  )
}


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Unsubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [unsubscribeLoading, setUnsubscribeLoading] = useState(false);
  const navigate = useNavigate();

  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    setUnsubscribeLoading(true);
    try {
      // Updated fetch URL with full backend address
      const response = await fetch("https://raywoodind.onrender.com/api/unsubscribe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users: [{ email }] }),
      });

      // Parse JSON response
      const data = await response.json();

      if (data.message === "Already unsubscribed") {
        setStatus("not_found");
      } else if (
        data.message === "Successfully unsubscribed user(s)" ||
        data.message === "Unsubscribed successfully"
      ) {
        setStatus("unsubscribed");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Unsubscribe error:", error);
      setStatus("error");
    } finally {
      setUnsubscribeLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center justify-center px-6 relative">
      {/* Back Arrow */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center text-blue-600 hover:text-blue-800"
        aria-label="Back to homepage"
      >
        <svg
          className="w-6 h-6 mr-1"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Home
      </button>
      <h1 className="text-3xl font-bold mb-6">Unsubscribe from Newsletter</h1>
      {status === null && (
        <form onSubmit={handleUnsubscribe} className="w-full max-w-md space-y-4">
          <input
            type="email"
            placeholder="Your Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded text-gray-800"
          />
          <button
            type="submit"
            className={`bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded ${
              unsubscribeLoading ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400" : ""
            }`}
            disabled={unsubscribeLoading}
          >
            {unsubscribeLoading ? "Unsubscribing..." : "Unsubscribe"}
          </button>
        </form>
      )}

      {status === "not_found" && (
        <div className="text-center mt-6">
          <p className="text-lg text-gray-700 mb-4">You're already unsubscribed.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Return to Homepage
          </button>
        </div>
      )}

      {status === "unsubscribed" && (
        <p className="text-green-600 text-lg mt-6">You've been unsubscribed successfully.</p>
      )}

      {status === "error" && (
        <p className="text-red-600 text-lg mt-6">There was a problem unsubscribing. Please try again later.</p>
      )}
    </div>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";

export default function AlreadySubscribed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 px-6">
      <h1 className="text-3xl font-bold mb-4">You're Already Subscribed</h1>
      <p className="mb-6 text-lg text-gray-700">
        The email you entered is already subscribed to our newsletter.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
      >
        Return to Homepage
      </button>
    </div>
  );
}
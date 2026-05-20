import React, { useState } from "react";
import axios from "axios";

const RegulatoryChecker = () => {
  const [query, setQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiError, setAiError] = useState("");

  const handleAiSearch = async () => {
    if (!query.trim()) return;

    setAiLoading(true);
    setAiResult(null);
    setAiError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/check-ingredient",
        {
          ingredient: query,
        }
      );

      setAiResult(response.data);
    } catch (error) {
      console.error(error);
      setAiError("Failed to analyze ingredient");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ fontSize: "40px", marginBottom: "20px" }}>
        WellnessRadar AI
      </h1>

      <p style={{ marginBottom: "20px", color: "#cbd5e1" }}>
        AI Ingredient & Regulatory Safety Checker
      </p>

      <input
        type="text"
        placeholder="Enter ingredient name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: "12px",
          width: "300px",
          borderRadius: "8px",
          border: "none",
          marginRight: "10px",
        }}
      />

      <button
        onClick={handleAiSearch}
        style={{
          padding: "12px 20px",
          borderRadius: "8px",
          border: "none",
          background: "#2563eb",
          color: "white",
          cursor: "pointer",
        }}
      >
        Analyze
      </button>

      {aiLoading && (
        <p style={{ marginTop: "20px" }}>Analyzing ingredient...</p>
      )}

      {aiError && (
        <p style={{ marginTop: "20px", color: "red" }}>{aiError}</p>
      )}

      {aiResult && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            background: "#1e293b",
            borderRadius: "12px",
          }}
        >
          <h2>Analysis Result</h2>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              marginTop: "10px",
            }}
          >
            {JSON.stringify(aiResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default RegulatoryChecker;
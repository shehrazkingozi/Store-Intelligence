"use client";

import { useState } from "react";

export default function IdeationPage() {
  const [idea, setIdea] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    
    setAnalyzing(true);
    setResult(null);
    
    // Simulate AI delay
    setTimeout(() => {
      setResult({
        market_gap: "Medium to High",
        difficulty: "Moderate",
        target_audience: "Gen Z & Millennials",
        suggested_keywords: [
          { word: idea.split(" ")[0].toLowerCase() + " app", vol: 65000, diff: "High" },
          { word: "best " + idea.split(" ")[0].toLowerCase(), vol: 12000, diff: "Low" },
          { word: idea.toLowerCase() + " free", vol: 45000, diff: "Medium" },
          { word: "new " + idea.toLowerCase(), vol: 8500, diff: "Low" }
        ],
        summary: `Based on current App Store and Google Play trends, the concept of "${idea}" shows strong potential. While primary keywords are highly competitive, there is a clear opportunity in long-tail search queries and niche market gaps.`
      });
      setAnalyzing(false);
    }, 2500);
  };

  return (
    <main className="container">
      <h1 className="title">AI Ideation Engine <span className="badge">Beta</span></h1>
      <p style={{color: "var(--text-muted)", marginBottom: "2rem", maxWidth: "800px", fontSize: "1.1rem"}}>
        Describe your app idea below. Our AI will analyze real-time market data, competitor density, and search intent to validate your concept and suggest winning ASO keywords.
      </p>

      <div style={{background: "var(--panel-bg)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--border-color)", marginBottom: "2rem"}}>
        <form onSubmit={handleAnalyze}>
          <textarea 
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="E.g. A hypercasual game where you play as a flying cat collecting sushi..."
            style={{
              width: "100%", height: "120px", padding: "1rem", borderRadius: "0.5rem", 
              border: "1px solid var(--border-color)", background: "rgba(255,255,255,0.02)", 
              color: "white", fontSize: "1rem", marginBottom: "1rem", resize: "none"
            }}
          />
          <button 
            type="submit" 
            disabled={analyzing || !idea.trim()}
            style={{
              background: "var(--accent-color)", color: "white", padding: "0.8rem 2rem",
              borderRadius: "2rem", border: "none", fontWeight: 600, fontSize: "1rem",
              cursor: analyzing ? "not-allowed" : "pointer", opacity: analyzing ? 0.7 : 1
            }}
          >
            {analyzing ? "🧠 Analyzing Market Data..." : "Generate AI Analysis"}
          </button>
        </form>
      </div>

      {result && (
        <div style={{animation: "fadeIn 0.5s ease-out"}}>
          <div className="grid" style={{marginBottom: "2rem"}}>
            <div className="card">
              <div className="card-title">Market Gap</div>
              <div style={{fontSize: "2rem", fontWeight: "bold", color: "var(--accent-color)"}}>{result.market_gap}</div>
            </div>
            <div className="card">
              <div className="card-title">Entry Difficulty</div>
              <div style={{fontSize: "2rem", fontWeight: "bold", color: "#facc15"}}>{result.difficulty}</div>
            </div>
            <div className="card">
              <div className="card-title">Target Audience</div>
              <div style={{fontSize: "2rem", fontWeight: "bold"}}>{result.target_audience}</div>
            </div>
          </div>

          <div className="card" style={{marginBottom: "2rem"}}>
            <h3 style={{marginBottom: "1rem"}}>AI Executive Summary</h3>
            <p style={{lineHeight: 1.6, color: "var(--text-muted)"}}>{result.summary}</p>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Suggested Keyword</th>
                  <th>Search Volume</th>
                  <th>Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {result.suggested_keywords.map((kw: any, idx: number) => (
                  <tr key={idx}>
                    <td style={{fontWeight: 600}}>{kw.word}</td>
                    <td>{kw.vol.toLocaleString()}</td>
                    <td>
                      <span className={`difficulty-badge ${kw.diff === 'Low' ? 'difficulty-low' : kw.diff === 'High' ? 'difficulty-high' : 'difficulty-med'}`}>
                        {kw.diff}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}

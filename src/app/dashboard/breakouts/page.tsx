"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface AppInfo {
  app_id: string;
  title: string;
  developer: string;
  icon_url: string;
  store: string;
}

interface BreakoutSignal {
  app: AppInfo;
  rank_change: string;
  momentum_score: number;
}

export default function BreakoutsPage() {
  const [signals, setSignals] = useState<BreakoutSignal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/breakouts`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSignals(data);
        } else {
          console.error("Failed to load breakouts:", data);
          setSignals([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setSignals([]);
        setLoading(false);
      });
  }, []);

  return (
    <main className="container" style={{paddingTop: "2rem"}}>
      <h1 className="title">🚀 Breakout Signals</h1>
      <p style={{color: "var(--text-muted)", marginBottom: "3rem", fontSize: "1.1rem"}}>
        Discover apps with the highest momentum across all stores. These apps are climbing the charts rapidly.
      </p>

      {loading ? (
        <div className="loading">Analyzing Market Momentum...</div>
      ) : (
        <div className="grid">
          {signals.map((signal, idx) => (
            <Link 
              key={idx} 
              href={`/dashboard/${signal.app.store}/${signal.app.app_id}`}
              className="card"
              style={{textDecoration: 'none', position: 'relative'}}
            >
              <div style={{position: 'absolute', top: '-10px', right: '-10px', background: 'var(--accent-color)', color: '#000', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontWeight: 'bold', fontSize: '0.8rem', boxShadow: '0 0 10px rgba(74, 222, 128, 0.5)'}}>
                {signal.rank_change} Ranks
              </div>
              <div style={{display: "flex", gap: "1rem", alignItems: "center"}}>
                <img src={signal.app.icon_url || "https://via.placeholder.com/150"} alt={signal.app.title} className="card-icon" />
                <div className="card-content">
                  <h3 className="card-title" style={{fontSize: "1.1rem"}}>{signal.app.title}</h3>
                  <p className="card-developer" style={{fontSize: "0.9rem"}}>{signal.app.developer}</p>
                  <div style={{marginTop: "0.5rem"}}>
                    <span className="badge">Momentum: {signal.momentum_score}/100</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

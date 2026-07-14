"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface AppInfo {
  app_id: string;
  title: string;
  developer: string;
  description: string;
  icon_url: string;
  url: string;
  rating: number;
  reviews_count: number;
  store: string;
}

interface AppKeyword {
  keyword: string;
  rank: number;
  search_volume: number;
  difficulty: number;
}

interface AppHistory {
  date: string;
  rank: number;
}

export default function AppDetails() {
  const params = useParams();
  const store = params.store as string;
  const id = params.id as string;
  
  const [app, setApp] = useState<AppInfo | null>(null);
  const [keywords, setKeywords] = useState<AppKeyword[]>([]);
  const [history, setHistory] = useState<AppHistory[]>([]);
  const [competitors, setCompetitors] = useState<AppInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [appRes, kwRes, histRes, compRes] = await Promise.all([
          fetch(`http://localhost:8000/api/app/${store}/${id}`),
          fetch(`http://localhost:8000/api/app/${store}/${id}/keywords`),
          fetch(`http://localhost:8000/api/app/${store}/${id}/history`),
          fetch(`http://localhost:8000/api/app/${store}/${id}/competitors`)
        ]);
        
        if (appRes.ok) setApp(await appRes.json());
        if (kwRes.ok) setKeywords(await kwRes.json());
        if (histRes.ok) setHistory(await histRes.json());
        if (compRes.ok) setCompetitors(await compRes.json());
      } catch (error) {
        console.error("Failed to fetch app details", error);
      }
      setLoading(false);
    };

    if (store && id) {
      fetchData();
    }
  }, [store, id]);

  if (loading) return <div className="container loading">Loading Intelligence Data...</div>;
  if (!app) return <div className="container loading">App not found in database.</div>;

  return (
    <main className="container">
      <div style={{marginBottom: "2rem"}}>
        <Link href="/dashboard" style={{color: "var(--accent-color)", textDecoration: "none", fontWeight: 600}}>
          &larr; Back to Dashboard
        </Link>
      </div>

      <header className="header" style={{alignItems: "flex-start", gap: "2rem"}}>
        <img 
          src={app.icon_url || "https://via.placeholder.com/150"} 
          alt={app.title} 
          style={{width: "120px", height: "120px", borderRadius: "1.5rem"}}
        />
        <div style={{flex: 1}}>
          <h1 style={{fontSize: "2rem", marginBottom: "0.5rem"}}>{app.title}</h1>
          <p style={{color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "1rem"}}>{app.developer}</p>
          
          <div style={{display: "flex", gap: "1rem", marginBottom: "1rem"}}>
            <span className="rank-badge">Store: {app.store.toUpperCase()}</span>
            {app.rating > 0 && <span className="badge">★ {app.rating.toFixed(1)}</span>}
            {app.reviews_count > 0 && <span className="badge" style={{background: "rgba(255,255,255,0.05)", color: "#fff"}}>
              {app.reviews_count.toLocaleString()} Reviews
            </span>}
          </div>
          
          <p style={{color: "var(--text-muted)", lineHeight: 1.6, fontSize: "0.95rem"}}>
            {app.description}
          </p>
          
          <div style={{marginTop: "1.5rem"}}>
             <a href={app.url} target="_blank" rel="noopener noreferrer" 
                style={{
                  background: "var(--accent-color)", 
                  color: "#000", 
                  padding: "0.5rem 1.5rem", 
                  borderRadius: "2rem", 
                  textDecoration: "none",
                  fontWeight: 600
                }}>
               View on Store
             </a>
          </div>
        </div>
      </header>

      <h2 style={{fontSize: "1.5rem", marginBottom: "1rem", marginTop: "3rem"}}>ASO Keyword Intelligence</h2>
      <p style={{color: "var(--text-muted)", marginBottom: "1rem"}}>
        Track the search terms where this app ranks on the top charts.
      </p>

      {keywords.length === 0 ? (
        <div className="loading" style={{padding: "2rem"}}>No keyword data available for this app yet.</div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Keyword</th>
                <th>Rank</th>
                <th>Search Volume</th>
                <th>Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {keywords.map((kw, idx) => {
                let diffClass = "difficulty-low";
                if (kw.difficulty > 40) diffClass = "difficulty-med";
                if (kw.difficulty > 75) diffClass = "difficulty-high";
                
                return (
                  <tr key={idx}>
                    <td style={{fontWeight: 600}}>{kw.keyword}</td>
                    <td><span className="badge">#{kw.rank}</span></td>
                    <td>{kw.search_volume.toLocaleString()}</td>
                    <td>
                      <span className={`difficulty-badge ${diffClass}`}>
                        {kw.difficulty}/100
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {history.length > 0 && (
        <>
          <h2 style={{fontSize: "1.5rem", marginBottom: "1rem", marginTop: "3rem"}}>30-Day Rank History</h2>
          <div className="data-table-container" style={{padding: "2rem"}}>
            <LineChart width={1000} height={300} data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
              <YAxis reversed stroke="rgba(255,255,255,0.5)" domain={['dataMin - 5', 'dataMax + 5']} />
              <Tooltip 
                contentStyle={{backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem"}}
                itemStyle={{color: "#fff"}}
              />
              <Line type="monotone" dataKey="rank" stroke="var(--accent-color)" strokeWidth={3} dot={{r: 4}} activeDot={{r: 8}} />
            </LineChart>
          </div>
        </>
      )}

      {competitors.length > 0 && (
        <>
          <h2 style={{fontSize: "1.5rem", marginBottom: "1rem", marginTop: "3rem"}}>Top Competitors</h2>
          <div className="grid">
            {competitors.map((comp) => (
              <Link 
                key={`${comp.store}-${comp.app_id}`} 
                href={`/dashboard/${comp.store}/${comp.app_id}`}
                className="card"
                style={{textDecoration: 'none'}}
              >
                <div style={{display: "flex", gap: "1rem", alignItems: "center"}}>
                  <img src={comp.icon_url || "https://via.placeholder.com/150"} alt={comp.title} className="card-icon" />
                  <div className="card-content">
                    <h3 className="card-title" style={{fontSize: "1.1rem"}}>{comp.title}</h3>
                    <p className="card-developer" style={{fontSize: "0.9rem"}}>{comp.developer}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

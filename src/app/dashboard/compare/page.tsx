"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Search, Info, TrendingUp, AlertTriangle } from "lucide-react";

export default function ComparePage() {
  const [appId1, setAppId1] = useState("com.whatsapp");
  const [appId2, setAppId2] = useState("org.telegram.messenger");
  const [loading, setLoading] = useState(false);
  const [data1, setData1] = useState<any>(null);
  const [data2, setData2] = useState<any>(null);
  const [error, setError] = useState("");

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setData1(null);
    setData2(null);

    try {
      // Fetch both apps concurrently
      const [res1, res2] = await Promise.all([
        fetch(`http://localhost:8000/api/extension/app?id=${appId1}`),
        fetch(`http://localhost:8000/api/extension/app?id=${appId2}`)
      ]);

      const d1 = await res1.json();
      const d2 = await res2.json();

      if (d1.success && d2.success) {
        setData1(d1.data);
        setData2(d2.data);
      } else {
        setError("Failed to fetch one or both apps. Please check the App IDs.");
      }
    } catch (err) {
      setError("Network error while fetching data.");
    }
    setLoading(false);
  };

  const parseDownloads = (downloads: string) => {
    if (!downloads) return 0;
    const num = parseInt(downloads.replace(/[^0-9]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  // Prepare data for the radar chart (Comparing generic strengths)
  const getRadarData = () => {
    if (!data1 || !data2) return [];
    
    // Normalize values to a 0-100 scale for comparison
    const maxDownloads = Math.max(parseDownloads(data1.downloads), parseDownloads(data2.downloads)) || 1;
    const maxReviews = Math.max(data1.reviews || 0, data2.reviews || 0) || 1;

    return [
      {
        subject: 'Rating',
        A: (data1.rating / 5) * 100,
        B: (data2.rating / 5) * 100,
        fullMark: 100,
      },
      {
        subject: 'Market Share (Installs)',
        A: (parseDownloads(data1.downloads) / maxDownloads) * 100,
        B: (parseDownloads(data2.downloads) / maxDownloads) * 100,
        fullMark: 100,
      },
      {
        subject: 'User Engagement (Reviews)',
        A: ((data1.reviews || 0) / maxReviews) * 100,
        B: ((data2.reviews || 0) / maxReviews) * 100,
        fullMark: 100,
      },
      {
        subject: 'Growth Potential',
        A: 80, // Simulated metric
        B: 65,
        fullMark: 100,
      },
      {
        subject: 'Monetization (IAP)',
        A: data1.inAppPurchases ? 90 : 30,
        B: data2.inAppPurchases ? 90 : 30,
        fullMark: 100,
      },
    ];
  };

  return (
    <main className="container">
      <header className="header" style={{marginBottom: "2rem"}}>
        <div>
          <h1 className="title" style={{display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem"}}>
            <TrendingUp size={28} color="#facc15" /> Competitor Analysis (Pro)
          </h1>
          <p style={{color: "var(--text-muted)", fontSize: "1.1rem"}}>
            Compare live performance metrics between two competitor apps side-by-side.
          </p>
        </div>
      </header>

      <div className="card" style={{padding: "2rem", marginBottom: "2rem"}}>
        <form onSubmit={handleCompare} style={{display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap"}}>
          <div style={{flex: 1, minWidth: "250px"}}>
            <label style={{display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-muted)"}}>App 1 (Target)</label>
            <input 
              type="text" 
              value={appId1}
              onChange={(e) => setAppId1(e.target.value)}
              className="input-field" 
              placeholder="e.g. com.whatsapp"
              style={{width: "100%", padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border-color)", background: "rgba(255,255,255,0.05)", color: "white"}}
              required
            />
          </div>
          <div style={{display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.2rem", padding: "1rem"}}>
            VS
          </div>
          <div style={{flex: 1, minWidth: "250px"}}>
            <label style={{display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-muted)"}}>App 2 (Competitor)</label>
            <input 
              type="text" 
              value={appId2}
              onChange={(e) => setAppId2(e.target.value)}
              className="input-field" 
              placeholder="e.g. org.telegram.messenger"
              style={{width: "100%", padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border-color)", background: "rgba(255,255,255,0.05)", color: "white"}}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary" 
            style={{marginTop: "1.6rem", padding: "0.8rem 2rem", background: "#facc15", color: "black", fontWeight: "bold", borderRadius: "0.5rem", cursor: "pointer", border: "none"}}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Compare Now"}
          </button>
        </form>
        {error && <div style={{color: "#ef4444", marginTop: "1rem"}}><AlertTriangle size={16} style={{display:"inline", verticalAlign:"middle"}}/> {error}</div>}
      </div>

      {loading && (
        <div style={{textAlign: "center", padding: "3rem", color: "var(--text-muted)"}}>
          <div className="spinner" style={{marginBottom: "1rem"}}></div>
          Fetching live data from Google Play...
        </div>
      )}

      {data1 && data2 && !loading && (
        <div style={{display: "flex", flexDirection: "column", gap: "2rem"}}>
          
          {/* Top Level Comparison Cards */}
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem"}}>
            <div className="card" style={{padding: "2rem", textAlign: "center"}}>
              <img src={data1.icon} alt={data1.title} style={{width: 100, borderRadius: 20, margin: "0 auto 1rem"}} />
              <h2 style={{fontSize: "1.5rem", marginBottom: "0.5rem"}}>{data1.title}</h2>
              <div style={{color: "var(--text-muted)", marginBottom: "1rem"}}>{data1.developer}</div>
              <div style={{fontSize: "2rem", fontWeight: "bold", color: "#16A34A"}}>{data1.rating} ★</div>
              <div style={{color: "var(--text-muted)", fontSize: "0.9rem"}}>{data1.downloads} Installs</div>
            </div>

            <div className="card" style={{padding: "2rem", textAlign: "center"}}>
              <img src={data2.icon} alt={data2.title} style={{width: 100, borderRadius: 20, margin: "0 auto 1rem"}} />
              <h2 style={{fontSize: "1.5rem", marginBottom: "0.5rem"}}>{data2.title}</h2>
              <div style={{color: "var(--text-muted)", marginBottom: "1rem"}}>{data2.developer}</div>
              <div style={{fontSize: "2rem", fontWeight: "bold", color: "#ef4444"}}>{data2.rating} ★</div>
              <div style={{color: "var(--text-muted)", fontSize: "0.9rem"}}>{data2.downloads} Installs</div>
            </div>
          </div>

          {/* Visual Data Comparison */}
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem"}}>
            
            {/* Radar Chart */}
            <div className="card" style={{padding: "1.5rem"}}>
              <h3 style={{marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem"}}>
                <Info size={20} color="#60a5fa" /> Market Positioning
              </h3>
              <div style={{height: 350, width: "100%"}}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getRadarData()}>
                    <PolarGrid stroke="rgba(255,255,255,0.2)" />
                    <PolarAngleAxis dataKey="subject" tick={{fill: "#94a3b8", fontSize: 12}} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name={data1.title} dataKey="A" stroke="#16A34A" fill="#16A34A" fillOpacity={0.5} />
                    <Radar name={data2.title} dataKey="B" stroke="#ef4444" fill="#ef4444" fillOpacity={0.5} />
                    <Legend />
                    <Tooltip contentStyle={{backgroundColor: "#1e293b", borderColor: "#334155"}} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Direct Metrics Table */}
            <div className="card" style={{padding: "1.5rem"}}>
              <h3 style={{marginBottom: "1rem"}}>Detailed Metrics</h3>
              <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.95rem"}}>
                <thead>
                  <tr style={{borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)", textAlign: "left"}}>
                    <th style={{padding: "1rem 0"}}>Metric</th>
                    <th style={{padding: "1rem 0"}}>{data1.title.substring(0,15)}...</th>
                    <th style={{padding: "1rem 0"}}>{data2.title.substring(0,15)}...</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{borderBottom: "1px solid rgba(255,255,255,0.05)"}}>
                    <td style={{padding: "1rem 0", color: "var(--text-muted)"}}>Release Date</td>
                    <td>{data1.released || "N/A"}</td>
                    <td>{data2.released || "N/A"}</td>
                  </tr>
                  <tr style={{borderBottom: "1px solid rgba(255,255,255,0.05)"}}>
                    <td style={{padding: "1rem 0", color: "var(--text-muted)"}}>Last Updated</td>
                    <td>{data1.updated || "N/A"}</td>
                    <td>{data2.updated || "N/A"}</td>
                  </tr>
                  <tr style={{borderBottom: "1px solid rgba(255,255,255,0.05)"}}>
                    <td style={{padding: "1rem 0", color: "var(--text-muted)"}}>Monetization</td>
                    <td>{data1.inAppPurchases ? "IAP" : (data1.containsAds ? "Ads" : "Free")}</td>
                    <td>{data2.inAppPurchases ? "IAP" : (data2.containsAds ? "Ads" : "Free")}</td>
                  </tr>
                  <tr style={{borderBottom: "1px solid rgba(255,255,255,0.05)"}}>
                    <td style={{padding: "1rem 0", color: "var(--text-muted)"}}>Content Rating</td>
                    <td>{data1.contentRating}</td>
                    <td>{data2.contentRating}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}

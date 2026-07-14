"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Apple, Lock, Bookmark, ArrowLeft } from "lucide-react";
import Link from "next/link";

const GooglePlayIcon = () => (
  <svg viewBox="0 0 48 48" width="18" height="18" style={{ marginRight: '4px' }}>
    <path fill="#4caf50" d="M37.9,21.8l-23.7-13.6c-1.3-0.8-2.9-0.8-4.2,0C8.7,9,8,10.2,8,11.5v25c0,1.3,0.7,2.5,2,3.3 c0.7,0.4,1.4,0.6,2.1,0.6c0.7,0,1.4-0.2,2.1-0.6l23.7-13.6c1.3-0.8,2-2.1,2-3.3C39.9,23.9,39.2,22.6,37.9,21.8z"/>
    <path fill="#388e3c" d="M10,11.5c0-1.3,0.7-2.5,2-3.3C10.7,9,10,10.2,10,11.5v25c0,1.3,0.7,2.5,2,3.3C10.7,39,10,37.8,10,36.5V11.5z"/>
  </svg>
);

function formatDateDisplay(dateStr: string) {
  if (!dateStr || dateStr === "N/A") return "N/A";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

export default function AppDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const appId = params.appId as string;
  const store = searchParams.get("store") || "playstore";
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    if (!appId) return;
    
    fetch(`/api/app-details?appId=${encodeURIComponent(appId)}&store=${store}`)
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          setData(resData.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [appId, store]);

  if (loading) {
    return <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "4rem", textAlign: "center", color: "#64748b" }}>Loading App Data...</div>;
  }

  if (!data) {
    return <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "4rem", textAlign: "center", color: "#64748b" }}>App not found or failed to load.</div>;
  }

  const isAppStore = store === 'appstore';
  const storeUrl = data.url || (isAppStore 
    ? `https://apps.apple.com/app/id${data.appId}`
    : `https://play.google.com/store/apps/details?id=${data.appId}`);

  // Fake chart data for UI purposes until we pull from daily_stats
  const chartData = [
    { date: '2026-06-22', installs: 0 },
    { date: '2026-06-29', installs: 1000 },
    { date: '2026-07-06', installs: 5000 },
    { date: '2026-07-13', installs: 124000 }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif", paddingBottom: "4rem" }}>
      {/* Top Banner (Locked) */}
      <div style={{ background: "white", padding: "12px", display: "flex", justifyContent: "center", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#f8fafc", padding: "0.4rem 1.2rem", borderRadius: "20px", border: "1px solid #e2e8f0", fontSize: "0.9rem", color: "#0f172a", fontWeight: 500 }}>
          <Lock size={14} color="#64748b" /> AI signal narratives are locked
          <button style={{ background: "#0f172a", color: "white", border: "none", borderRadius: "12px", padding: "0.2rem 0.6rem", fontSize: "0.8rem", marginLeft: "0.5rem", cursor: "pointer" }}>Upgrade</button>
        </div>
      </div>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <Link href="/dashboard/search" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#64748b", textDecoration: "none", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
          <ArrowLeft size={16} /> Back to Search
        </Link>

        {/* Header Card */}
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem", display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          <img src={data.icon} style={{ width: "120px", height: "120px", borderRadius: "24px", objectFit: "cover" }} />
          <div style={{ flex: 1, minWidth: "300px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#0f172a" }}>{data.title}</h1>
              <div style={{ background: "#f59e0b", borderRadius: "4px", padding: "4px" }}><Bookmark size={14} color="white" /></div>
            </div>
            <div style={{ color: "#3b82f6", fontSize: "0.95rem", margin: "0.4rem 0" }}>by {data.developer}</div>
            <div style={{ color: "#64748b", fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              <span>Released: {formatDateDisplay(data.released)}</span>
              <span>Last Refreshed: Just now</span>
            </div>
            <div style={{ marginTop: "0.8rem" }}>
              <span style={{ background: "#dcfce7", color: "#166534", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 600 }}>NEW</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.8rem", minWidth: "200px" }}>
            <a href={storeUrl} target="_blank" rel="noopener noreferrer" style={{ background: "#6366f1", color: "white", textDecoration: "none", padding: "0.6rem 1.2rem", borderRadius: "8px", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.2rem" }}>⚡</span> Actions v
            </a>
            <a href={storeUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", color: "#3b82f6", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>
              {isAppStore ? <Apple size={16} style={{ marginRight: '4px' }}/> : <GooglePlayIcon />}
              {isAppStore ? "View on App Store" : "View on Google Play"}
            </a>
            <div style={{ color: "#475569", fontSize: "0.9rem" }}>Genre: <span style={{ color: "#0f172a" }}>{data.genre}</span></div>
            <div style={{ color: "#475569", fontSize: "0.9rem" }}>Rating: <span style={{ color: "#0f172a" }}>{data.score} ({data.ratings.toLocaleString()} reviews)</span></div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem" }}>
            <div style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "0.5rem" }}>Total Downloads</div>
            <div style={{ fontSize: "1.8rem", fontWeight: 600, color: "#0f172a" }}>{data.installs}</div>
          </div>
          <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem" }}>
            <div style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "0.5rem" }}>Category Ranking</div>
            <div style={{ fontSize: "1.8rem", fontWeight: 600, color: "#0f172a" }}>#3</div>
            <div style={{ color: "#94a3b8", fontSize: "0.75rem", marginTop: "0.5rem" }}>Top New Free Games {'>'} Casual, US</div>
          </div>
          <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem" }}>
            <div style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "0.5rem" }}>Avg Daily Installs</div>
            <div style={{ fontSize: "1.8rem", fontWeight: 600, color: "#0f172a" }}>N/A</div>
          </div>
          <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem" }}>
            <div style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "0.5rem" }}>Last Update</div>
            <div style={{ fontSize: "1.8rem", fontWeight: 600, color: "#0f172a" }}>{formatDateDisplay(new Date().toISOString())}</div>
            <span style={{ display: "inline-block", background: "#fef3c7", color: "#b45309", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 600, marginTop: "0.5rem" }}>RECENTLY UPDATED</span>
          </div>
        </div>

        {/* Screenshots */}
        {data.screenshots && data.screenshots.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.2rem", color: "#0f172a", marginBottom: "1rem" }}>Screenshots</h2>
            <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "1rem" }}>
              {data.screenshots.map((img: string, i: number) => (
                <img key={i} src={img} style={{ height: "300px", borderRadius: "12px", objectFit: "contain", background: "#000" }} />
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.2rem", color: "#0f172a", marginBottom: "1rem" }}>Description</h2>
          <div style={{ color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.5rem" }}>FULL DESCRIPTION</div>
          <div 
            style={{ color: "#334155", fontSize: "0.95rem", lineHeight: "1.6", whiteSpace: "pre-wrap", maxHeight: showFullDesc ? "none" : "150px", overflow: "hidden", position: "relative" }}
            dangerouslySetInnerHTML={{ __html: data.description || "N/A" }}
          />
          {!showFullDesc && (
            <div style={{ background: "linear-gradient(transparent, white)", height: "40px", marginTop: "-40px", position: "relative" }} />
          )}
          <button 
            onClick={() => setShowFullDesc(!showFullDesc)} 
            style={{ color: "#3b82f6", background: "none", border: "none", cursor: "pointer", padding: "0", marginTop: "0.5rem", fontWeight: 500 }}
          >
            {showFullDesc ? "View less" : "View more"}
          </button>
        </div>

        {/* Performance Chart */}
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.2rem", color: "#0f172a", marginBottom: "1rem" }}>Performance</h2>
          <div style={{ height: "300px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => val.toLocaleString()} />
                <Tooltip />
                <Line type="monotone" dataKey="installs" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#f97316', strokeWidth: 0, r: 6 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Similar Titles */}
        {data.similar_apps && data.similar_apps.length > 0 && (
          <div>
            <h2 style={{ fontSize: "1.2rem", color: "#0f172a", marginBottom: "1rem" }}>Similar Titles</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
              {data.similar_apps.map((sim: any, i: number) => (
                <div key={i} style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1rem", textAlign: "center", cursor: "pointer", transition: "transform 0.2s" }} onClick={() => window.open(sim.url, '_blank')}>
                  <img src={sim.icon} style={{ width: "80px", height: "80px", borderRadius: "16px", marginBottom: "0.8rem", objectFit: "cover" }} />
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "0.3rem" }}>{sim.title}</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{sim.developer}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

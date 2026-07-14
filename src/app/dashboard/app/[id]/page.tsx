"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AppDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [appData, setAppData] = useState<any>(null);
  const [similarApps, setSimilarApps] = useState<any[]>([]);
  const [appRank, setAppRank] = useState<{rank: string|number, category: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [activeTab, setActiveTab] = useState('Daily Installs');

  useEffect(() => {
    if (!id) return;
    
    const fetchDetails = async () => {
      try {
        const [res, similarRes, rankRes] = await Promise.all([
          fetch(`/api/app-details?appId=${id}`),
          fetch(`/api/app-similar?appId=${id}`),
          fetch(`/api/app-rank?appId=${id}`)
        ]);
        
        const json = await res.json();
        const similarJson = await similarRes.json();
        const rankJson = await rankRes.json();
        
        if (json.success && json.data) {
          setAppData(json.data);
        }
        if (similarJson.success && similarJson.data) {
          setSimilarApps(similarJson.data);
        }
        if (rankJson.success) {
          setAppRank({ rank: rankJson.rank, category: rankJson.category });
        }
      } catch (e) {
        console.error("Failed to load app data", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetails();
  }, [id]);

  if (loading) {
    return <div style={{padding: "4rem", textAlign: "center", color: "#64748b"}}>Loading app details...</div>;
  }

  if (!appData) {
    return (
      <div style={{padding: "4rem", textAlign: "center", color: "#64748b"}}>
        <h2>App Not Found</h2>
        <button onClick={() => router.push('/dashboard')} style={{marginTop: "1rem", padding: "0.5rem 1rem"}}>Back to Dashboard</button>
      </div>
    );
  }

  // Format Numbers to K, M, B
  const formatNumber = (num: number) => {
    if (!num && num !== 0) return 'N/A';
    if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace('.0', '') + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + 'K';
    return num.toString();
  };

  // Format dates
  const releasedDate = appData.released || "Unknown";
  const updatedDate = appData.updated ? new Date(appData.updated).toLocaleDateString('en-CA') : "Unknown"; // YYYY-MM-DD
  const lastRefreshed = "Today (Live)"; 
  const todayDateStr = new Date().toLocaleDateString('en-CA');

  // Chart Data (Strictly real data only. One point for today.)
  const ratingsReviewsData = [
    { name: todayDateStr, rating: appData.score || 0, reviews: appData.ratings || 0 }
  ];

  const emptyData = [
    { name: todayDateStr }
  ];

  const renderTabButton = (label: string, icon?: string) => {
    const isActive = activeTab === label;
    return (
      <button 
        onClick={() => setActiveTab(label)}
        style={{
          background: isActive ? "#f1f5f9" : "white", 
          color: isActive ? "#4f46e5" : "#64748b", 
          border: "1px solid", 
          borderColor: isActive ? "#e2e8f0" : "#e2e8f0",
          padding: "0.5rem 1rem", 
          borderRadius: "8px", 
          fontSize: "0.85rem", 
          fontWeight: 600,
          cursor: "pointer"
        }}>
        {icon} {label}
      </button>
    );
  };

  return (
    <div style={{maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif"}}>
      
      {/* Back button */}
      <button onClick={() => router.push('/dashboard')} style={{background: "none", border: "none", color: "#64748b", cursor: "pointer", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", fontWeight: 600}}>
        ← Back to Dashboard
      </button>

      {/* Banner */}
      <div style={{background: "white", borderRadius: "20px", padding: "0.5rem", display: "flex", justifySelf: "center", width: "fit-content", margin: "0 auto 2rem", alignItems: "center", border: "1px solid #e2e8f0", boxShadow: "0 1px 2px rgba(0,0,0,0.02)"}}>
        <span style={{color: "#475569", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem", paddingLeft: "1rem"}}>
          🔒 AI signal narratives are locked
        </span>
        <span style={{background: "#0f172a", color: "white", padding: "0.2rem 0.8rem", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 700, marginLeft: "1rem"}}>Upgrade</span>
      </div>

      {/* App Header */}
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem"}}>
        <div style={{display: "flex", gap: "1.5rem"}}>
          <img src={appData.icon} alt={appData.title} style={{width: "100px", height: "100px", borderRadius: "20px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"}} />
          <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
            <h1 style={{margin: "0 0 0.5rem 0", fontSize: "1.4rem", fontWeight: 700, color: "#0f172a"}}>{appData.title}</h1>
            <div style={{display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem"}}>
              <span style={{color: "#64748b", fontSize: "0.9rem"}}>by</span>
              <span style={{color: "#4f46e5", fontWeight: 600, fontSize: "0.9rem"}}>{appData.developer}</span>
              <span style={{color: "#94a3b8", fontSize: "0.8rem"}}>CY</span>
              <span style={{background: "#fef3c7", color: "#92400e", padding: "0.1rem 0.5rem", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem"}}>
                🏭 Hit-factory
              </span>
            </div>
            <div style={{fontSize: "0.8rem", color: "#94a3b8"}}>Released: {releasedDate}</div>
            <div style={{fontSize: "0.8rem", color: "#94a3b8"}}>Last Refreshed: {lastRefreshed}</div>
          </div>
        </div>

        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem"}}>
          <button style={{background: "#6366f1", color: "white", border: "none", padding: "0.6rem 1.2rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem"}}>
            ⚡ Actions ⌄
          </button>
          <a href={`https://play.google.com/store/apps/details?id=${id}`} target="_blank" rel="noreferrer" style={{color: "#4f46e5", fontSize: "0.9rem", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem"}}>
            ▶ View on Google Play
          </a>
          <div style={{fontSize: "0.9rem", color: "#475569"}}><b>Genre:</b> {appData.genre}</div>
          <div style={{fontSize: "0.9rem", color: "#475569"}}><b>Rating:</b> {appData.scoreText} ({Number(appData.ratings || appData.reviews).toLocaleString()} reviews)</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", marginBottom: "3rem"}}>
        <div style={{background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)"}}>
          <div style={{fontSize: "0.85rem", color: "#64748b", marginBottom: "0.5rem"}}>Total Downloads</div>
          <div style={{fontSize: "1.8rem", fontWeight: 700, color: "#0f172a"}}>{formatNumber(appData.maxInstalls || appData.minInstalls)}</div>
        </div>
        <div style={{background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)"}}>
          <div style={{fontSize: "0.85rem", color: "#64748b", marginBottom: "0.5rem"}}>Category Ranking</div>
          <div style={{fontSize: "1.8rem", fontWeight: 700, color: appRank?.rank ? "#0f172a" : "#64748b"}}>
            {appRank?.rank ? (typeof appRank.rank === 'number' ? `#${appRank.rank}` : appRank.rank) : "Unavailable"}
          </div>
          {appRank?.category && <div style={{fontSize: "0.75rem", color: "#64748b", marginTop: "0.5rem"}}>in Top Free {appRank.category}</div>}
        </div>
        <div style={{background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)"}}>
          <div style={{fontSize: "0.85rem", color: "#64748b", marginBottom: "0.5rem"}}>Daily Installs</div>
          <div style={{fontSize: "1.2rem", fontWeight: 700, color: "#64748b"}}>Unavailable</div>
        </div>
        <div style={{background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)"}}>
          <div style={{fontSize: "0.85rem", color: "#64748b", marginBottom: "0.5rem"}}>Last Update</div>
          <div style={{fontSize: "1.8rem", fontWeight: 700, color: "#0f172a"}}>{updatedDate}</div>
        </div>
      </div>

      {/* Screenshots */}
      <div style={{background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "1.5rem", marginBottom: "2rem"}}>
        <h2 style={{fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", margin: "0 0 1rem 0"}}>Screenshots</h2>
        <div style={{display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "1rem", scrollbarWidth: "thin"}}>
          {appData.screenshots && appData.screenshots.map((imgUrl: string, index: number) => (
            <div key={index} style={{position: "relative", flexShrink: 0}}>
              {index === 0 && (
                <div style={{position: "absolute", top: "10px", left: "10px", background: "#6366f1", color: "white", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 800}}>
                  FEATURE GRAPHIC
                </div>
              )}
              <img src={imgUrl} alt={`Screenshot ${index + 1}`} style={{height: "300px", borderRadius: "12px", border: "1px solid #e2e8f0", objectFit: "cover"}} />
            </div>
          ))}
        </div>
      </div>

      {/* Description Section */}
      <div style={{background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "1.5rem", marginBottom: "2rem"}}>
        <h2 style={{fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", margin: "0 0 1.5rem 0"}}>Description</h2>
        
        <div style={{marginBottom: "1.5rem"}}>
          <div style={{fontSize: "0.75rem", fontWeight: 700, color: "#64748b", marginBottom: "0.5rem", letterSpacing: "0.5px"}}>SHORT DESCRIPTION</div>
          <div style={{fontSize: "0.95rem", color: "#0f172a"}}>{appData.summary}</div>
        </div>
        
        <hr style={{border: "none", borderTop: "1px solid #f1f5f9", margin: "1.5rem 0"}} />
        
        <div>
          <div style={{fontSize: "0.75rem", fontWeight: 700, color: "#64748b", marginBottom: "1rem", letterSpacing: "0.5px"}}>FULL DESCRIPTION</div>
          <div style={{fontSize: "0.95rem", color: "#334155", lineHeight: 1.6, overflow: "hidden", maxHeight: showFullDesc ? "none" : "150px"}} dangerouslySetInnerHTML={{__html: appData.descriptionHTML || appData.description}}></div>
          <button onClick={() => setShowFullDesc(!showFullDesc)} style={{background: "none", border: "none", color: "#4f46e5", fontWeight: 600, fontSize: "0.9rem", padding: "1rem 0 0 0", cursor: "pointer"}}>
            {showFullDesc ? "Show less" : "View more"}
          </button>
        </div>
      </div>

      {/* Performance Section */}
      <div style={{background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "1.5rem", marginBottom: "2rem"}}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem"}}>
          <h2 style={{fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", margin: 0}}>Performance</h2>
          <div style={{display: "flex", gap: "0.5rem"}}>
            {renderTabButton("Timeline")}
            {renderTabButton("Activity", "🔥")}
            {renderTabButton("Daily Installs")}
            {renderTabButton("Ratings & Reviews")}
            {renderTabButton("Category Rankings")}
            {renderTabButton("Keywords")}
          </div>
        </div>

        {/* Dynamic Chart Content */}
        {activeTab !== 'Keywords' ? (
          <div style={{height: "300px", width: "100%", position: "relative"}}>
            {/* Unavailable Message Overlay */}
            {activeTab !== 'Ratings & Reviews' && (
              <div style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(248, 250, 252, 0.5)", zIndex: 10, borderRadius: "12px", border: "1px dashed #cbd5e1"}}>
                <div style={{background: "white", padding: "1rem 2rem", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", textAlign: "center", color: "#64748b"}}>
                  <div style={{fontWeight: 600, marginBottom: "0.3rem", color: "#0f172a"}}>Historical Data Unavailable</div>
                  <div style={{fontSize: "0.85rem"}}>We currently do not track historical metrics.</div>
                </div>
              </div>
            )}
            
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === 'Ratings & Reviews' ? (
                <LineChart data={ratingsReviewsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={{stroke: '#e2e8f0'}} tickLine={false} />
                  <YAxis yAxisId="left" domain={[0, 5]} tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={{stroke: '#e2e8f0'}} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={{stroke: '#e2e8f0'}} tickLine={false} tickFormatter={(value) => formatNumber(value)} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" name="Rating" dataKey="rating" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} />
                  <Line yAxisId="right" type="monotone" name="Reviews" dataKey="reviews" stroke="#f43f5e" strokeWidth={3} dot={{r: 4}} />
                </LineChart>
              ) : activeTab === 'Activity' ? (
                <BarChart data={emptyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <YAxis tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <Tooltip />
                  <Bar dataKey="installs" fill="#f59e0b" name="Installs / day (raw)" />
                </BarChart>
              ) : activeTab === 'Category Rankings' ? (
                <LineChart data={emptyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <YAxis reversed tick={{fontSize: 12, fill: '#94a3b8'}} domain={[1, 200]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="rank" stroke="#0ea5e9" strokeWidth={3} name="Rank" />
                </LineChart>
              ) : (
                <LineChart data={emptyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <YAxis tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <Tooltip />
                  <Line type="monotone" dataKey="installs" stroke="#0ea5e9" strokeWidth={3} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{overflowX: "auto"}}>
            <table style={{width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem"}}>
              <thead>
                <tr style={{borderBottom: "2px solid #f1f5f9"}}>
                  <th style={{padding: "1rem", color: "#0f172a", fontWeight: 600}}>Keyword</th>
                  <th style={{padding: "1rem", color: "#0f172a", fontWeight: 600}}>Rank</th>
                  <th style={{padding: "1rem", color: "#0f172a", fontWeight: 600}}>Volume</th>
                  <th style={{padding: "1rem", color: "#0f172a", fontWeight: 600}}>Difficulty</th>
                  <th style={{padding: "1rem", color: "#0f172a", fontWeight: 600}}>Opportunity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} style={{padding: "3rem", textAlign: "center", color: "#64748b", borderBottom: "1px solid #f1f5f9"}}>
                    <div style={{fontWeight: 600, color: "#0f172a", marginBottom: "0.3rem"}}>Keyword Data Unavailable</div>
                    ASO Keyword data is proprietary and historical records are not publicly accessible.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Similar Titles Section */}
      {similarApps.length > 0 && (
        <div style={{background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "1.5rem", marginBottom: "2rem"}}>
          <h2 style={{fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", margin: "0 0 1.5rem 0"}}>Similar Titles</h2>
          
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem"}}>
            {similarApps.slice(0, 12).map((app: any, idx: number) => (
              <div key={idx} style={{border: "1px solid #f1f5f9", borderRadius: "12px", padding: "1rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", cursor: "pointer", transition: "all 0.2s"}} onClick={() => router.push(`/dashboard/app/${app.appId}`)}>
                <img src={app.icon} alt={app.title} style={{width: "120px", height: "120px", borderRadius: "24px", marginBottom: "1rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"}} />
                <h3 style={{fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.5rem 0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"}}>{app.title}</h3>
                <div style={{fontSize: "0.8rem", color: "#64748b", margin: "0 0 0.5rem 0", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden"}}>{app.developer}</div>
                <div style={{fontSize: "0.75rem", color: "#94a3b8"}}>~{formatNumber(app.installs || app.minInstalls || 0)} installs</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

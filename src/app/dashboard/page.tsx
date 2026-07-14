"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [trackedGames, setTrackedGames] = useState<any[]>([]);
  const [trackedPublishers, setTrackedPublishers] = useState<string[]>([]);

  useEffect(() => {
    const savedGames = localStorage.getItem('trackedGames');
    const savedPubs = localStorage.getItem('trackedPublishers');
    if (savedGames) setTrackedGames(JSON.parse(savedGames));
    if (savedPubs) setTrackedPublishers(JSON.parse(savedPubs));
  }, []);

  return (
    <div style={{maxWidth: "1200px", margin: "0 auto", padding: "3rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif"}}>
      
      {/* Header Area */}
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem"}}>
        <div>
          <h1 style={{fontSize: "2.8rem", fontFamily: "Georgia, serif", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem", letterSpacing: "-0.5px"}}>Afternoon, Dabobot</h1>
          <p style={{color: "#475569", fontSize: "1.05rem"}}>Let's get you set up. Track a few publishers and your dashboard fills in within minutes.</p>
        </div>
        <div style={{display: "flex", alignItems: "center", gap: "1.5rem"}}>
          <div style={{fontSize: "0.85rem"}}><span style={{color: "#16a34a", fontWeight: 800}}>Pro Trial</span> <span style={{color: "#64748b"}}>· 13 days left</span></div>
          <button onClick={() => router.push('/dashboard/track')} style={{background: "#4f46e5", color: "white", padding: "0.6rem 1.2rem", borderRadius: "8px", fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem"}}>
            + Track publisher
          </button>
        </div>
      </div>

      {/* "CREATE WITH AI" Tools List */}
      <div style={{display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3rem", overflowX: "auto", paddingBottom: "0.5rem"}}>
        <span style={{fontSize: "0.75rem", fontWeight: 800, color: "#94a3b8", letterSpacing: "1px", whiteSpace: "nowrap"}}>CREATE WITH AI</span>
        
        <button onClick={() => router.push('/dashboard/agents/growth')} style={{background: "white", color: "#4f46e5", border: "1px solid #4f46e5", borderRadius: "20px", padding: "0.5rem 1rem", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap"}}>
          📈 AI Growth Strategist <span style={{background: "#4f46e5", color: "white", fontSize: "0.6rem", padding: "2px 6px", borderRadius: "10px", fontWeight: 800}}>NEW</span>
        </button>

        <button onClick={() => router.push('/dashboard/agents/ad-copy')} style={{background: "white", color: "#334155", border: "1px solid #e2e8f0", borderRadius: "20px", padding: "0.5rem 1rem", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap"}}>
          📝 Google Ad Copy <span style={{fontSize: "0.6rem"}}>▼</span>
        </button>

        <button onClick={() => router.push('/dashboard/agents/aso-auditor')} style={{background: "white", color: "#334155", border: "1px solid #e2e8f0", borderRadius: "20px", padding: "0.5rem 1rem", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap"}}>
          ✔️ AI ASO Auditor
        </button>

        <button onClick={() => router.push('/dashboard/agents/aso-writer')} style={{background: "white", color: "#334155", border: "1px solid #e2e8f0", borderRadius: "20px", padding: "0.5rem 1rem", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap"}}>
          🖊️ New ASO Writer <span style={{fontSize: "0.5rem", color: "#4f46e5"}}>■</span>
        </button>

        <button onClick={() => router.push('/dashboard/agents/ideation')} style={{background: "white", color: "#334155", border: "1px solid #e2e8f0", borderRadius: "20px", padding: "0.5rem 1rem", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap"}}>
          💡 Game Ideation
        </button>
      </div>

      {/* Main Grid Layout */}
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem"}}>
        
        {/* Left Column */}
        <div style={{display: "flex", flexDirection: "column", gap: "2rem"}}>
          
          {/* Competitor App/Game Changes Card */}
          <div>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem"}}>
              <h2 style={{fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", margin: 0}}>Competitor App/Game Changes</h2>
              <button onClick={() => router.push('/dashboard/signals')} style={{color: "#4f46e5", fontSize: "0.9rem", background: "none", border: "none", cursor: "pointer", fontWeight: 600}}>View all →</button>
            </div>
            
            <div style={{background: "white", border: "1px solid #f1f5f9", borderRadius: "12px", padding: trackedGames.length > 0 ? "1.5rem" : "4rem 2rem", textAlign: trackedGames.length > 0 ? "left" : "center", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)"}}>
              {trackedGames.length === 0 ? (
                <>
                  <div style={{background: "#f8fafc", width: "48px", height: "48px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", border: "1px solid #e2e8f0"}}>
                    <span style={{fontSize: "1.2rem"}}>🔔</span>
                  </div>
                  <h3 style={{fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem", margin: 0}}>Follow a Few Accounts/Publishers</h3>
                  <p style={{color: "#64748b", fontSize: "0.9rem", lineHeight: 1.5, maxWidth: "400px", margin: "0.5rem auto 2rem"}}>
                    Icon, screenshot, title, description, version and rating changes on your tracked games/apps will show up here.
                  </p>
                  <button onClick={() => router.push('/dashboard/track')} style={{background: "white", color: "#4f46e5", border: "1px solid #e2e8f0", padding: "0.6rem 1.2rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer"}}>
                    Track a game
                  </button>
                </>
              ) : (
                <div style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
                  {trackedGames.map((game, idx) => (
                    <div key={idx} onClick={() => router.push(`/dashboard/app/${game.appId}`)} style={{background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.02)"}}>
                      <div style={{display: "flex", gap: "1.2rem"}}>
                        <img src={game.icon} alt={game.title} style={{width: "64px", height: "64px", borderRadius: "16px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)"}} />
                        <div>
                          <h3 style={{fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.3rem 0"}}>{game.title}</h3>
                          <div style={{fontSize: "0.85rem", color: "#64748b", marginBottom: "1rem"}}>by {game.developer}</div>
                          <div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
                            <div style={{width: "6px", height: "6px", background: "#3b82f6", borderRadius: "50%"}}></div>
                            <span style={{fontSize: "0.85rem", color: "#475569", fontWeight: 600}}>Screenshots</span>
                            <span style={{fontSize: "0.85rem", color: "#0f172a", fontWeight: 600}}>changed</span>
                          </div>
                        </div>
                      </div>
                      <div style={{display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.5rem"}}>
                        <span style={{color: "#4f46e5", fontWeight: 700, fontSize: "0.85rem", background: "#eef2ff", padding: "2px 8px", borderRadius: "12px"}}>{(idx % 3) + 1} change</span>
                        <span style={{color: "#94a3b8", fontSize: "0.8rem"}}>{(idx % 4) + 1} weeks ago</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{display: "flex", flexDirection: "column", gap: "2rem"}}>
          
          {/* AI Brief Card */}
          <div style={{background: "white", border: "1px solid #f1f5f9", borderRadius: "12px", padding: "2rem", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)"}}>
            <div style={{display: "flex", gap: "1rem", marginBottom: "1.5rem"}}>
              <div style={{background: "#4f46e5", width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white"}}>
                <span style={{fontSize: "1.2rem"}}>⚡</span>
              </div>
              <div>
                <h3 style={{fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", margin: 0}}>Your first brief is one step away</h3>
                <p style={{color: "#64748b", fontSize: "0.85rem", margin: "0.2rem 0 0 0"}}>Set up in under a minute</p>
              </div>
            </div>
            <p style={{color: "#475569", fontSize: "0.95rem", lineHeight: 1.5, marginBottom: "2rem"}}>
              Track the publishers you care about. We'll watch their launches, store changes and rankings, then deliver an AI brief here every morning.
            </p>
            <div style={{display: "flex", flexDirection: "column", gap: "0.8rem"}}>
              <button onClick={() => router.push('/dashboard/track')} style={{background: "#4f46e5", color: "white", border: "none", padding: "0.8rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer"}}>
                + Track your first publisher
              </button>
              <button onClick={() => router.push('/dashboard/categories')} style={{background: "white", color: "#0f172a", border: "1px solid #e2e8f0", padding: "0.8rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer"}}>
                Explore Top Charts
              </button>
            </div>
          </div>

          {/* Competitor New Launches Card */}
          <div>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem"}}>
              <h2 style={{fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", margin: 0}}>Competitor New Launches</h2>
              <button onClick={() => router.push('/dashboard/new-launches')} style={{color: "#4f46e5", fontSize: "0.9rem", background: "none", border: "none", cursor: "pointer", fontWeight: 600}}>View all →</button>
            </div>
            
            <div style={{background: "white", border: "1px solid #f1f5f9", borderRadius: "12px", padding: trackedPublishers.length > 0 ? "0" : "4rem 2rem", textAlign: trackedPublishers.length > 0 ? "left" : "center", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)"}}>
              {trackedPublishers.length === 0 ? (
                <>
                  <div style={{background: "#f8fafc", width: "48px", height: "48px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", border: "1px solid #e2e8f0"}}>
                    <span style={{fontSize: "1.2rem"}}>🚀</span>
                  </div>
                  <h3 style={{fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem", margin: 0}}>Follow a Few Accounts/Publishers</h3>
                  <p style={{color: "#64748b", fontSize: "0.9rem", lineHeight: 1.5, maxWidth: "400px", margin: "0.5rem auto 2rem"}}>
                    When any of your tracked publishers release a new app or game, it'll show up here.
                  </p>
                  <button onClick={() => router.push('/dashboard/track')} style={{background: "white", color: "#4f46e5", border: "1px solid #e2e8f0", padding: "0.6rem 1.2rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer"}}>
                    Browse publishers
                  </button>
                </>
              ) : (
                <div style={{display: "flex", flexDirection: "column"}}>
                    {trackedPublishers.map((pub, idx) => (
                      <div key={idx} style={{display: "flex", alignItems: "center", paddingBottom: "1rem", borderBottom: idx === trackedPublishers.length - 1 ? "none" : "1px solid #f1f5f9"}}>
                        <div style={{width: "40px", height: "40px", borderRadius: "8px", background: "#4f46e5", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", marginRight: "1rem"}}>
                          {pub.charAt(0).toUpperCase()}
                        </div>
                        <div style={{flex: 1, fontWeight: 600, color: "#0f172a"}}>{pub}</div>
                        <span style={{fontSize: "0.8rem", color: "#16a34a", background: "#f0fdf4", padding: "2px 8px", borderRadius: "12px", fontWeight: "bold"}}>Active</span>
                      </div>
                    ))}
                  </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

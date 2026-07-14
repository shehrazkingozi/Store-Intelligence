"use client";

import Link from "next/link";
import { useState } from "react";

export default function TopNavbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (menu: string) => {
    if (activeDropdown === menu) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(menu);
    }
  };

  return (
    <div style={{background: "white", borderBottom: "1px solid #e2e8f0", position: "relative", zIndex: 50}}>
      {/* Main Navbar */}
      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem", height: "64px"}}>
        
        {/* Left Side: Logo & Menus */}
        <div style={{display: "flex", alignItems: "center", gap: "2rem"}}>
          
          {/* Logo */}
          <Link href="/dashboard" style={{textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem"}}>
            <span style={{fontSize: "1.4rem", fontWeight: 900, color: "black", letterSpacing: "-0.5px"}}>StoreSignal</span>
            <span style={{color: "#10b981", fontSize: "1.4rem"}}>📊</span>
          </Link>

          {/* Nav Menus */}
          <nav style={{display: "flex", alignItems: "center", gap: "1.5rem", fontSize: "0.95rem", color: "#475569", fontWeight: 500}}>
            
            {/* Workspace Dropdown */}
            <div style={{position: "relative"}}>
              <button 
                onClick={() => toggleDropdown("workspace")}
                style={{background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", color: "#0f172a", fontWeight: activeDropdown === "workspace" ? 700 : 500, padding: "0.5rem"}}
              >
                Workspace <span style={{fontSize: "0.7rem"}}>▼</span>
              </button>
              {activeDropdown === "workspace" && (
                <div style={{position: "absolute", top: "100%", left: 0, background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", minWidth: "220px", padding: "0.5rem", marginTop: "0.5rem"}}>
                  <div style={{fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", padding: "0.5rem", letterSpacing: "1px"}}>DATA HUB</div>
                  <Link href="/dashboard" className="dropdown-item">⊞ Dashboard</Link>
                  <Link href="/dashboard/signals" className="dropdown-item">📈 Signals</Link>
                  <Link href="/dashboard/collections" className="dropdown-item">🔖 Collections</Link>
                  
                  <div style={{fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", padding: "0.5rem", letterSpacing: "1px", marginTop: "0.5rem"}}>PUBLISHERS</div>
                  <Link href="/dashboard/publishers" className="dropdown-item">👁 Tracked Publishers</Link>
                  <Link href="/dashboard/publishers/new" className="dropdown-item" style={{color: "#10b981"}}>+ Track new publisher</Link>
                  
                  <div style={{fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", padding: "0.5rem", letterSpacing: "1px", marginTop: "0.5rem"}}>MY STUFF</div>
                  <Link href="/dashboard/ai-ideas" className="dropdown-item">💡 My AI Ideas</Link>
                  <Link href="/dashboard/aso-audits" className="dropdown-item">✔️ My ASO Audits</Link>
                  <Link href="/dashboard/alerts" className="dropdown-item">🔔 Alerts</Link>
                </div>
              )}
            </div>

            {/* AI Agents Dropdown */}
            <div style={{position: "relative"}}>
              <button 
                onClick={() => toggleDropdown("ai_agents")}
                style={{background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", color: "#0f172a", fontWeight: activeDropdown === "ai_agents" ? 700 : 500, padding: "0.5rem"}}
              >
                🔥 AI Agents <span style={{fontSize: "0.7rem"}}>▼</span>
              </button>
              {activeDropdown === "ai_agents" && (
                <div style={{position: "absolute", top: "100%", left: 0, background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", minWidth: "260px", padding: "0.5rem", marginTop: "0.5rem"}}>
                  <div style={{padding: "0.5rem"}}>
                    <div style={{fontWeight: 700, color: "black"}}>AI Agents</div>
                    <div style={{fontSize: "0.8rem", color: "#64748b"}}>Audit, write & ideate in one place.</div>
                  </div>
                  <Link href="/dashboard/agents/aso-auditor" className="dropdown-item" style={{display: "flex", gap: "0.5rem", padding: "0.8rem 0.5rem"}}>
                    <span>🔥</span> <div><div style={{fontWeight: 600, color: "black"}}>AI ASO Auditor V2</div><div style={{fontSize: "0.75rem", color: "#64748b"}}>Audit & fix your store listings</div></div>
                  </Link>
                  <Link href="/dashboard/agents/aso-writer" className="dropdown-item" style={{display: "flex", gap: "0.5rem", padding: "0.8rem 0.5rem"}}>
                    <span>💅</span> <div><div style={{fontWeight: 600, color: "black"}}>New ASO Writer V2 <span style={{background: "#4f46e5", color: "white", padding: "1px 4px", borderRadius: "4px", fontSize: "0.6rem"}}>NEW</span></div><div style={{fontSize: "0.75rem", color: "#64748b"}}>Generate optimized titles & copy</div></div>
                  </Link>
                  <Link href="/dashboard/agents/chat" className="dropdown-item" style={{display: "flex", gap: "0.5rem", padding: "0.8rem 0.5rem"}}>
                    <span>✨</span> <div><div style={{fontWeight: 600, color: "black"}}>AI Chat</div><div style={{fontSize: "0.75rem", color: "#64748b"}}>Ask anything about the market</div></div>
                  </Link>
                  <Link href="/dashboard/agents/ideation" className="dropdown-item" style={{display: "flex", gap: "0.5rem", padding: "0.8rem 0.5rem"}}>
                    <span>💡</span> <div><div style={{fontWeight: 600, color: "black"}}>Game Ideation Agent</div><div style={{fontSize: "0.75rem", color: "#64748b"}}>Brainstorm new game concepts</div></div>
                  </Link>
                </div>
              )}
            </div>

            {/* Discover Dropdown */}
            <div style={{position: "relative"}}>
              <button 
                onClick={() => toggleDropdown("discover")}
                style={{background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", color: "#0f172a", fontWeight: activeDropdown === "discover" ? 700 : 500, padding: "0.5rem"}}
              >
                Discover <span style={{fontSize: "0.7rem"}}>▼</span>
              </button>
              {activeDropdown === "discover" && (
                <div style={{position: "absolute", top: "100%", left: 0, background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", minWidth: "220px", padding: "0.5rem", marginTop: "0.5rem"}}>
                  <div style={{fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", padding: "0.5rem", letterSpacing: "1px"}}>CHARTS</div>
                  <Link href="/dashboard/categories" className="dropdown-item">📊 Top Charts</Link>
                  <Link href="/dashboard/top-publishers" className="dropdown-item">📑 Top Publishers</Link>
                  <Link href="/dashboard/roblox" className="dropdown-item">⬜ Roblox Top Charts</Link>
                  
                  <div style={{fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", padding: "0.5rem", letterSpacing: "1px", marginTop: "0.5rem"}}>MARKET MOVES</div>
                  <Link href="/dashboard/transfers" className="dropdown-item">🔁 Transfers</Link>
                  <Link href="/dashboard/trending" className="dropdown-item">📈 New Trending Topics <span style={{color: "#4f46e5", fontSize: "0.6rem", fontWeight: "bold"}}>NEW</span></Link>
                  <Link href="/dashboard/chart-intelligence" className="dropdown-item" style={{display: "flex", gap: "0.5rem", marginTop: "0.5rem", padding: "0.8rem 0.5rem", background: "#f0fdf4", borderRadius: "6px"}}>
                    <span>✨</span> <div><div style={{fontWeight: 600, color: "#16a34a"}}>Top Chart Intelligence <span style={{background: "#16a34a", color: "white", padding: "1px 4px", borderRadius: "4px", fontSize: "0.6rem"}}>BETA</span></div><div style={{fontSize: "0.75rem", color: "#16a34a"}}>AI read on why charts moved</div></div>
                  </Link>
                </div>
              )}
            </div>

            {/* ASO Dropdown */}
            <div style={{position: "relative"}}>
              <button 
                onClick={() => toggleDropdown("aso")}
                style={{background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", color: "#0f172a", fontWeight: activeDropdown === "aso" ? 700 : 500, padding: "0.5rem"}}
              >
                ASO <span style={{fontSize: "0.7rem"}}>▼</span>
              </button>
              {activeDropdown === "aso" && (
                <div style={{position: "absolute", top: "100%", left: 0, background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", minWidth: "220px", padding: "0.5rem", marginTop: "0.5rem"}}>
                  <div style={{fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", padding: "0.5rem", letterSpacing: "1px"}}>KEYWORDS</div>
                  <Link href="/dashboard/keywords/explorer" className="dropdown-item">🔍 Keyword Explorer</Link>
                  <Link href="/dashboard/keywords/tracked" className="dropdown-item">🏷️ Tracked Keywords</Link>
                  
                  <div style={{fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", padding: "0.5rem", letterSpacing: "1px", marginTop: "0.5rem"}}>MY APPS</div>
                  <Link href="/dashboard/my-games" className="dropdown-item">🎮 My Games</Link>
                  <Link href="/dashboard/add-game" className="dropdown-item" style={{color: "#10b981"}}>+ Add game</Link>
                  
                  <div style={{fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", padding: "0.5rem", letterSpacing: "1px", marginTop: "0.5rem"}}>AI FOR ASO</div>
                  <Link href="/dashboard/agents/aso-auditor" className="dropdown-item" style={{display: "flex", justifyContent: "space-between"}}>
                    <span>✨ AI ASO Auditor V2</span><span style={{fontSize: "0.7rem", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px"}}>Agents</span>
                  </Link>
                  <Link href="/dashboard/agents/aso-writer" className="dropdown-item" style={{display: "flex", justifyContent: "space-between"}}>
                    <span>🖊️ New ASO Writer V2</span><span style={{fontSize: "0.7rem", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px"}}>Agents</span>
                  </Link>
                </div>
              )}
            </div>

            <Link href="/dashboard/new-launches" style={{textDecoration: "none", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.3rem"}}>
              🚀 New Launches
            </Link>

          </nav>
        </div>

        {/* Right Side: Search & Profile */}
        <div style={{display: "flex", alignItems: "center", gap: "1.5rem"}}>
          <div style={{position: "relative"}}>
            <input 
              type="text" 
              placeholder="Search games, apps, publishers..." 
              style={{padding: "0.5rem 1rem", borderRadius: "20px", border: "1px solid #e2e8f0", width: "250px", fontSize: "0.85rem", background: "#f8fafc"}}
            />
          </div>
          
          <button style={{background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", color: "#0f172a", fontWeight: 500}}>
            Dabobot <span style={{fontSize: "0.7rem"}}>▼</span>
          </button>
        </div>
      </div>

      {/* Green Promo Banner */}
      <div style={{background: "#10b981", color: "white", padding: "0.5rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.9rem", fontWeight: 500}}>
        <div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
          <span>🧩</span> Get instant installs, charts & publisher data on any Google Play page — StoreSignal Chrome Extension is free!
        </div>
        <div style={{display: "flex", alignItems: "center", gap: "1rem"}}>
          <button style={{background: "white", color: "#10b981", border: "none", padding: "0.3rem 0.8rem", borderRadius: "4px", fontWeight: "bold", cursor: "pointer"}}>Install Free →</button>
          <button style={{background: "transparent", border: "none", color: "white", cursor: "pointer"}}>✕</button>
        </div>
      </div>

      <style jsx>{`
        .dropdown-item {
          display: block;
          padding: 0.5rem;
          color: #334155;
          text-decoration: none;
          font-size: 0.9rem;
          border-radius: 4px;
        }
        .dropdown-item:hover {
          background: #f8fafc;
        }
      `}</style>
    </div>
  );
}

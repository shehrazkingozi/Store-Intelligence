"use client";

import { useState, useEffect } from "react";

const gameCategories = [
  "All Games", "Action", "Adventure", "Arcade", "Board", "Card", "Casino", "Casual",
  "Educational", "Music", "Puzzle", "Racing", "Role Playing", "Simulation", "Sports", 
  "Strategy", "Trivia", "Word"
];

const appCategories = [
  "All Apps", "Art & Design", "Auto & Vehicles", "Beauty", "Books & Reference", 
  "Business", "Comics", "Communication", "Dating", "Education", "Entertainment", 
  "Events", "Finance", "Food & Drink", "Health & Fitness", "House & Home", 
  "Libraries & Demo", "Lifestyle", "Maps & Navigation", "Medical", "Music & Audio", 
  "News & Magazines", "Parenting", "Personalization", "Photography", "Productivity", 
  "Shopping", "Social", "Sports Apps", "Tools", "Travel & Local", "Video Players", "Weather"
];

// Mapping readable names to Google Play Category Enums
const categoryMap: any = {
  "All Games": "GAME",
  "Action": "GAME_ACTION",
  "Adventure": "GAME_ADVENTURE",
  "Arcade": "GAME_ARCADE",
  "Board": "GAME_BOARD",
  "Card": "GAME_CARD",
  "Casino": "GAME_CASINO",
  "Casual": "GAME_CASUAL",
  "Educational": "GAME_EDUCATIONAL",
  "Music": "GAME_MUSIC",
  "Puzzle": "GAME_PUZZLE",
  "Racing": "GAME_RACING",
  "Role Playing": "GAME_ROLE_PLAYING",
  "Simulation": "GAME_SIMULATION",
  "Sports": "GAME_SPORTS",
  "Strategy": "GAME_STRATEGY",
  "Trivia": "GAME_TRIVIA",
  "Word": "GAME_WORD",

  "All Apps": "APPLICATION",
  "Art & Design": "ART_AND_DESIGN",
  "Auto & Vehicles": "AUTO_AND_VEHICLES",
  "Beauty": "BEAUTY",
  "Books & Reference": "BOOKS_AND_REFERENCE",
  "Business": "BUSINESS",
  "Comics": "COMICS",
  "Communication": "COMMUNICATION",
  "Dating": "DATING",
  "Education": "EDUCATION",
  "Entertainment": "ENTERTAINMENT",
  "Events": "EVENTS",
  "Finance": "FINANCE",
  "Food & Drink": "FOOD_AND_DRINK",
  "Health & Fitness": "HEALTH_AND_FITNESS",
  "House & Home": "HOUSE_AND_HOME",
  "Libraries & Demo": "LIBRARIES_AND_DEMO",
  "Lifestyle": "LIFESTYLE",
  "Maps & Navigation": "MAPS_AND_NAVIGATION",
  "Medical": "MEDICAL",
  "Music & Audio": "MUSIC_AND_AUDIO",
  "News & Magazines": "NEWS_AND_MAGAZINES",
  "Parenting": "PARENTING",
  "Personalization": "PERSONALIZATION",
  "Photography": "PHOTOGRAPHY",
  "Productivity": "PRODUCTIVITY",
  "Shopping": "SHOPPING",
  "Social": "SOCIAL",
  "Sports Apps": "SPORTS",
  "Tools": "TOOLS",
  "Travel & Local": "TRAVEL_AND_LOCAL",
  "Video Players": "VIDEO_PLAYERS",
  "Weather": "WEATHER"
};

const countries = [
  { code: "us", name: "us United States" },
  { code: "gb", name: "GB United Kingdom" },
  { code: "de", name: "DE Germany" },
  { code: "jp", name: "JP Japan" },
  { code: "br", name: "BR Brazil" },
  { code: "in", name: "IN India" },
  { code: "vn", name: "VN Vietnam" },
  { code: "tr", name: "TR Turkey" },
  { code: "fr", name: "FR France" },
  { code: "ca", name: "CA Canada" },
  { code: "au", name: "AU Australia" },
  { code: "kr", name: "KR South Korea" },
  { code: "global", name: "🌐 Global (Default)" }
];

export default function CategoriesPage() {
  const [appType, setAppType] = useState("Games");
  const [selectedCategory, setSelectedCategory] = useState("All Games");
  const [selectedCountry, setSelectedCountry] = useState("us");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  const handleAppTypeChange = (e: any) => {
    const newType = e.target.value;
    setAppType(newType);
    setSelectedCategory(newType === "Games" ? "All Games" : "All Apps");
  };

  const handleApply = () => {
    fetchCategoryData(selectedCategory, selectedCountry);
  };

  useEffect(() => {
    fetchCategoryData(selectedCategory, selectedCountry);
  }, []);

  const fetchCategoryData = async (catName: string, countryCode: string) => {
    setLoading(true);
    setError("");
    setData(null); // Clear existing data to trigger the loading spinner again
    try {
      const gplayCat = categoryMap[catName] || "GAME";
      const gplayCountry = countryCode === "global" ? "us" : countryCode;
      
      const res = await fetch(`http://localhost:8000/api/live-category?category=${gplayCat}&country=${gplayCountry}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.error || "Failed to fetch live category data");
      }
    } catch (err) {
      setError("Network error while connecting to live API.");
    }
    setLoading(false);
  };

  const getMovementColor = (val: number) => {
    if (val > 0) return "#16a34a"; // Green
    if (val < 0) return "#dc2626"; // Red
    return "#64748b"; // Gray
  };

  const getMovementIcon = (val: number) => {
    if (val > 0) return "▲";
    if (val < 0) return "▼";
    return "–";
  };

  return (
    <main className="container" style={{maxWidth: "1800px", padding: "1rem"}}>
      
      {/* 1. TOP FILTERS ROW */}
      <div style={{display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem", background: "white", color: "black", padding: "1rem", borderRadius: "8px", marginBottom: "2rem"}}>
        <span style={{fontWeight: "bold", color: "#64748b"}}>FILTERS</span>
        
        <select disabled style={{padding: "0.5rem", borderRadius: "20px", border: "1px solid #cbd5e1", background: "#e2e8f0", cursor: "not-allowed", color: "#64748b"}}>
          <option>Google Play</option>
          <option>iOS Store (Coming Soon)</option>
        </select>

        <select 
          value={appType}
          onChange={handleAppTypeChange}
          style={{padding: "0.5rem", borderRadius: "20px", border: "1px solid #cbd5e1", background: "#f8fafc", cursor: "pointer"}}
        >
          <option value="Games">Games</option>
          <option value="Apps">Apps</option>
        </select>

        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{padding: "0.5rem", borderRadius: "20px", border: "1px solid #cbd5e1", background: "#f8fafc", cursor: "pointer", minWidth: "150px"}}
        >
          {(appType === "Games" ? gameCategories : appCategories).map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select 
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          style={{padding: "0.5rem", borderRadius: "20px", border: "1px solid #cbd5e1", background: "#f8fafc", cursor: "pointer", minWidth: "180px"}}
        >
          {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>

        <select disabled style={{padding: "0.5rem", borderRadius: "20px", border: "1px solid #cbd5e1", background: "#e2e8f0", cursor: "not-allowed", color: "#64748b"}}>
          <option>Date Range (Needs DB)</option>
          <option>Yesterday</option>
          <option>Last 7 days</option>
        </select>

        <div style={{flex: 1}}></div>
        <span style={{color: "#64748b", fontSize: "0.9rem"}}>Showing {data?.topFree?.length || 200} items for {selectedCountry.toUpperCase()}</span>
        <button onClick={handleApply} style={{padding: "0.5rem 1.5rem", background: "#4f46e5", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer"}}>APPLY</button>
      </div>

      {error && (
        <div style={{padding: "1.5rem", color: "#ef4444", background: "rgba(239,68,68,0.1)", borderLeft: "4px solid #ef4444", marginBottom: "2rem"}}>
          {error}
        </div>
      )}

      {loading && !data && (
        <div style={{textAlign: "center", padding: "5rem 0", color: "var(--text-muted)"}}>
          <div className="spinner" style={{marginBottom: "1rem"}}></div>
          Fetching Real-time Store Data for {selectedCountry.toUpperCase()}...
        </div>
      )}

      {data && (
        <>
          {/* 2. KEYWORD CLOUD */}
          <div style={{background: "white", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem"}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem"}}>
              <div style={{display: "flex", gap: "1rem", alignItems: "center"}}>
                <span style={{fontWeight: "bold", color: "black"}}>Keyword Cloud</span>
                <select style={{padding: "0.3rem", borderRadius: "4px", border: "1px solid black", background: "white", color: "black"}}>
                  <option>Top Free</option>
                </select>
              </div>
              <span style={{fontSize: "0.85rem", color: "#64748b"}}>
                Ordered by frequency · ▲/▼ = average rank movement over the range
              </span>
            </div>
            
            <div style={{display: "flex", flexWrap: "wrap", gap: "0.5rem"}}>
              {data.keywordCloud?.map((kw: any) => (
                <div key={kw.word} style={{
                  padding: "0.4rem 0.8rem", 
                  borderRadius: "20px", 
                  background: kw.movement > 0 ? "#ecfdf5" : kw.movement < 0 ? "#fef2f2" : "#f1f5f9",
                  color: getMovementColor(kw.movement),
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem"
                }}>
                  <span>{getMovementIcon(kw.movement)}</span> {kw.word} <span>{kw.movement > 0 ? `+${kw.movement}` : kw.movement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. COLUMNS (HORIZONTAL SCROLL FOR 5 COLUMNS) */}
          <div style={{display: "flex", overflowX: "auto", gap: "1.5rem", paddingBottom: "1rem"}}>
            
            {/* COLUMN 1: TOP FREE */}
            <div style={{background: "white", borderRadius: "8px", padding: "1.5rem", color: "black", minWidth: "380px", flex: 1, display: "flex", flexDirection: "column"}}>
              <div style={{display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: "1rem", marginBottom: "1rem"}}>
                <h3 style={{margin: 0, fontSize: "1.1rem"}}>Top Free</h3>
                <span style={{color: "#64748b", fontSize: "0.9rem"}}>{data.topFree?.length || 0} items</span>
              </div>
              <div style={{display: "flex", color: "#64748b", fontSize: "0.8rem", fontWeight: "bold", marginBottom: "1rem"}}>
                <div style={{width: "50px"}}>RANK</div>
                <div style={{flex: 1}}>APP/GAME</div>
                <div style={{width: "80px", textAlign: "right"}}>INSTALLS</div>
              </div>
              <div style={{display: "flex", flexDirection: "column", gap: "1rem", overflowY: "auto", maxHeight: "600px", paddingRight: "0.5rem"}}>
                {data.topFree?.map((app: any, idx: number) => (
                  <div key={app.appId} style={{display: "flex", gap: "0.5rem", alignItems: "center"}}>
                    <div style={{width: "40px", fontSize: "0.9rem", fontWeight: "bold", display: "flex", flexDirection: "column"}}>
                      <span>#{idx + 1}</span>
                      <span style={{fontSize: "0.8rem", color: getMovementColor(app.rankChange)}}>
                        {app.rankChange !== 0 ? `${getMovementIcon(app.rankChange)} ${Math.abs(app.rankChange)}` : "0"}
                      </span>
                    </div>
                    <img src={app.icon} style={{width: "48px", height: "48px", borderRadius: "10px", objectFit: "cover"}} />
                    <div style={{flex: 1, minWidth: 0}}>
                      <div style={{fontWeight: "bold", color: "#4f46e5", fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{app.title}</div>
                      <div style={{color: "#64748b", fontSize: "0.8rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{app.developer} +</div>
                    </div>
                    <div style={{width: "70px", textAlign: "right", color: "#64748b", fontSize: "0.85rem"}}>
                      {app.installsText}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 2: TOP NEW FREE */}
            <div style={{background: "white", borderRadius: "8px", padding: "1.5rem", color: "black", minWidth: "380px", flex: 1, display: "flex", flexDirection: "column"}}>
              <div style={{display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: "1rem", marginBottom: "1rem"}}>
                <h3 style={{margin: 0, fontSize: "1.1rem"}}>Top New Free</h3>
                <span style={{color: "#64748b", fontSize: "0.9rem"}}>{data.topNewFree?.length || 0} items</span>
              </div>
              <div style={{display: "flex", color: "#64748b", fontSize: "0.8rem", fontWeight: "bold", marginBottom: "1rem"}}>
                <div style={{width: "50px"}}>RANK</div>
                <div style={{flex: 1}}>APP/GAME</div>
                <div style={{width: "80px", textAlign: "right"}}>INSTALLS</div>
              </div>
              <div style={{display: "flex", flexDirection: "column", gap: "1rem", overflowY: "auto", maxHeight: "600px", paddingRight: "0.5rem"}}>
                {data.topNewFree?.map((app: any, idx: number) => (
                  <div key={app.appId} style={{display: "flex", gap: "0.5rem", alignItems: "center"}}>
                    <div style={{width: "40px", fontSize: "0.9rem", fontWeight: "bold", display: "flex", flexDirection: "column"}}>
                      <span>#{idx + 1}</span>
                      <span style={{fontSize: "0.8rem", color: getMovementColor(0)}}>0</span>
                    </div>
                    <img src={app.icon} style={{width: "48px", height: "48px", borderRadius: "10px", objectFit: "cover"}} />
                    <div style={{flex: 1, minWidth: 0}}>
                      <div style={{fontWeight: "bold", color: "#4f46e5", fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{app.title}</div>
                      <div style={{color: "#64748b", fontSize: "0.8rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{app.developer} +</div>
                    </div>
                    <div style={{width: "70px", textAlign: "right", color: "#64748b", fontSize: "0.85rem"}}>
                      {app.installsText}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 3: BIGGEST MOVERS UP */}
            <div style={{background: "white", borderRadius: "8px", padding: "1.5rem", color: "black", minWidth: "380px", flex: 1, display: "flex", flexDirection: "column"}}>
              <div style={{display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: "1rem", marginBottom: "1rem"}}>
                <h3 style={{margin: 0, fontSize: "1.1rem"}}>Biggest Movers Up (&gt;= 10 ranks)</h3>
                <span style={{color: "#64748b", fontSize: "0.9rem"}}>{data.biggestMovers?.length || 0} items</span>
              </div>
              <div style={{display: "flex", color: "#64748b", fontSize: "0.8rem", fontWeight: "bold", marginBottom: "1rem"}}>
                <div style={{width: "50px"}}>RANK</div>
                <div style={{flex: 1}}>APP/GAME</div>
                <div style={{width: "80px", textAlign: "right"}}>INSTALLS</div>
              </div>
              <div style={{display: "flex", flexDirection: "column", gap: "1rem", overflowY: "auto", maxHeight: "600px", paddingRight: "0.5rem"}}>
                {data.biggestMovers?.map((app: any, idx: number) => (
                  <div key={app.appId} style={{display: "flex", gap: "0.5rem", alignItems: "center"}}>
                    <div style={{width: "40px", fontSize: "0.9rem", fontWeight: "bold", display: "flex", flexDirection: "column"}}>
                      <span>#{idx + 1}</span>
                      <span style={{fontSize: "0.8rem", color: getMovementColor(app.rankChange)}}>
                        ▲ {app.rankChange}
                      </span>
                    </div>
                    <img src={app.icon} style={{width: "48px", height: "48px", borderRadius: "10px", objectFit: "cover"}} />
                    <div style={{flex: 1, minWidth: 0}}>
                      <div style={{fontWeight: "bold", color: "#4f46e5", fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{app.title}</div>
                      <div style={{color: "#64748b", fontSize: "0.8rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{app.developer} +</div>
                    </div>
                    <div style={{width: "70px", textAlign: "right", color: "#64748b", fontSize: "0.85rem"}}>
                      {app.installsText}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 4: LEAVERS */}
            <div style={{background: "white", borderRadius: "8px", padding: "1.5rem", color: "black", minWidth: "380px", flex: 1, opacity: 0.8}}>
              <div style={{display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: "1rem", marginBottom: "1rem"}}>
                <h3 style={{margin: 0, fontSize: "1.1rem"}}>Leavers (vs previous snapshot)</h3>
                <span style={{color: "#64748b", fontSize: "0.9rem"}}>0 items</span>
              </div>
              
              <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "200px", color: "#94a3b8", textAlign: "center", padding: "0 2rem"}}>
                <div style={{fontSize: "2rem", marginBottom: "1rem"}}>📉</div>
                <div style={{fontWeight: "bold", marginBottom: "0.5rem", color: "#64748b"}}>Data Not Available Yet</div>
                <div style={{fontSize: "0.85rem"}}>Waiting for the next daily snapshot to compare and find leaving apps. Check back tomorrow!</div>
              </div>
            </div>

            {/* COLUMN 5: NEW ENTRIES TODAY */}
            <div style={{background: "white", borderRadius: "8px", padding: "1.5rem", color: "black", minWidth: "380px", flex: 1, opacity: 0.8}}>
              <div style={{display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: "1rem", marginBottom: "1rem"}}>
                <h3 style={{margin: 0, fontSize: "1.1rem"}}>New entries today</h3>
                <span style={{color: "#64748b", fontSize: "0.9rem"}}>0 items</span>
              </div>
              
              <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "200px", color: "#94a3b8", textAlign: "center", padding: "0 2rem"}}>
                <div style={{fontSize: "2rem", marginBottom: "1rem"}}>✨</div>
                <div style={{fontWeight: "bold", marginBottom: "0.5rem", color: "#64748b"}}>Data Not Available Yet</div>
                <div style={{fontSize: "0.85rem"}}>Waiting for the next daily snapshot to identify brand new top chart entries. Check back tomorrow!</div>
              </div>
            </div>

          </div>
        </>
      )}
    </main>
  );
}

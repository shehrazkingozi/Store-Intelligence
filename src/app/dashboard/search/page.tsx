"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, Suspense, useMemo } from "react";
import { Bookmark, Apple } from "lucide-react";

// Google Play Icon SVG component
const GooglePlayIcon = () => (
  <svg viewBox="0 0 48 48" width="18" height="18">
    <path fill="#4caf50" d="M37.9,21.8l-23.7-13.6c-1.3-0.8-2.9-0.8-4.2,0C8.7,9,8,10.2,8,11.5v25c0,1.3,0.7,2.5,2,3.3 c0.7,0.4,1.4,0.6,2.1,0.6c0.7,0,1.4-0.2,2.1-0.6l23.7-13.6c1.3-0.8,2-2.1,2-3.3C39.9,23.9,39.2,22.6,37.9,21.8z"/>
    <path fill="#388e3c" d="M10,11.5c0-1.3,0.7-2.5,2-3.3C10.7,9,10,10.2,10,11.5v25c0,1.3,0.7,2.5,2,3.3C10.7,39,10,37.8,10,36.5V11.5z"/>
  </svg>
);

function formatInstalls(num: number | string) {
  if (!num || num === "N/A" || num === "N/A (iOS)") return "N/A";
  let n = typeof num === 'string' ? parseInt(num.toString().replace(/[^0-9]/g, '')) : num;
  if (isNaN(n) || n === 0) return num.toString();

  if (n >= 1000000000) {
    let formatted = (n / 1000000000).toFixed(1);
    return `~${formatted.replace('.0', '')}B`;
  }
  if (n >= 1000000) {
    let formatted = (n / 1000000).toFixed(1);
    return `~${formatted.replace('.0', '')}M`;
  }
  if (n >= 1000) {
    let formatted = (n / 1000).toFixed(1);
    return `~${formatted.replace('.0', '')}K`;
  }
  return `~${n}`;
}

function parseInstallsRaw(num: number | string) {
  if (!num || num === "N/A" || num === "N/A (iOS)") return 0;
  let n = typeof num === 'string' ? parseInt(num.toString().replace(/[^0-9]/g, '')) : num;
  return isNaN(n) ? 0 : n;
}

function parseReleasedRaw(dateStr: string) {
  if (!dateStr || dateStr === "N/A") return 0;
  const t = new Date(dateStr).getTime();
  return isNaN(t) ? 0 : t;
}

function formatDateDisplay(dateStr: string) {
  if (!dateStr || dateStr === "N/A") return "N/A";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || "";
  
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [filter, setFilter] = useState<'all' | 'playstore' | 'appstore'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'games' | 'apps'>('all');
  const [isCategoryHovered, setIsCategoryHovered] = useState(false);
  const [sortBy, setSortBy] = useState('Relevance');
  
  const [appDetails, setAppDetails] = useState<Record<string, { installs: string; released: string; rawInstalls: number; rawReleased: number }>>({});
  
  const searchSessionRef = useRef(0);
  const fetchedAppsRef = useRef(new Set<string>());

  const fetchSingleApp = async (app: any) => {
    if (fetchedAppsRef.current.has(app.appId)) return;
    fetchedAppsRef.current.add(app.appId);
    
    const store = app.store || 'playstore';
    try {
      const res = await fetch(`/api/app-details?appId=${app.appId}&store=${store}`);
      const resData = await res.json();
      if (resData.success) {
        const installsVal = resData.data.maxInstalls || resData.data.installs;
        const dateVal = resData.data.released || "N/A";
        
        setAppDetails(prev => ({
          ...prev,
          [app.appId]: {
            installs: installsVal ? formatInstalls(installsVal) : "N/A",
            released: dateVal,
            rawInstalls: parseInstallsRaw(installsVal),
            rawReleased: parseReleasedRaw(dateVal)
          }
        }));
      } else {
         setAppDetails(prev => ({
          ...prev,
          [app.appId]: { installs: "N/A", released: "N/A", rawInstalls: 0, rawReleased: 0 }
        }));
      }
    } catch (err) {
      setAppDetails(prev => ({
          ...prev,
          [app.appId]: { installs: "N/A", released: "N/A", rawInstalls: 0, rawReleased: 0 }
      }));
    }
  };

  useEffect(() => {
    if (!q) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setResults([]);
    setAppDetails({});
    fetchedAppsRef.current.clear();
    searchSessionRef.current += 1;
    const currentSession = searchSessionRef.current;

    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then(res => res.json())
      .then(async data => {
        if (data.success) {
          setResults(data.data);
          setIsLoading(false);
          
          // Background queue loading
          for (let i = 0; i < data.data.length; i++) {
            if (searchSessionRef.current !== currentSession) break;
            const app = data.data[i];
            await fetchSingleApp(app);
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        } else {
          setIsLoading(false);
        }
      })
      .catch(() => setIsLoading(false));
  }, [q]);

  const sortedResults = useMemo(() => {
    let arr = results.filter(app => filter === 'all' || app.store === filter || (!app.store && filter === 'playstore'));
    
    if (categoryFilter === 'games') {
      arr = arr.filter(app => app.genre?.toLowerCase().includes('game'));
    } else if (categoryFilter === 'apps') {
      arr = arr.filter(app => !app.genre?.toLowerCase().includes('game'));
    }

    arr = [...arr];

    if (sortBy === 'Total installs' || sortBy === 'Daily installs') {
      arr.sort((a, b) => {
        const dA = appDetails[a.appId]?.rawInstalls || 0;
        const dB = appDetails[b.appId]?.rawInstalls || 0;
        if (dA === dB) return (b.relevanceScore || 0) - (a.relevanceScore || 0);
        return dB - dA;
      });
    } else if (sortBy === 'Newest') {
      arr.sort((a, b) => {
        const dA = appDetails[a.appId]?.rawReleased || 0;
        const dB = appDetails[b.appId]?.rawReleased || 0;
        if (dA === dB) return (b.relevanceScore || 0) - (a.relevanceScore || 0);
        return dB - dA;
      });
    } else if (sortBy === 'Oldest') {
      arr.sort((a, b) => {
        const dA = appDetails[a.appId]?.rawReleased || Infinity;
        const dB = appDetails[b.appId]?.rawReleased || Infinity;
        if (dA === dB) return (b.relevanceScore || 0) - (a.relevanceScore || 0);
        return dA - dB;
      });
    }
    
    return arr;
  }, [results, filter, categoryFilter, sortBy, appDetails]);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <div style={{ marginBottom: "2rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <button 
            onClick={() => setFilter('all')}
            style={{ padding: "0.5rem 1rem", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600, background: filter === 'all' ? '#0f172a' : '#e2e8f0', color: filter === 'all' ? 'white' : '#475569' }}
          >
            All ({results.length})
          </button>
          <button 
            onClick={() => setFilter('playstore')}
            style={{ padding: "0.5rem 1rem", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600, background: filter === 'playstore' ? '#10b981' : '#e2e8f0', color: filter === 'playstore' ? 'white' : '#475569', display: "flex", alignItems: "center", gap: "0.4rem" }}
          >
            <GooglePlayIcon />
            Google Play ({results.filter(r => r.store !== 'appstore').length})
          </button>
          <button 
            onClick={() => setFilter('appstore')}
            style={{ padding: "0.5rem 1rem", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600, background: filter === 'appstore' ? '#0f172a' : '#e2e8f0', color: filter === 'appstore' ? 'white' : '#475569', display: "flex", alignItems: "center", gap: "0.4rem" }}
          >
            <Apple size={16} fill={filter === 'appstore' ? 'white' : '#0f172a'} stroke={filter === 'appstore' ? 'white' : '#0f172a'} />
            App Store ({results.filter(r => r.store === 'appstore').length})
          </button>
          <span style={{ fontSize: "1.1rem", fontWeight: 500, color: "#64748b", marginLeft: "1rem" }}>
            for <span style={{ color: "black", fontWeight: 700 }}>"{q}"</span>
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", color: "#475569", fontWeight: 600, fontSize: "0.85rem", position: "relative", zIndex: 20 }}>
          <div 
            onMouseEnter={() => setIsCategoryHovered(true)} 
            onMouseLeave={() => setIsCategoryHovered(false)}
            style={{ position: "relative", cursor: "pointer", textTransform: "uppercase" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0" }}>
              {categoryFilter === 'all' ? 'GAMES & APPS' : categoryFilter === 'games' ? 'GAMES' : 'APPS'}
              <span style={{ fontSize: "0.6rem" }}>▼</span>
            </div>
            
            {isCategoryHovered && (
              <div style={{ position: "absolute", top: "100%", left: 0, background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", minWidth: "160px", overflow: "hidden" }}>
                <div onClick={() => setCategoryFilter('all')} style={{ padding: "0.8rem 1rem", background: categoryFilter === 'all' ? '#f1f5f9' : 'white', color: "#0f172a" }}>Games & Apps</div>
                <div onClick={() => setCategoryFilter('games')} style={{ padding: "0.8rem 1rem", background: categoryFilter === 'games' ? '#f1f5f9' : 'white', color: "#0f172a" }}>Games</div>
                <div onClick={() => setCategoryFilter('apps')} style={{ padding: "0.8rem 1rem", background: categoryFilter === 'apps' ? '#f1f5f9' : 'white', color: "#0f172a" }}>Apps</div>
              </div>
            )}
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            Sort by 
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: "0.4rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", background: "white", cursor: "pointer", outline: "none" }}
            >
              <option>Relevance</option>
              <option>Total installs</option>
              <option>Daily installs</option>
              <option>Newest</option>
              <option>Oldest</option>
            </select>
          </div>
        </div>

        <style>{`
          .app-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            cursor: pointer;
          }
          .app-card:hover {
            transform: scale(1.03);
            box-shadow: 0 8px 16px rgba(0,0,0,0.1) !important;
            z-index: 10;
          }
          .action-btn {
            padding: 6px;
            border-radius: 8px;
            background: #f1f5f9;
            transition: background 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .action-btn:hover {
            background: #e2e8f0;
          }
        `}</style>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>Loading search results...</div>
        ) : sortedResults.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>No results found.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {sortedResults.map((app: any) => {
              const details = appDetails[app.appId];
              const isAppStore = app.store === 'appstore';
              const storeUrl = isAppStore 
                ? `https://apps.apple.com/app/id${app.appId}`
                : `https://play.google.com/store/apps/details?id=${app.appId}`;

              const dateDisplay = details ? formatDateDisplay(details.released) : "Loading...";
              const installDisplay = details ? details.installs : "Loading...";
              
              const hasDate = dateDisplay !== "N/A" && dateDisplay !== "Loading...";
              const hasInstalls = installDisplay !== "N/A" && installDisplay !== "N/A (iOS)" && installDisplay !== "Loading...";
              const showDate = hasDate || (!hasDate && !hasInstalls); // show N/A if both are missing
              const showInstalls = hasInstalls;

              return (
                <div 
                  key={app.appId} 
                  className="app-card" 
                  onMouseEnter={() => fetchSingleApp(app)}
                  onClick={() => router.push(`/dashboard/app/${app.appId}?store=${app.store || 'playstore'}`)}
                  style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.2rem", position: "relative" }}
                >
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <img src={app.icon} style={{ width: "56px", height: "56px", borderRadius: "12px", objectFit: "cover", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0, paddingRight: "70px" }}>
                      <div style={{ fontWeight: 600, fontSize: "1rem", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{app.title}</div>
                      <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {app.developer} • {app.genre || "App"}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ position: "absolute", top: "1.2rem", right: "1.2rem", display: "flex", gap: "0.4rem" }}>
                    <a 
                      href={storeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="action-btn"
                      onClick={(e) => e.stopPropagation()}
                      title={isAppStore ? "View on App Store" : "View on Google Play"}
                    >
                      {isAppStore ? (
                        <Apple size={16} fill="#0f172a" stroke="#0f172a" />
                      ) : (
                        <GooglePlayIcon />
                      )}
                    </a>
                    <div className="action-btn" onClick={(e) => { e.stopPropagation(); /* bookmark logic */ }} title="Bookmark">
                      <Bookmark size={16} color="#94a3b8" />
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: showInstalls && showDate ? "space-between" : "center", borderTop: "1px solid #f1f5f9", marginTop: "1rem", paddingTop: "0.8rem", fontSize: "0.85rem", color: "#0f172a", textAlign: "center" }}>
                    {showDate && (
                      <div style={{ flex: 1, borderRight: showInstalls ? "1px solid #f1f5f9" : "none" }}>
                        <div style={{ fontWeight: 600 }}>{dateDisplay}</div>
                        <div style={{ color: "#64748b", fontSize: "0.75rem", marginTop: "2px" }}>Released</div>
                      </div>
                    )}
                    {showInstalls && (
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{installDisplay}</div>
                        <div style={{ color: "#64748b", fontSize: "0.75rem", marginTop: "2px" }}>Total Installs</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>Loading search page...</div>}>
      <SearchContent />
    </Suspense>
  );
}

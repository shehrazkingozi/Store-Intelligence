"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import { Play, Bookmark } from "lucide-react";
import TopNavbar from "@/components/TopNavbar";

function formatInstalls(num: number | string) {
  if (!num) return "N/A";
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

function AppDetailsFetcher({ appId }: { appId: string }) {
  const [data, setData] = useState<{ installs: string, released: string } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    let fetched = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !fetched) {
          fetched = true;
          fetch(`/api/app-details?appId=${appId}`)
            .then(res => res.json())
            .then(resData => {
              if (resData.success) {
                const installsVal = resData.data.maxInstalls || resData.data.installs;
                setData({
                  installs: installsVal ? formatInstalls(installsVal) : "N/A",
                  released: resData.data.released || "N/A"
                });
              } else {
                setData({ installs: "N/A", released: "N/A" });
              }
            })
            .catch(() => setData({ installs: "N/A", released: "N/A" }));
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [appId]);

  return (
    <div ref={ref} style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #f1f5f9", marginTop: "1rem", paddingTop: "0.8rem", fontSize: "0.85rem", color: "#0f172a", textAlign: "center" }}>
      <div style={{ flex: 1, borderRight: "1px solid #f1f5f9" }}>
        <div style={{ fontWeight: 600 }}>{data ? data.released : "Loading..."}</div>
        <div style={{ color: "#64748b", fontSize: "0.75rem", marginTop: "2px" }}>Released</div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600 }}>{data ? data.installs : "Loading..."}</div>
        <div style={{ color: "#64748b", fontSize: "0.75rem", marginTop: "2px" }}>Total Installs</div>
      </div>
    </div>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!q) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setResults(data.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [q]);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.1rem", fontWeight: 500, color: "#64748b" }}>
            {results.length} results for <span style={{ color: "black", fontWeight: 700 }}>"{q}"</span>
          </h1>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", color: "#475569", fontWeight: 600, fontSize: "0.85rem" }}>
          <div>GAMES & APPS</div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            Sort by 
            <select style={{ padding: "0.4rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", background: "white" }}>
              <option>Relevance</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>Loading search results...</div>
        ) : results.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>No results found.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {results.map((app: any) => (
              <div key={app.appId} style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", position: "relative" }}>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <img src={app.icon} style={{ width: "56px", height: "56px", borderRadius: "12px", objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "1rem", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{app.title}</div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {app.developer} • {app.genre || "App"}
                    </div>
                  </div>
                </div>
                
                <div style={{ position: "absolute", top: "1.2rem", right: "1.2rem", display: "flex", gap: "0.5rem" }}>
                  <Play size={18} fill="#10b981" stroke="#10b981" />
                  <Bookmark size={18} color="#cbd5e1" style={{ cursor: "pointer" }} />
                </div>

                <AppDetailsFetcher appId={app.appId} />
              </div>
            ))}
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

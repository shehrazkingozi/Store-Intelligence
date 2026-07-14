"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TrackPage() {
  const router = useRouter();
  const [storeUrl, setStoreUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTrack = async () => {
    if (!storeUrl) return;
    setIsSubmitting(true);
    
    // Extract app ID. Could be a full URL like https://play.google.com/store/apps/details?id=com.example.app or just com.example.app
    let appId = storeUrl.trim();
    try {
      if (appId.includes("play.google.com")) {
        const urlParams = new URLSearchParams(appId.split("?")[1]);
        if (urlParams.has("id")) {
          appId = urlParams.get("id") || appId;
        }
      }
    } catch (e) {
      // Ignore URL parsing errors, use raw input
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/app-details?appId=${appId}`);
      const json = await res.json();
      
      if (json.success && json.data) {
        const appData = json.data;
        const newGame = {
          appId: appData.appId,
          title: appData.title,
          icon: appData.icon,
          developer: appData.developer,
          scoreText: appData.scoreText
        };
        
        const existingGames = JSON.parse(localStorage.getItem('trackedGames') || '[]');
        // Don't add duplicate
        if (!existingGames.some((g: any) => g.appId === newGame.appId)) {
          const updated = [...existingGames, newGame];
          localStorage.setItem('trackedGames', JSON.stringify(updated));
        }
        
        router.push("/dashboard");
      } else {
        alert("Failed to track game. Make sure the URL or package ID is correct.");
      }
    } catch (err) {
      alert("Network error tracking game.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{maxWidth: "1000px", margin: "0 auto", padding: "3rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif"}}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem"}}>
        <h1 style={{fontSize: "1.2rem", fontWeight: 700, color: "#0f172a"}}>Add Mode</h1>
        <div style={{background: "#f1f5f9", borderRadius: "8px", padding: "0.3rem", display: "flex", gap: "0.2rem"}}>
          <button style={{background: "white", border: "none", padding: "0.4rem 1rem", borderRadius: "6px", fontSize: "0.85rem", fontWeight: 600, color: "#4f46e5", boxShadow: "0 1px 2px rgba(0,0,0,0.05)"}}>Single</button>
          <button style={{background: "transparent", border: "none", padding: "0.4rem 1rem", borderRadius: "6px", fontSize: "0.85rem", fontWeight: 600, color: "#64748b"}}>Bulk Add</button>
        </div>
      </div>

      <div style={{background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem"}}>
        <h2 style={{fontSize: "1rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.3rem 0"}}>Save to Collection (optional)</h2>
        <p style={{color: "#64748b", fontSize: "0.85rem", marginBottom: "1rem"}}>If selected, all tracked publishers from this submit will be added to that collection.</p>
        
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end"}}>
          <div style={{flex: 1, maxWidth: "60%"}}>
            <label style={{display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#0f172a", marginBottom: "0.5rem"}}>Choose collection</label>
            <select style={{width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", appearance: "none", background: "white url('data:image/svg+xml;utf8,<svg fill=%22none%22 stroke=%22currentColor%22 viewBox=%220 0 24 24%22 xmlns=%22http://www.w3.org/2000/svg%22><path stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M19 9l-7 7-7-7%22></path></svg>') no-repeat right 0.75rem center/16px 16px"}}>
              <option>No collection</option>
            </select>
          </div>
          <button style={{background: "transparent", border: "none", color: "#4f46e5", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer"}}>+ Create new collection</button>
        </div>
      </div>

      <div style={{display: "flex", gap: "1.5rem", marginBottom: "1.5rem"}}>
        <div style={{flex: 1}}>
          <label style={{display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#0f172a", marginBottom: "0.5rem"}}>Store</label>
          <select style={{width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", appearance: "none", background: "white url('data:image/svg+xml;utf8,<svg fill=%22none%22 stroke=%22currentColor%22 viewBox=%220 0 24 24%22 xmlns=%22http://www.w3.org/2000/svg%22><path stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M19 9l-7 7-7-7%22></path></svg>') no-repeat right 0.75rem center/16px 16px"}}>
            <option>Google Play</option>
          </select>
        </div>
        <div style={{flex: 2}}>
          <label style={{display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#0f172a", marginBottom: "0.5rem"}}>Store URL</label>
          <input 
            type="text" 
            placeholder="Paste app or publisher URL" 
            value={storeUrl}
            onChange={(e) => setStoreUrl(e.target.value)}
            style={{width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none"}}
          />
        </div>
      </div>

      <div style={{background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.5rem"}}>
        <h3 style={{fontSize: "0.9rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.8rem"}}>Examples (Google Play):</h3>
        <p style={{fontSize: "0.85rem", color: "#475569", marginBottom: "0.5rem", fontFamily: "monospace"}}>App: https://play.google.com/store/apps/details?id=com.example.app</p>
        <p style={{fontSize: "0.85rem", color: "#475569", marginBottom: "0.5rem", fontFamily: "monospace"}}>Developer: https://play.google.com/store/apps/dev?id=6111929848863791872</p>
        <p style={{fontSize: "0.85rem", color: "#475569", marginBottom: "1.5rem", fontFamily: "monospace"}}>Developer: https://play.google.com/store/apps/developer?id=Casual+Azur+Games</p>
        
        <p style={{fontSize: "0.85rem", color: "#64748b", margin: 0}}>Tip: App link works best we can auto-detect the correct publisher name & profile instantly.</p>
      </div>

      <div style={{position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #e2e8f0", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <button style={{background: "white", border: "1px solid #e2e8f0", padding: "0.5rem 1rem", borderRadius: "20px", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600, fontSize: "0.9rem", color: "#0f172a"}}>
          <span style={{color: "#4f46e5"}}>✨</span> Ask Signal
        </button>
        <div style={{display: "flex", gap: "1rem", alignItems: "center"}}>
          <button onClick={() => router.push('/dashboard')} style={{background: "transparent", border: "none", color: "#64748b", fontWeight: 600, cursor: "pointer", fontSize: "0.95rem"}}>Cancel</button>
          <button onClick={handleTrack} disabled={!storeUrl || isSubmitting} style={{background: "#4f46e5", color: "white", border: "none", padding: "0.8rem 2rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "0.95rem", opacity: (!storeUrl || isSubmitting) ? 0.7 : 1}}>
            {isSubmitting ? "Tracking..." : "Track Publisher"}
          </button>
        </div>
      </div>
    </div>
  );
}

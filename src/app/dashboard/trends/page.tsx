"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { TrendingUp, Activity, BarChart2 } from 'lucide-react';

export default function TrendsPage() {
  // Simulate 30-day market data
  const generateTrendData = () => {
    const data = [];
    let baseSocial = 500000;
    let baseGames = 800000;
    let baseFinance = 200000;
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      // Add random daily volatility
      baseSocial += (Math.random() - 0.45) * 50000;
      baseGames += (Math.random() - 0.4) * 80000;
      baseFinance += (Math.random() - 0.5) * 30000;

      data.push({
        date: dateStr,
        Social: Math.floor(Math.max(baseSocial, 100000)),
        Games: Math.floor(Math.max(baseGames, 200000)),
        Finance: Math.floor(Math.max(baseFinance, 50000)),
      });
    }
    return data;
  };

  const trendData = generateTrendData();

  const customTooltipStyle = {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '8px',
    color: '#f8fafc'
  };

  return (
    <main className="container">
      <header className="header" style={{marginBottom: "2rem"}}>
        <div>
          <h1 className="title" style={{display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem"}}>
            <Activity size={28} color="#60a5fa" /> Market Trends Intelligence
          </h1>
          <p style={{color: "var(--text-muted)", fontSize: "1.1rem"}}>
            Global 30-day download volatility across major app categories.
          </p>
        </div>
      </header>

      <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "2rem"}}>
        <div className="card" style={{padding: "1.5rem", borderLeft: "4px solid #ef4444"}}>
          <div style={{color: "var(--text-muted)", fontSize: "0.9rem", textTransform: "uppercase"}}>Highest Volatility</div>
          <div style={{fontSize: "2rem", fontWeight: "bold"}}>Games</div>
          <div style={{color: "#ef4444", fontSize: "0.9rem", marginTop: "0.5rem"}}>+12.4% day-over-day shift</div>
        </div>
        <div className="card" style={{padding: "1.5rem", borderLeft: "4px solid #3b82f6"}}>
          <div style={{color: "var(--text-muted)", fontSize: "0.9rem", textTransform: "uppercase"}}>Steady Growth</div>
          <div style={{fontSize: "2rem", fontWeight: "bold"}}>Social</div>
          <div style={{color: "#16a34a", fontSize: "0.9rem", marginTop: "0.5rem"}}>+2.1% sustained growth</div>
        </div>
        <div className="card" style={{padding: "1.5rem", borderLeft: "4px solid #eab308"}}>
          <div style={{color: "var(--text-muted)", fontSize: "0.9rem", textTransform: "uppercase"}}>Emerging Market</div>
          <div style={{fontSize: "2rem", fontWeight: "bold"}}>Finance</div>
          <div style={{color: "#eab308", fontSize: "0.9rem", marginTop: "0.5rem"}}>High weekend spikes detected</div>
        </div>
      </div>

      <div className="card" style={{padding: "2rem", marginBottom: "2rem"}}>
        <h3 style={{marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem"}}>
          <TrendingUp size={20} color="#16a34a"/> 30-Day Category Downloads (Global Estimate)
        </h3>
        <div style={{height: 400, width: "100%"}}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGames" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSocial" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorFinance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
              <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={customTooltipStyle} formatter={(value: any) => new Intl.NumberFormat('en-US').format(Number(value))} />
              <Legend />
              <Area type="monotone" dataKey="Games" stroke="#ef4444" fillOpacity={1} fill="url(#colorGames)" />
              <Area type="monotone" dataKey="Social" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSocial)" />
              <Area type="monotone" dataKey="Finance" stroke="#eab308" fillOpacity={1} fill="url(#colorFinance)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem"}}>
        <div className="card" style={{padding: "2rem"}}>
          <h3 style={{marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem"}}>
            <BarChart2 size={20} color="#c084fc"/> Retention Rate vs Category
          </h3>
          <div style={{height: 250, width: "100%"}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                {name: 'Games', D1: 35, D7: 15, D30: 5},
                {name: 'Social', D1: 45, D7: 25, D30: 15},
                {name: 'Finance', D1: 25, D7: 12, D30: 8},
                {name: 'Shopping', D1: 30, D7: 10, D30: 4},
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={customTooltipStyle} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                <Legend />
                <Bar dataKey="D1" fill="#818cf8" name="Day 1" radius={[4,4,0,0]} />
                <Bar dataKey="D7" fill="#c084fc" name="Day 7" radius={[4,4,0,0]} />
                <Bar dataKey="D30" fill="#f472b6" name="Day 30" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "center"}}>
          <h3 style={{marginBottom: "1rem"}}>Market Insights</h3>
          <ul style={{listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "1rem", color: "var(--text-muted)", lineHeight: 1.6}}>
            <li><strong style={{color: "#fff"}}>Games Volatility:</strong> The gaming sector is experiencing massive weekend spikes, likely driven by major publisher user acquisition (UA) campaigns.</li>
            <li><strong style={{color: "#fff"}}>Social Dominance:</strong> Social apps maintain the highest D30 retention, proving the stickiness of network effects.</li>
            <li><strong style={{color: "#fff"}}>Finance Growth:</strong> A slow but steady rise in Finance app installs correlates with recent crypto market movements.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

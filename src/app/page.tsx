"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="landing-wrapper">
      <header className="landing-header">
        <div className="landing-container">
          <nav className="landing-nav">
            <div className="landing-logo">
              <span style={{color: "var(--accent-color)"}}>Store</span>Signal
            </div>
            <div className="landing-nav-links">
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <Link href="/dashboard" className="btn btn-outline">Log in</Link>
              <Link href="/dashboard" className="btn btn-primary">Go to App</Link>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="landing-container text-center">
            <h1 className="hero-title">
              Spot rising mobile games and apps <br/>
              <span style={{color: "var(--accent-color)"}}>before they go viral.</span>
            </h1>
            <p className="hero-subtitle">
              StoreSignal uses AI-powered top chart intelligence, signals, and competitor tracking to give you a competitive edge.
            </p>
            <div className="hero-cta">
              <Link href="/dashboard" className="btn btn-primary btn-large">Explore Top Charts</Link>
              <Link href="/dashboard/breakouts" className="btn btn-outline btn-large">View Breakout Signals</Link>
            </div>
          </div>
        </section>

        <section id="features" className="features-section">
          <div className="landing-container">
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🚀</div>
                <h3>Breakout Detection</h3>
                <p>Track high momentum apps across Google Play and iOS before your competitors do.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <h3>Competitor Discovery</h3>
                <p>Analyze similar apps, compare rankings, and find market gaps effortlessly.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📈</div>
                <h3>Interactive Analytics</h3>
                <p>Visualize 30-day ranking trends and keyword ASO difficulty in a premium dashboard.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer-content">
            <p>&copy; {new Date().getFullYear()} StoreSignal Intelligence. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

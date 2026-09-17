import { Show, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="noti-shell">
      <div className="topline" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Noti home"><span className="brand-mark">n</span><span>noti</span></a>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>
          <a href="#journal">Journal</a>
        </nav>
        <Show when="signed-out">
          <div className="nav-links auth-actions">
            <Link className="header-cta mr-1" href="/sign-in">Sign in</Link>
            <Link className="header-cta" href="/sign-up">Get started <span aria-hidden="true">↗</span></Link>
          </div>
        </Show>
        <Show when="signed-in">
          <div className="auth-actions"><Link className="header-cta" href="/dashboard">Start writing <span aria-hidden="true">↗</span></Link><UserButton /></div>
        </Show>
      </header>
      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> Your second brain, made simple</p>
            <h1>Make space<br /><em>for what matters.</em></h1>
            <p className="hero-text">Noti turns scattered thoughts into clear, useful notes. Capture the spark, find the signal, and keep moving.</p>
            <div className="hero-actions" id="start"><Link className="primary-button" href="/sign-up">Start writing free <span aria-hidden="true">↗</span></Link><a className="text-link" href="#how-it-works">See how it works <span aria-hidden="true">↓</span></a></div>
            <p className="fine-print">No credit card required <span>·</span> Free forever for personal notes</p>
          </div>
          <div className="hero-visual" aria-label="Noti note interface preview">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="note-window">
              <div className="window-bar"><span className="window-logo">n</span><span className="window-title">Today</span><span className="window-more">•••</span></div>
              <div className="note-body"><p className="note-date">TUESDAY, 12 SEPTEMBER</p><h2>The idea is already here.</h2><p className="note-content">Most good ideas don&apos;t arrive fully formed. They show up as a sentence on a walk, a question in the shower, or a quiet feeling that something could be different.</p><p className="note-content">Noti helps you hold onto those beginnings until they&apos;re ready to become something more.</p><div className="note-tags"><span>#ideas</span><span>#writing</span></div></div>
              <div className="ai-prompt"><span className="spark">✦</span><span>Ask Noti about this note...</span><span className="prompt-arrow">↗</span></div>
            </div>
            <div className="floating-chip chip-one"><span className="chip-icon">✦</span><span><strong>3 connections</strong><small>found in your notes</small></span></div><div className="floating-chip chip-two"><span className="check">✓</span><span><strong>Saved instantly</strong><small>just now</small></span></div>
          </div>
        </section>
        <section className="proof-row" aria-label="Noti benefits"><p>Made for the way your mind actually works</p><div><span>01</span> Capture without friction</div><div><span>02</span> Connect the dots</div><div><span>03</span> Return with clarity</div></section>
        <section className="feature-section" id="how-it-works"><div className="section-intro"><p className="eyebrow"><span className="eyebrow-dot" /> A calmer way to think</p><h2>Thoughts, with<br /><em>room to grow.</em></h2></div><div className="feature-list" id="features"><article><span className="feature-number">01</span><div><h3>Catch the thought</h3><p>Write, speak, or drop in a link. Noti gets out of the way so the idea can land.</p></div><span className="feature-arrow">↗</span></article><article><span className="feature-number">02</span><div><h3>Let AI find the thread</h3><p>Noti gently surfaces patterns and connections across everything you&apos;ve saved.</p></div><span className="feature-arrow">↗</span></article><article id="journal"><span className="feature-number">03</span><div><h3>Come back wiser</h3><p>Your notes become a living archive: searchable, personal, and quietly getting smarter.</p></div><span className="feature-arrow">↗</span></article></div></section>
      </main>
      <footer className="site-footer"><a className="brand" href="#top"><span className="brand-mark">n</span><span>noti</span></a><p>A little more clarity, every day.</p><span>© 2025 Noti</span></footer>
    </div>
  );
}

import { useEffect, useState } from 'react'

const patterns = [
  'pattern-1', 'pattern-2', 'pattern-3', 'pattern-4', 'pattern-5',
  'pattern-6', 'pattern-7', 'pattern-8', 'pattern-9', 'pattern-10',
  'pattern-11', 'pattern-12', 'pattern-13', 'pattern-14', 'pattern-15',
  'pattern-16', 'pattern-17', 'pattern-18', 'pattern-19', 'pattern-20',
  'pattern-21', 'pattern-22', 'pattern-23', 'pattern-24', 'pattern-25',
  'pattern-26', 'pattern-27', 'pattern-28', 'pattern-29', 'pattern-30'
]

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    // Apply random pattern to body
    const randomIndex = Math.floor(Math.random() * patterns.length)
    document.body.classList.add(patterns[randomIndex])

    return () => {
      // Cleanup on unmount
      patterns.forEach(p => document.body.classList.remove(p))
    }
  }, [])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault()
    const target = document.querySelector(hash)
    if (target) {
      setMenuOpen(false)
      const header = document.querySelector('header')
      const headerHeight = header ? header.offsetHeight : 0
      const styles = window.getComputedStyle(target)
      const marginTop = parseFloat(styles.marginTop) || 0
      const extra = 12
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - marginTop - extra

      window.scrollTo({ top: targetPosition, behavior: 'smooth' })
      history.pushState(null, '', hash)
    }
  }

  return (
    <>
      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: '#fff',
        borderBottom: '5px solid #000',
        padding: '1.5rem 2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}>
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div className="brand-logo" style={{
            fontSize: '1.25rem',
            fontWeight: 900,
            border: '3px solid #000',
            padding: '0.5rem 1rem',
            position: 'relative'
          }}>
            <span>MATHE</span><span style={{ background: '#000', color: '#fff', padding: '0.1em 0.3em' }}>M</span><span>ATRICKS</span>
          </div>
          <ul className={`nav-links ${menuOpen ? 'active' : ''}`} style={{
            display: 'flex',
            gap: 0,
            listStyle: 'none'
          }}>
            <li><a href="#home" onClick={(e) => scrollToSection(e, '#home')}>Home</a></li>
            <li><a href="#edge" onClick={(e) => scrollToSection(e, '#edge')}>Our Edge</a></li>
            <li><a href="#fine-print" onClick={(e) => scrollToSection(e, '#fine-print')}>The Fine Print</a></li>
            <li><a href="#risk" onClick={(e) => scrollToSection(e, '#risk')}>Risk</a></li>
            <li><a href="#contact" onClick={(e) => scrollToSection(e, '#contact')}>Get In Touch</a></li>
          </ul>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              background: '#000',
              color: '#fff',
              border: '3px solid #000',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontSize: '1.5rem',
              lineHeight: 1
            }}
          >
            ☰
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero binary-pattern">
        <div className="container">
          <p className="subtitle">MatheMatricks Fun(D)</p>
          <h1 className="shared-m-title">
            Making Money Shouldn't Be This Fun.
          </h1>
          <div className="description">
            <p>Let's drop the pretense. You're not here for a mission statement about "changing the world". You're here to turn a large pile of money into a larger pile of money.</p>
            <p>So here we are. Cold, hard, beautiful math–deployed, across a multi-strategy, quantitative fund that's built to perform. We're not selling a fairy-tale. We're selling a result.</p>
          </div>
          <p className="inspired-by">Inspired by Data</p>
        </div>
      </section>

      {/* Our Edge Section */}
      <section id="edge">
        <div className="container">
          <h2 className="section-title">Our Edge</h2>
          <div className="edge-cards">
            <div className="edge-card">
              <h3>Talent Acquisition</h3>
              <p>We attract brilliant quants by replacing soul-crushing bureaucracy with a simple formula: intellectual freedom, a mandate to think differently. Sure, an enormous piles of capital helps.</p>
            </div>
            <div className="edge-card">
              <h3>Strategy Diversity</h3>
              <p>We don't have a single 'golden goose.' That's how funds die. We run a swarm of 15+ automated strategies. Some might zig while others zag. Some might take a nap. The point is, the swarm as a whole is a relentless, honey-badger-of-a-thing that constantly hunts for alpha.</p>
            </div>
            <div className="edge-card">
              <h3>Our Secret Sauce</h3>
              <p>Our allocation algorithm is the sociopathic CEO of the strategy team. It has no ego. It feels no loyalty. If a strategy underperforms, it doesn't get a warning or a bad performance review. It gets its capital cut. Immediately. This brutal, unemotional discipline keeps the whole machine ruthlessly efficient.</p>
            </div>
          </div>
          <p style={{ marginTop: '2.5rem', textAlign: 'center', fontStyle: 'italic', opacity: 0.8, fontSize: '0.9rem' }}>Result: An equity curve that looks like a piece of art. It should be on a wall in MoMA*</p>
        </div>
      </section>

      {/* Fund Legal Section */}
      <section id="fund-legal">
        <div className="container">
          <div className="section-grid">
            <h2 className="section-title">Fund Legal</h2>
            <div className="section-content">
              <p>We're a Delaware registered fund with people in Dubai and Toronto. Why? Because algorithms don't care about prestigious postcodes, and the best quantitative minds aren't all crammed into one square mile of Manhattan. We hunt for alpha wherever in the world it lives, and we hire genius wherever we find it. Being outside the financial echo chamber isn't a strategy; it's a prerequisite for independent thought.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Alignment Section */}
      <section id="alignment">
        <div className="container">
          <div className="section-grid">
            <h2 className="section-title">Alignment of Interest</h2>
            <div className="section-content">
              <p>Let's make this one brutally simple. There is one non-negotiable rule at this firm: if you work here, you invest here. (actual money, not just time)</p>
              <p>Every single person you will ever speak to from Mathematrics—from the founders, to the person who answers the phone—has their own personal capital in the fund. It is a pre-condition of their employment. We don't hire employees; we partner with believers (can we say Beliebers, here? risky. might not age well).</p>
              <p>But on a more serious note, this purifies the conversation. When we talk about risk and performance, we're not just talking about your money. We're talking about <em>our</em> money. End of discussion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fine Print Section */}
      <section id="fine-print">
        <div className="container">
          <div className="section-grid">
            <h2 className="section-title">The Fine Print</h2>
            <div className="section-content">
              <p><strong>Minimum Investment:</strong> $2 million.</p>
              <p><strong>Management Fee:</strong> 4%.</p>
              <p><strong>Performance Fee:</strong> 30%.</p>
              <p><strong>Liquidity:</strong> 100% liquid. Need your money? You'll get it, with a 5-day heads-up. We find it absurd that other funds make you beg for your own capital. It's your money, not a hostage. and it does not have Stockholm syndrome.</p>
              <p><strong>Reporting:</strong> Live NAV, refreshed constantly. Plus a no-bullshit note from the Fund Manager once a month.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Management Section */}
      <section id="risk">
        <div className="container">
          <h2 className="section-title">Risk Management</h2>
          <p className="text-center" style={{ marginBottom: '2.5rem', fontSize: '0.95rem', opacity: 0.7 }}>We love country music, but we're not cowboys. We handle volatile assets with extreme precision, respect, and a healthy dose of paranoia.</p>
          <div className="edge-cards">
            <div className="edge-card">
              <h3>The Kill Switches</h3>
              <p>We have hard stop-losses and automated exposure caps. These aren't guidelines; they're digital tripwires designed to prevent a bad day from turning into a cataclysm.</p>
            </div>
            <div className="edge-card">
              <h3>The Paranoia Engine</h3>
              <p>The market is a psycho. Our dynamic framework constantly monitors volatility and correlations, adapting our posture in real-time before the market's mood swings get the best of us.</p>
            </div>
            <div className="edge-card">
              <h3>Apocalypse Drills</h3>
              <p>We've torture-tested our models against every nightmare scenario we could find: the Dot-Com bust, the 2008 GFC, the 2020 Covid crash, the Russian default, the Asian currency crisis. We even ran simulations for an AI-induced flash crash and a global shipping lockdown caused by a single, very stubborn whale. The models blinked, spat out some coffee, but held together. (Phew.)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact">
        <div className="container">
          <h2 className="section-title">Get In Touch</h2>
          <p className="text-center" style={{ marginBottom: '2.5rem', fontSize: '0.95rem', opacity: 0.7 }}>What's on your mind?</p>
          <form className="contact-form" method="post" data-netlify="true" name="contact">
            <input type="hidden" name="form-name" value="contact" />
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="company">Company</label>
              <input type="text" id="company" name="company" />
            </div>
            <div className="form-group">
              <label htmlFor="query-type">Query Type *</label>
              <select id="query-type" name="query-type" required>
                <option value="">Select a query type</option>
                <option value="investment">Investment Query</option>
                <option value="fund-admin">Fund Admin Query</option>
                <option value="sales">Sales Query</option>
                <option value="strategy">Strategy Partnership</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea id="message" name="message" required></textarea>
            </div>
            <div className="text-center">
              <button type="submit" className="submit-btn"><span>Send Message</span></button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <p>&copy; 2025 Mathematrics Fun(D). All rights reserved. | We're a multi-strategy quantitative hedge fund. You get it.</p>
        </div>
      </footer>

      <style>{`
        header { position: fixed; top: 0; left: 0; right: 0; background: #fff; border-bottom: 5px solid #000; padding: 1.5rem 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 1000; }
        nav { display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; }
        .brand-logo { font-size: 1.25rem; font-weight: 900; border: 3px solid #000; padding: 0.5rem 1rem; position: relative; }
        .brand-logo::before { content: ''; position: absolute; top: -8px; left: -8px; right: -8px; bottom: -8px; border: 2px solid #ffeb3b; z-index: -1; }
        .nav-links { display: flex; gap: 0; list-style: none; }
        .nav-links a { color: #000; text-decoration: none; font-size: 0.875rem; border: 2px solid #000; padding: 0.5rem 1rem; margin-left: -2px; transition: all 0.2s; }
        .nav-links a:hover { background: #000; color: #fff; transform: translateY(-2px); }
        .menu-toggle { display: none; background: #000; color: #fff; border: 3px solid #000; padding: 0.5rem 1rem; cursor: pointer; font-size: 1.5rem; line-height: 1; }
        section, .hero { max-width: 900px; margin: 0 auto; padding: 4rem 2rem; background: #fff; margin-top: 3rem; border: 5px solid #000; box-shadow: 10px 10px 0 rgba(0,0,0,1); position: relative; scroll-margin-top: 90px; }
        section::before { content: ''; position: absolute; top: 15px; right: 15px; width: 80px; height: 80px; background: linear-gradient(45deg, #ffeb3b 25%, transparent 25%, transparent 75%, #ffeb3b 75%), linear-gradient(45deg, #ffeb3b 25%, transparent 25%, transparent 75%, #ffeb3b 75%); background-size: 20px 20px; background-position: 0 0, 10px 10px; opacity: 0.3; }
        .hero::before { width: 150px; height: 150px; background: repeating-linear-gradient(45deg, #000, #000 2px, transparent 2px, transparent 10px); opacity: 0.05; }
        .container { max-width: 100%; }
        h1 { font-size: 2.5rem; font-weight: 900; margin-bottom: 2rem; line-height: 1.1; position: relative; display: inline-block; }
        h1::after { content: ''; position: absolute; bottom: -10px; left: 0; width: 60%; height: 8px; background: #ffeb3b; z-index: -1; }
        .shared-m-title { font-size: 2rem; font-weight: 900; line-height: 1.2; margin-bottom: 2rem; position: relative; color: #000; }
        .shared-m-title::after { content: ''; position: absolute; bottom: -10px; left: 0; width: 50%; height: 8px; background: #ffeb3b; z-index: -1; }
        h2, .section-title { font-size: 1.75rem; font-weight: 900; margin-bottom: 2rem; border-bottom: 4px solid #000; padding-bottom: 0.5rem; position: relative; }
        h2::before, .section-title::before { content: '▪'; color: #ffeb3b; margin-right: 0.5rem; font-size: 2rem; vertical-align: middle; }
        h3 { font-size: 1.125rem; font-weight: 900; margin-top: 2rem; margin-bottom: 0.5rem; padding: 0.75rem 1.25rem; border: 3px solid #000; background: #fff; box-shadow: 4px 4px 0 rgba(0,0,0,0.1); display: block; width: 100%; }
        p { margin-bottom: 1rem; }
        .subtitle, .inspired-by { font-size: 0.875rem; opacity: 0.7; margin-bottom: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
        .description { margin-bottom: 2rem; }
        .edge-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-top: 2rem; }
        .edge-card { margin-bottom: 0; padding: 2rem; border: 3px solid #000; background: #fff; box-shadow: 6px 6px 0 #ffeb3b; transition: all 0.3s; position: relative; overflow: hidden; }
        .edge-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(90deg, #000 50%, #ffeb3b 50%); }
        .edge-card:hover { transform: translate(-4px, -4px); box-shadow: 10px 10px 0 #ffeb3b; }
        footer { text-align: center; padding: 3rem 2rem; font-size: 0.75rem; opacity: 0.6; }
        .contact-form { max-width: 500px; margin: 0 auto; padding: 2rem; border: 3px solid #000; background: #f9f9f9; box-shadow: 6px 6px 0 #ffeb3b; }
        .form-group { margin-bottom: 1.5rem; position: relative; }
        label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        input, select, textarea { width: 100%; padding: 0.75rem; border: 3px solid #000; background: #fff; color: #000; font-family: inherit; font-size: 0.875rem; transition: all 0.2s; }
        input:focus, select:focus, textarea:focus { outline: none; box-shadow: 4px 4px 0 #ffeb3b; transform: translate(-2px, -2px); }
        textarea { min-height: 100px; }
        .submit-btn { background: #000; color: #fff; border: 3px solid #000; padding: 1rem 2rem; cursor: pointer; font-family: inherit; font-weight: 900; box-shadow: 4px 4px 0 #ffeb3b; transition: all 0.2s; text-transform: uppercase; letter-spacing: 1px; }
        .submit-btn:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #ffeb3b; }
        .text-center { text-align: center; }

        @media (max-width: 768px) {
          body { padding-top: 70px; font-size: 15px; }
          header { padding: 1rem 1.5rem; }
          .brand-logo { font-size: 1.125rem; padding: 0.4rem 0.8rem; }
          .nav-links {
            position: fixed; top: 0; right: -100%; width: 280px; height: 100vh;
            background: #fff; border-left: 3px solid #000; box-shadow: -4px 0 8px rgba(0,0,0,0.3);
            flex-direction: column; gap: 1rem; padding-top: 80px; padding-left: 1rem; padding-right: 1rem;
            transition: right 0.3s ease; z-index: 999;
          }
          .nav-links.active { right: 0; }
          .nav-links a { margin-left: 0; text-align: center; width: 100%; }
          .menu-toggle { display: block !important; position: relative; z-index: 1000; }
          section, .hero { padding: 2.5rem 1.5rem; margin-top: 2rem; border-width: 4px; box-shadow: 8px 8px 0 rgba(0,0,0,1); }
          .edge-cards { grid-template-columns: 1fr; gap: 1.5rem; }
        }

        @media (max-width: 480px) {
          body { padding-top: 65px; font-size: 14px; }
          header { padding: 0.875rem 1rem; border-bottom: 3px solid #000; }
          .brand-logo { font-size: 1rem; padding: 0.375rem 0.7rem; border: 2px solid #000; }
          section, .hero { padding: 2rem 1rem; margin-top: 1.5rem; border-width: 3px; box-shadow: 6px 6px 0 rgba(0,0,0,1); }
          section::before, .hero::before { display: none; }
          h1 { font-size: 1.75rem; }
          .shared-m-title { font-size: 1.5rem; }
          h2, .section-title { font-size: 1.375rem; }
        }
      `}</style>
    </>
  )
}

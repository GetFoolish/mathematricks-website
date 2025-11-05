const fs = require('fs');
const path = require('path');

// Exact HTML body content from index.html
const htmlBody = `    <!-- Header -->
    <header>
        <nav class="container">
            <div class="brand-logo">
                <span>MATHE</span><span class="accent-m">M</span><span>ATRICS</span>
            </div>
            <ul class="nav-links" id="navLinks">
                <li><a href="#home">Home</a></li>
                <li><a href="#edge">Our Edge</a></li>
                <li><a href="#crew">The Crew</a></li>
                <li><a href="#fine-print">The Fine Print</a></li>
                <li><a href="#risk">Risk</a></li>
                <li><a href="#contact">Get In Touch</a></li>
            </ul>
            <button class="menu-toggle" id="menuToggle">☰</button>
        </nav>
    </header>

    <!-- Hero Section -->
    <section id="home" class="hero binary-pattern">
        <div class="container">
            <p class="subtitle">MatheMatricks Fun(D)</p>
            <h1>Making Money Shouldn't Be This Fun.</h1>
            <div class="description">
                <p>Let's drop the pretense. You're not here for a mission statement about "changing the world." You're here to turn a large pile of money into a larger pile of money.</p>
                <p>So here we are. Cold, hard, beautiful math—deployed across a multi-strategy quantitative fund that's built to perform. We're not selling a fairy-tale. We're selling a result.</p>
            </div>
            <p class="inspired-by">Inspired by Data</p>
        </div>
    </section>

    <!-- Our Edge Section -->
    <section id="edge">
        <div class="container">
            <h2 class="section-title">Our Edge</h2>
            <div class="edge-cards">
                <div class="edge-card">
                    <h3>Talent Acquisition</h3>
                    <p>We attract brilliant quants by replacing soul-crushing bureaucracy with a simple formula: intellectual freedom, a mandate to think differently. Sure, enormous piles of capital helps.</p>
                </div>
                <div class="edge-card">
                    <h3>Strategy Diversity</h3>
                    <p>We don't have a single 'golden goose.' That's how funds die. We run a swarm of 15+ automated strategies. Some might zig while others zag. Some might take a nap. The point is, the swarm as a whole is a relentless, honey-badger-of-a-thing that constantly hunts for alpha.</p>
                </div>
                <div class="edge-card">
                    <h3>Our Secret Sauce (aka The Algorithm)</h3>
                    <p>Our allocation algorithm is the sociopathic CEO of the strategy team. It has no ego. It feels no loyalty. If a strategy underperforms, it doesn't get a warning or a bad performance review. It gets its capital cut. Immediately. This brutal, unemotional discipline keeps the whole machine ruthlessly efficient.</p>
                </div>
            </div>
            <p style="margin-top: 2.5rem; text-align: center; font-style: italic; opacity: 0.8; font-size: 0.9rem;">Result: An equity curve that looks like a piece of art. It should be on a wall in MoMA*</p>
        </div>
    </section>

    <!-- The Crew Section -->
    <section id="crew">
        <div class="container">
            <div class="section-grid">
                <h2 class="section-title">The Crew</h2>
                <div class="section-content">
                    <p><strong>Vandan, Gagan, Angelica.</strong></p>
                    <p>That's the in-house crew. We're small, which means we're not bogged down by committees, corporate retreats, or HR departments. The day-to-day—the investor outreach, the alpha development, the stuff that makes the engine roar—is handled by a global network of professionals who are the best at what they do.</p>
                    <p><span class="highlight">We don't hire employees; we partner with killers.</span></p>
                </div>
            </div>
        </div>
    </section>

    <!-- Fund Legal Section -->
    <section id="fund-legal">
        <div class="container">
            <div class="section-grid">
                <h2 class="section-title">Fund Legal</h2>
                <div class="section-content">
                    <p>We're a Delaware registered fund with people in Dubai and Toronto. Why? Because algorithms don't care about prestigious postcodes, and the best quantitative minds aren't all crammed into one square mile of Manhattan. We hunt for alpha wherever in the world it lives, and we hire genius wherever we find it. Being outside the financial echo chamber isn't a strategy; it's a prerequisite for independent thought.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Alignment Section -->
    <section id="alignment">
        <div class="container">
            <div class="section-grid">
                <h2 class="section-title">Alignment of Interest</h2>
                <div class="section-content">
                    <p>Let's make this one brutally simple. There is one non-negotiable rule at this firm: if you work here, you invest here. (actual money, not just time)</p>
                    <p>Every single person you will ever speak to from Mathematrics—from the founders, to the person who answers the phone—has their own personal capital in the fund. It is a pre-condition of their employment. We don't hire employees; we partner with believers (can we say Beliebers, here? risky. might not age well).</p>
                    <p>But on a more serious note, this purifies the conversation. When we talk about risk and performance, we're not just talking about your money. We're talking about <em>our</em> money. End of discussion.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Fine Print Section -->
    <section id="fine-print">
        <div class="container">
            <div class="section-grid">
                <h2 class="section-title">The Fine Print</h2>
                <div class="section-content">
                    <p><strong>Minimum Investment:</strong> $2 million.</p>
                    <p><strong>Management Fee:</strong> 4%.</p>
                    <p><strong>Performance Fee:</strong> 30%.</p>
                    <p><strong>Liquidity:</strong> 100% liquid. Need your money? You'll get it, with a 5-day heads-up. We find it absurd that other funds make you beg for your own capital. It's your money, not a hostage. and it does not have Stockholm syndrome.</p>
                    <p><strong>Reporting:</strong> Live NAV, refreshed constantly. Plus a no-bullshit note from the Fund Manager once a month.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Risk Management Section -->
    <section id="risk">
        <div class="container">
            <h2 class="section-title">Risk Management</h2>
            <p class="text-center" style="margin-bottom: 2.5rem; font-size: 0.95rem; opacity: 0.7;">We love country music, but we're not cowboys. We handle volatile assets with extreme precision, respect, and a healthy dose of paranoia.</p>
            <div class="edge-cards">
                <div class="edge-card">
                    <h3>The Kill Switches</h3>
                    <p>We have hard stop-losses and automated exposure caps. These aren't guidelines; they're digital tripwires designed to prevent a bad day from turning into a cataclysm.</p>
                </div>
                <div class="edge-card">
                    <h3>The Paranoia Engine</h3>
                    <p>The market is a psycho. Our dynamic framework constantly monitors volatility and correlations, adapting our posture in real-time before the market's mood swings get the best of us.</p>
                </div>
                <div class="edge-card">
                    <h3>Apocalypse Drills</h3>
                    <p>We've torture-tested our models against every nightmare scenario we could find: the Dot-Com bust, the 2008 GFC, the 2020 Covid crash, the Russian default, the Asian currency crisis. We even ran simulations for an AI-induced flash crash and a global shipping lockdown caused by a single, very stubborn whale. The models blinked, spat out some coffee, but held together. (Phew.)</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact">
        <div class="container">
            <h2 class="section-title">Get In Touch</h2>
            <p class="text-center" style="margin-bottom: 2.5rem; font-size: 0.95rem; opacity: 0.7;">What's on your mind?</p>
            <form class="contact-form" method="post" netlify name="contact" data-netlify="true">
                <input type="hidden" name="form-name" value="contact" />
                <div class="form-group">
                    <label for="name">Name *</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email *</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="company">Company</label>
                    <input type="text" id="company" name="company">
                </div>
                <div class="form-group">
                    <label for="query-type">Query Type *</label>
                    <select id="query-type" name="query-type" required>
                        <option value="">Select a query type</option>
                        <option value="investment">Investment Query</option>
                        <option value="fund-admin">Fund Admin Query</option>
                        <option value="sales">Sales Query</option>
                        <option value="strategy">Strategy Partnership</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="message">Message *</label>
                    <textarea id="message" name="message" required></textarea>
                </div>
                <div class="text-center">
                    <button type="submit" class="submit-btn">Send Message</button>
                </div>
            </form>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <p>&copy; 2025 Mathematrics Fun(D). All rights reserved. | We're a multi-strategy quantitative hedge fund. You get it.</p>
        </div>
    </footer>`;

// CSS styles for each design
const styles = {
    '01': `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #fff; color: #000; line-height: 1.5; font-size: 16px; padding-top: 70px; }
        header { position: fixed; top: 0; left: 0; right: 0; background: #fff; border-bottom: 1px solid #000; padding: 1.5rem 2rem; z-index: 1000; }
        nav { display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; }
        .brand-logo { font-size: 1rem; font-weight: 400; letter-spacing: 0.05em; }
        .accent-m { background: #000; color: #fff; padding: 0.1em 0.3em; }
        .nav-links { display: flex; gap: 2rem; list-style: none; }
        .nav-links a { color: #000; text-decoration: none; font-size: 0.875rem; }
        .menu-toggle { display: none; }
        section, .hero { max-width: 800px; margin: 0 auto; padding: 4rem 2rem; border-bottom: 1px solid #e0e0e0; }
        section:last-of-type { border-bottom: none; }
        .container { max-width: 100%; }
        h1 { font-size: 2rem; font-weight: 400; margin-bottom: 2rem; line-height: 1.2; }
        h2, .section-title { font-size: 1.5rem; font-weight: 400; margin-bottom: 2rem; }
        h3 { font-size: 1rem; font-weight: 500; margin-top: 2rem; margin-bottom: 0.5rem; }
        p { margin-bottom: 1rem; }
        .subtitle, .inspired-by { font-size: 0.875rem; opacity: 0.6; margin-bottom: 1rem; }
        .description { margin-bottom: 2rem; }
        .section-grid { display: block; }
        .section-content { margin-top: 1rem; }
        .edge-cards { display: block; margin-top: 2rem; }
        .edge-card { margin-bottom: 2rem; }
        .highlight { background: #000; color: #fff; padding: 0.2em 0.4em; }
        footer { text-align: center; padding: 2rem; font-size: 0.75rem; opacity: 0.5; border-top: 1px solid #e0e0e0; }
        .contact-form { max-width: 500px; margin: 0 auto; }
        .form-group { margin-bottom: 1.5rem; }
        label { display: block; margin-bottom: 0.25rem; font-size: 0.875rem; }
        input, select, textarea { width: 100%; padding: 0.5rem; border: 1px solid #ccc; font-family: inherit; font-size: 0.875rem; }
        textarea { min-height: 100px; }
        .submit-btn { background: #000; color: #fff; border: none; padding: 0.75rem 1.5rem; cursor: pointer; font-family: inherit; }
        .text-center { text-align: center; }
    `,
    '02': `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Courier New', monospace; background: #0a0a0a; color: #00ff00; line-height: 1.6; font-size: 14px; padding-top: 60px; }
        header { position: fixed; top: 0; left: 0; right: 0; background: #0a0a0a; border-bottom: 1px solid #00ff00; padding: 1rem 2rem; z-index: 1000; }
        nav { display: flex; justify-content: space-between; align-items: center; max-width: 1000px; margin: 0 auto; }
        .brand-logo { font-size: 1rem; font-weight: 700; }
        .brand-logo::before { content: '> '; }
        .accent-m { background: #00ff00; color: #000; padding: 0.1em 0.3em; }
        .nav-links { display: flex; gap: 1.5rem; list-style: none; }
        .nav-links a { color: #00ff00; text-decoration: none; font-size: 0.875rem; }
        .nav-links a::before { content: '['; }
        .nav-links a::after { content: ']'; }
        .menu-toggle { display: none; background: none; border: 1px solid #00ff00; color: #00ff00; }
        section, .hero { max-width: 900px; margin: 0 auto; padding: 3rem 2rem; border-bottom: 1px solid #003300; }
        section:last-of-type { border-bottom: none; }
        .container { max-width: 100%; }
        h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; }
        h1::before { content: '$ '; }
        h2, .section-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem; }
        h2::before, .section-title::before { content: '// '; }
        h3 { font-size: 1rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        h3::before { content: '-- '; }
        p { margin-bottom: 1rem; color: #00dd00; }
        .subtitle, .inspired-by { opacity: 0.6; margin-bottom: 1rem; }
        .description { margin-bottom: 2rem; }
        .section-grid { display: block; }
        .section-content { margin-top: 1rem; }
        .edge-cards { display: block; margin-top: 2rem; }
        .edge-card { margin-bottom: 2rem; }
        .highlight { background: #00ff00; color: #000; padding: 0.2em 0.4em; }
        footer { text-align: center; padding: 2rem; font-size: 0.75rem; opacity: 0.5; border-top: 1px solid #003300; }
        .contact-form { max-width: 500px; margin: 0 auto; }
        .form-group { margin-bottom: 1rem; }
        label { display: block; margin-bottom: 0.25rem; font-size: 0.875rem; }
        input, select, textarea { width: 100%; padding: 0.5rem; border: 1px solid #00ff00; background: #000; color: #00ff00; font-family: inherit; font-size: 0.875rem; }
        textarea { min-height: 100px; }
        .submit-btn { background: #00ff00; color: #000; border: none; padding: 0.75rem 1.5rem; cursor: pointer; font-family: inherit; font-weight: 700; }
        .text-center { text-align: center; }
    `,
    '03': `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #f5f5f5; color: #1a1a1a; line-height: 1.7; font-size: 15px; padding-top: 90px; }
        header { position: fixed; top: 0; left: 0; right: 0; background: #fff; border-bottom: 3px solid #000; padding: 2rem 3rem; z-index: 1000; }
        nav { display: grid; grid-template-columns: 1fr 2fr; max-width: 1100px; margin: 0 auto; gap: 2rem; }
        .brand-logo { font-size: 0.875rem; font-weight: 700; letter-spacing: 0.1em; }
        .accent-m { background: #000; color: #fff; padding: 0.1em 0.3em; }
        .nav-links { display: grid; grid-template-columns: repeat(6, 1fr); list-style: none; gap: 1rem; }
        .nav-links a { color: #000; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .menu-toggle { display: none; }
        section, .hero { background: #fff; max-width: 1100px; margin: 2rem auto; padding: 3rem; }
        .container { max-width: 100%; }
        h1 { font-size: 2.5rem; font-weight: 300; margin-bottom: 2rem; line-height: 1.1; letter-spacing: -0.02em; }
        h2, .section-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem; text-transform: uppercase; letter-spacing: 0.05em; }
        h3 { font-size: 0.875rem; font-weight: 700; margin-top: 2rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; }
        p { margin-bottom: 1.2rem; }
        .subtitle, .inspired-by { font-size: 0.75rem; opacity: 0.6; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .description { margin-bottom: 2rem; }
        .section-grid { display: block; }
        .section-content { margin-top: 1rem; }
        .edge-cards { display: block; margin-top: 2rem; }
        .edge-card { margin-bottom: 2rem; }
        .highlight { background: #000; color: #fff; padding: 0.2em 0.4em; }
        footer { text-align: center; padding: 2rem; font-size: 0.75rem; opacity: 0.5; }
        .contact-form { max-width: 500px; margin: 0 auto; }
        .form-group { margin-bottom: 1.5rem; }
        label { display: block; margin-bottom: 0.5rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
        input, select, textarea { width: 100%; padding: 0.75rem; border: 2px solid #000; background: #fff; color: #000; font-family: inherit; font-size: 0.875rem; }
        textarea { min-height: 120px; }
        .submit-btn { background: #000; color: #fff; border: none; padding: 1rem 2rem; cursor: pointer; font-family: inherit; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
        .text-center { text-align: center; }
    `,
    '04': `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; background: #fafafa; color: #0a0a0a; line-height: 1.6; font-size: 16px; padding-top: 80px; }
        header { position: fixed; top: 0; left: 0; right: 0; background: #fff; border-bottom: 5px solid #000; padding: 1.5rem 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 1000; }
        nav { display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; }
        .brand-logo { font-size: 1.25rem; font-weight: 900; border: 3px solid #000; padding: 0.5rem 1rem; }
        .accent-m { background: #000; color: #fff; padding: 0.1em 0.3em; }
        .nav-links { display: flex; gap: 0; list-style: none; }
        .nav-links a { color: #000; text-decoration: none; font-size: 0.875rem; border: 2px solid #000; padding: 0.5rem 1rem; margin-left: -2px; }
        .menu-toggle { display: none; background: #000; color: #fff; border: 3px solid #000; padding: 0.5rem 1rem; }
        section, .hero { max-width: 900px; margin: 0 auto; padding: 4rem 2rem; background: #fff; margin-top: 2rem; border: 3px solid #000; box-shadow: 8px 8px 0 rgba(0,0,0,1); }
        .container { max-width: 100%; }
        h1 { font-size: 2.5rem; font-weight: 900; margin-bottom: 2rem; line-height: 1.1; }
        h2, .section-title { font-size: 1.75rem; font-weight: 900; margin-bottom: 2rem; border-bottom: 4px solid #000; padding-bottom: 0.5rem; }
        h3 { font-size: 1.125rem; font-weight: 900; margin-top: 2rem; margin-bottom: 0.5rem; }
        p { margin-bottom: 1rem; }
        .subtitle, .inspired-by { font-size: 0.875rem; opacity: 0.7; margin-bottom: 1rem; font-weight: 700; }
        .description { margin-bottom: 2rem; }
        .section-grid { display: block; }
        .section-content { margin-top: 1rem; }
        .edge-cards { display: block; margin-top: 2rem; }
        .edge-card { margin-bottom: 2rem; }
        .highlight { background: #000; color: #fff; padding: 0.2em 0.4em; }
        footer { text-align: center; padding: 3rem 2rem; font-size: 0.75rem; opacity: 0.6; }
        .contact-form { max-width: 500px; margin: 0 auto; }
        .form-group { margin-bottom: 1.5rem; }
        label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700; }
        input, select, textarea { width: 100%; padding: 0.75rem; border: 3px solid #000; background: #fff; color: #000; font-family: inherit; font-size: 0.875rem; }
        textarea { min-height: 100px; }
        .submit-btn { background: #000; color: #fff; border: 3px solid #000; padding: 1rem 2rem; cursor: pointer; font-family: inherit; font-weight: 900; box-shadow: 4px 4px 0 rgba(0,0,0,0.3); }
        .text-center { text-align: center; }
    `,
    '05': `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Georgia, 'Times New Roman', serif; background: #fff; color: #1a1a1a; line-height: 1.8; font-size: 17px; padding-top: 90px; }
        header { position: fixed; top: 0; left: 0; right: 0; background: #fff; border-bottom: 2px solid #000; padding: 2rem 4rem; z-index: 1000; }
        nav { display: flex; justify-content: space-between; align-items: baseline; }
        .brand-logo { font-size: 1.5rem; font-weight: 700; font-style: italic; }
        .accent-m { background: #000; color: #fff; padding: 0.1em 0.3em; font-style: normal; }
        .nav-links { display: flex; gap: 1.5rem; list-style: none; font-size: 0.875rem; }
        .nav-links a { color: #000; text-decoration: none; border-bottom: 1px solid transparent; }
        .nav-links a:hover { border-bottom-color: #000; }
        .menu-toggle { display: none; }
        section, .hero { padding: 2rem 4rem; max-width: 1400px; margin: 0 auto; }
        .container { max-width: 100%; column-count: 2; column-gap: 3rem; }
        h1 { column-span: all; font-size: 2.75rem; font-weight: 400; margin-bottom: 1.5rem; line-height: 1.2; font-style: italic; }
        h2, .section-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; margin-top: 1.5rem; }
        h3 { font-size: 1.125rem; font-weight: 700; font-style: italic; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        p { margin-bottom: 1rem; text-align: justify; }
        .subtitle, .inspired-by { font-size: 0.875rem; opacity: 0.6; margin-bottom: 0.5rem; font-style: italic; }
        .description { margin-bottom: 2rem; }
        .section-grid .section-title { column-span: all; }
        .section-content { break-inside: avoid; }
        .edge-cards { display: block; margin-top: 2rem; }
        .edge-card { break-inside: avoid; margin-bottom: 2rem; }
        .highlight { background: #000; color: #fff; padding: 0.2em 0.4em; }
        footer { column-span: all; text-align: center; padding-top: 2rem; margin-top: 2rem; font-size: 0.75rem; opacity: 0.5; border-top: 1px solid #ccc; }
        .contact-form { column-span: all; max-width: 600px; margin: 2rem auto; }
        .form-group { margin-bottom: 1rem; }
        label { display: block; margin-bottom: 0.25rem; font-size: 0.875rem; font-weight: 700; }
        input, select, textarea { width: 100%; padding: 0.5rem; border: 1px solid #999; font-family: inherit; font-size: 0.875rem; }
        textarea { min-height: 100px; }
        .submit-btn { background: #000; color: #fff; border: none; padding: 0.75rem 1.5rem; cursor: pointer; font-family: inherit; }
        .text-center { text-align: center; }
    `,
    '06': `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Garamond', 'Baskerville', serif; background: #000; color: #fff; line-height: 1.7; font-size: 18px; padding-top: 90px; }
        header { position: fixed; top: 0; left: 0; right: 0; background: #000; border-bottom: 1px solid #fff; padding: 2rem 3rem; z-index: 1000; }
        nav { display: flex; justify-content: space-between; align-items: center; max-width: 900px; margin: 0 auto; }
        .brand-logo { font-size: 1.125rem; font-weight: 400; letter-spacing: 0.2em; font-variant: small-caps; }
        .accent-m { background: #fff; color: #000; padding: 0.1em 0.3em; }
        .nav-links { display: flex; gap: 2.5rem; list-style: none; }
        .nav-links a { color: #fff; text-decoration: none; font-size: 0.8125rem; letter-spacing: 0.1em; opacity: 0.8; }
        .nav-links a:hover { opacity: 1; }
        .menu-toggle { display: none; }
        section, .hero { max-width: 700px; margin: 0 auto; padding: 5rem 3rem; }
        .container { max-width: 100%; }
        h1 { font-size: 3rem; font-weight: 400; margin-bottom: 2.5rem; line-height: 1.15; font-style: italic; }
        h2, .section-title { font-size: 2rem; font-weight: 400; margin-bottom: 2rem; font-style: italic; }
        h3 { font-size: 1.125rem; font-weight: 600; margin-top: 2.5rem; margin-bottom: 0.75rem; }
        p { margin-bottom: 1.25rem; }
        .subtitle, .inspired-by { font-size: 0.875rem; opacity: 0.5; margin-bottom: 1rem; letter-spacing: 0.15em; font-variant: small-caps; }
        .description { margin-bottom: 2rem; }
        .section-grid { display: block; }
        .section-content { margin-top: 1rem; }
        .edge-cards { display: block; margin-top: 2rem; }
        .edge-card { margin-bottom: 2rem; }
        .highlight { background: #fff; color: #000; padding: 0.2em 0.4em; }
        footer { text-align: center; padding: 3rem; font-size: 0.75rem; opacity: 0.4; border-top: 1px solid #333; }
        .contact-form { max-width: 500px; margin: 0 auto; }
        .form-group { margin-bottom: 1.75rem; }
        label { display: block; margin-bottom: 0.5rem; font-size: 0.8125rem; letter-spacing: 0.1em; font-variant: small-caps; }
        input, select, textarea { width: 100%; padding: 0.75rem; border: 1px solid #fff; background: transparent; color: #fff; font-family: inherit; font-size: 0.875rem; }
        input::placeholder, textarea::placeholder { color: #666; }
        textarea { min-height: 120px; }
        .submit-btn { background: #fff; color: #000; border: none; padding: 1rem 2rem; cursor: pointer; font-family: inherit; letter-spacing: 0.1em; font-variant: small-caps; }
        .text-center { text-align: center; }
    `,
    '07': `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Times New Roman', Times, serif; background: #fff; color: #000; line-height: 1.8; font-size: 16px; padding-top: 85px; }
        header { position: fixed; top: 0; left: 0; right: 0; background: #fff; border-bottom: 2px solid #000; padding: 1.5rem 3rem; z-index: 1000; }
        nav { display: flex; justify-content: space-between; align-items: center; max-width: 800px; margin: 0 auto; }
        .brand-logo { font-size: 1rem; font-weight: 700; }
        .accent-m { text-decoration: underline; }
        .nav-links { display: flex; gap: 1.5rem; list-style: none; }
        .nav-links a { color: #000; text-decoration: none; font-size: 0.875rem; border-bottom: 1px solid #000; }
        .menu-toggle { display: none; }
        section, .hero { max-width: 800px; margin: 0 auto; padding: 3rem 3rem; }
        .container { max-width: 100%; }
        h1 { font-size: 2rem; font-weight: 700; margin-bottom: 1.5rem; text-align: center; }
        h2, .section-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem; margin-top: 2rem; text-align: center; }
        h3 { font-size: 1rem; font-weight: 700; font-style: italic; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        p { margin-bottom: 1.2rem; text-align: justify; }
        .subtitle, .inspired-by { font-size: 0.875rem; opacity: 0.7; margin-bottom: 1rem; text-align: center; font-style: italic; }
        .description { margin-bottom: 2rem; }
        .section-grid { display: block; }
        .section-content { margin-top: 1rem; }
        .edge-cards { display: block; margin-top: 2rem; }
        .edge-card { margin-bottom: 2rem; padding-left: 1rem; border-left: 3px solid #000; }
        .highlight { font-weight: 700; font-style: italic; background: none; color: inherit; padding: 0; }
        footer { text-align: center; padding: 2rem; font-size: 0.75rem; opacity: 0.6; border-top: 1px solid #ccc; margin-top: 3rem; }
        .contact-form { max-width: 600px; margin: 2rem auto; }
        .form-group { margin-bottom: 1.5rem; }
        label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700; }
        input, select, textarea { width: 100%; padding: 0.5rem; border: 1px solid #000; font-family: inherit; font-size: 0.875rem; }
        textarea { min-height: 100px; }
        .submit-btn { background: #000; color: #fff; border: none; padding: 0.75rem 1.5rem; cursor: pointer; font-family: inherit; }
        .text-center { text-align: center; }
    `,
    '08': `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #fafafa; color: #222; line-height: 1.7; font-size: 17px; padding-top: 110px; }
        header { position: fixed; top: 0; left: 0; right: 0; background: #fafafa; padding: 3rem 4rem; z-index: 1000; }
        nav { display: flex; justify-content: space-between; align-items: center; max-width: 1000px; margin: 0 auto; }
        .brand-logo { font-size: 0.875rem; font-weight: 300; letter-spacing: 0.3em; text-transform: uppercase; }
        .accent-m { background: none; color: inherit; padding: 0; font-weight: 400; }
        .nav-links { display: flex; gap: 3rem; list-style: none; }
        .nav-links a { color: #222; text-decoration: none; font-size: 0.75rem; opacity: 0.5; letter-spacing: 0.15em; text-transform: uppercase; }
        .nav-links a:hover { opacity: 1; }
        .menu-toggle { display: none; }
        section, .hero { max-width: 600px; margin: 0 auto; padding: 6rem 3rem; }
        .container { max-width: 100%; }
        h1 { font-size: 2.5rem; font-weight: 300; margin-bottom: 3rem; line-height: 1.2; }
        h2, .section-title { font-size: 1.75rem; font-weight: 300; margin-bottom: 3rem; }
        h3 { font-size: 1rem; font-weight: 500; margin-top: 3rem; margin-bottom: 1rem; }
        p { margin-bottom: 1.5rem; }
        .subtitle, .inspired-by { font-size: 0.75rem; opacity: 0.4; margin-bottom: 1.5rem; letter-spacing: 0.2em; text-transform: uppercase; }
        .description { margin-bottom: 3rem; }
        .section-grid { display: block; }
        .section-content { margin-top: 2rem; }
        .edge-cards { display: block; margin-top: 3rem; }
        .edge-card { margin-bottom: 3rem; }
        .highlight { background: none; color: inherit; padding: 0; font-weight: 500; }
        footer { text-align: center; padding: 4rem 3rem; font-size: 0.7rem; opacity: 0.3; }
        .contact-form { max-width: 500px; margin: 3rem auto; }
        .form-group { margin-bottom: 2rem; }
        label { display: block; margin-bottom: 0.75rem; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; opacity: 0.6; }
        input, select, textarea { width: 100%; padding: 0.75rem; border: none; border-bottom: 1px solid #ddd; background: transparent; color: #222; font-family: inherit; font-size: 0.875rem; }
        textarea { min-height: 120px; }
        .submit-btn { background: #222; color: #fff; border: none; padding: 1rem 3rem; cursor: pointer; font-family: inherit; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; }
        .text-center { text-align: center; }
    `,
    '09': `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; line-height: 1.6; font-size: 16px; padding-top: 80px; }
        header { position: fixed; top: 0; left: 0; right: 0; background: rgba(102, 126, 234, 0.95); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,0.2); padding: 1.5rem 2rem; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        nav { display: flex; justify-content: space-between; align-items: center; max-width: 1000px; margin: 0 auto; }
        .brand-logo { font-size: 1rem; font-weight: 600; color: #fff; }
        .accent-m { background: #fff; color: #667eea; padding: 0.1em 0.3em; border-radius: 2px; }
        .nav-links { display: flex; gap: 2rem; list-style: none; }
        .nav-links a { color: #fff; text-decoration: none; font-size: 0.875rem; opacity: 0.9; transition: opacity 0.2s; }
        .nav-links a:hover { opacity: 1; }
        .menu-toggle { display: none; background: none; border: 1px solid #fff; color: #fff; }
        section, .hero { max-width: 900px; margin: 0 auto; padding: 3rem 2rem; background: rgba(255,255,255,0.1); backdrop-filter: blur(5px); border-radius: 10px; margin-bottom: 2rem; }
        section:last-of-type { margin-bottom: 2rem; }
        .container { max-width: 100%; }
        h1 { font-size: 2.25rem; font-weight: 600; margin-bottom: 2rem; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h2, .section-title { font-size: 1.75rem; font-weight: 600; margin-bottom: 2rem; color: #fff; }
        h3 { font-size: 1.125rem; font-weight: 600; margin-top: 2rem; margin-bottom: 0.5rem; color: #fff; }
        p { margin-bottom: 1rem; color: rgba(255,255,255,0.95); }
        .subtitle, .inspired-by { opacity: 0.8; margin-bottom: 1rem; }
        .description { margin-bottom: 2rem; }
        .section-grid { display: block; }
        .section-content { margin-top: 1rem; }
        .edge-cards { display: block; margin-top: 2rem; }
        .edge-card { margin-bottom: 2rem; background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 8px; }
        .highlight { background: #fff; color: #667eea; padding: 0.2em 0.4em; border-radius: 2px; }
        footer { text-align: center; padding: 2rem; font-size: 0.75rem; opacity: 0.7; color: #fff; }
        .contact-form { max-width: 500px; margin: 0 auto; }
        .form-group { margin-bottom: 1.5rem; }
        label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; color: #fff; }
        input, select, textarea { width: 100%; padding: 0.75rem; border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); color: #fff; font-family: inherit; font-size: 0.875rem; border-radius: 5px; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.5); }
        textarea { min-height: 100px; }
        .submit-btn { background: #fff; color: #667eea; border: none; padding: 1rem 2rem; cursor: pointer; font-family: inherit; font-weight: 600; border-radius: 5px; }
        .text-center { text-align: center; }
    `,
    '10': `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #fff; color: #333; line-height: 1.6; font-size: 15px; padding-top: 70px; }
        header { position: fixed; top: 0; left: 0; right: 0; background: #f8f8f8; border-bottom: 1px solid #e0e0e0; padding: 1.25rem 2rem; z-index: 1000; }
        nav { display: flex; justify-content: space-between; align-items: center; max-width: 1100px; margin: 0 auto; }
        .brand-logo { font-size: 0.875rem; font-weight: 600; letter-spacing: 0.05em; color: #333; }
        .accent-m { background: #333; color: #fff; padding: 0.1em 0.3em; }
        .nav-links { display: flex; gap: 2rem; list-style: none; }
        .nav-links a { color: #666; text-decoration: none; font-size: 0.8125rem; }
        .nav-links a:hover { color: #333; }
        .menu-toggle { display: none; }
        section, .hero { max-width: 900px; margin: 0 auto; padding: 3.5rem 2rem; border-bottom: 1px solid #f0f0f0; }
        section:last-of-type { border-bottom: none; }
        .container { max-width: 100%; }
        h1 { font-size: 2.25rem; font-weight: 300; margin-bottom: 2rem; line-height: 1.3; color: #222; }
        h2, .section-title { font-size: 1.5rem; font-weight: 400; margin-bottom: 1.75rem; color: #222; }
        h3 { font-size: 1rem; font-weight: 600; margin-top: 1.75rem; margin-bottom: 0.5rem; color: #333; }
        p { margin-bottom: 1rem; color: #555; }
        .subtitle, .inspired-by { font-size: 0.8125rem; opacity: 0.6; margin-bottom: 1rem; }
        .description { margin-bottom: 2rem; }
        .section-grid { display: block; }
        .section-content { margin-top: 1rem; }
        .edge-cards { display: block; margin-top: 2rem; }
        .edge-card { margin-bottom: 2rem; }
        .highlight { background: #333; color: #fff; padding: 0.2em 0.4em; }
        footer { text-align: center; padding: 2.5rem 2rem; font-size: 0.75rem; opacity: 0.5; border-top: 1px solid #e0e0e0; background: #f8f8f8; }
        .contact-form { max-width: 550px; margin: 0 auto; }
        .form-group { margin-bottom: 1.5rem; }
        label { display: block; margin-bottom: 0.4rem; font-size: 0.8125rem; color: #666; font-weight: 500; }
        input, select, textarea { width: 100%; padding: 0.75rem; border: 1px solid #ddd; background: #fff; color: #333; font-family: inherit; font-size: 0.875rem; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #999; }
        textarea { min-height: 110px; }
        .submit-btn { background: #333; color: #fff; border: none; padding: 0.875rem 2rem; cursor: pointer; font-family: inherit; font-size: 0.875rem; }
        .submit-btn:hover { background: #222; }
        .text-center { text-align: center; }
    `,
    '11': `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Courier', monospace; background: #fffef7; color: #2b2b2b; line-height: 1.7; font-size: 14px; padding-top: 75px; }
        header { position: fixed; top: 0; left: 0; right: 0; background: #fffef7; border-bottom: 3px double #2b2b2b; padding: 1.5rem 2.5rem; z-index: 1000; }
        nav { display: flex; justify-content: space-between; align-items: center; max-width: 950px; margin: 0 auto; }
        .brand-logo { font-size: 0.95rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; }
        .accent-m { background: #2b2b2b; color: #fffef7; padding: 0.15em 0.4em; }
        .nav-links { display: flex; gap: 1.75rem; list-style: none; }
        .nav-links a { color: #2b2b2b; text-decoration: none; font-size: 0.8rem; border-bottom: 1px dotted #2b2b2b; }
        .menu-toggle { display: none; }
        section, .hero { max-width: 750px; margin: 0 auto; padding: 3rem 2.5rem; border: 2px solid #2b2b2b; background: #fff; margin-bottom: 2rem; }
        .container { max-width: 100%; }
        h1 { font-size: 1.85rem; font-weight: 700; margin-bottom: 1.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
        h2, .section-title { font-size: 1.35rem; font-weight: 700; margin-bottom: 1.5rem; text-transform: uppercase; }
        h3 { font-size: 0.95rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.5rem; text-decoration: underline; }
        p { margin-bottom: 1rem; }
        .subtitle, .inspired-by { opacity: 0.7; margin-bottom: 1rem; font-style: italic; }
        .description { margin-bottom: 2rem; }
        .section-grid { display: block; }
        .section-content { margin-top: 1rem; }
        .edge-cards { display: block; margin-top: 2rem; }
        .edge-card { margin-bottom: 2rem; border-left: 4px solid #2b2b2b; padding-left: 1rem; }
        .highlight { background: #2b2b2b; color: #fffef7; padding: 0.2em 0.4em; }
        footer { text-align: center; padding: 2rem; font-size: 0.75rem; opacity: 0.6; }
        .contact-form { max-width: 500px; margin: 0 auto; }
        .form-group { margin-bottom: 1.5rem; }
        label { display: block; margin-bottom: 0.5rem; font-size: 0.85rem; font-weight: 700; }
        input, select, textarea { width: 100%; padding: 0.7rem; border: 2px solid #2b2b2b; background: #fff; color: #2b2b2b; font-family: inherit; font-size: 0.85rem; }
        textarea { min-height: 100px; }
        .submit-btn { background: #2b2b2b; color: #fffef7; border: 2px solid #2b2b2b; padding: 0.8rem 1.75rem; cursor: pointer; font-family: inherit; font-weight: 700; text-transform: uppercase; }
        .text-center { text-align: center; }
    `,
    '12': `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Palatino', 'Book Antiqua', serif; background: #1a1a1a; color: #d4af37; line-height: 1.8; font-size: 17px; padding-top: 90px; }
        header { position: fixed; top: 0; left: 0; right: 0; background: #1a1a1a; border-bottom: 2px solid #d4af37; padding: 2rem 3rem; z-index: 1000; }
        nav { display: flex; justify-content: space-between; align-items: center; max-width: 1000px; margin: 0 auto; }
        .brand-logo { font-size: 1.125rem; font-weight: 400; letter-spacing: 0.25em; color: #d4af37; }
        .accent-m { background: #d4af37; color: #1a1a1a; padding: 0.1em 0.3em; }
        .nav-links { display: flex; gap: 2.5rem; list-style: none; }
        .nav-links a { color: #d4af37; text-decoration: none; font-size: 0.875rem; opacity: 0.85; }
        .nav-links a:hover { opacity: 1; }
        .menu-toggle { display: none; }
        section, .hero { max-width: 800px; margin: 0 auto; padding: 4rem 3rem; border-bottom: 1px solid rgba(212,175,55,0.3); }
        section:last-of-type { border-bottom: none; }
        .container { max-width: 100%; }
        h1 { font-size: 2.75rem; font-weight: 400; margin-bottom: 2.5rem; font-style: italic; color: #d4af37; }
        h2, .section-title { font-size: 2rem; font-weight: 400; margin-bottom: 2rem; font-style: italic; color: #d4af37; }
        h3 { font-size: 1.25rem; font-weight: 600; margin-top: 2.5rem; margin-bottom: 0.75rem; color: #d4af37; }
        p { margin-bottom: 1.25rem; color: rgba(212,175,55,0.9); }
        .subtitle, .inspired-by { opacity: 0.6; margin-bottom: 1rem; }
        .description { margin-bottom: 2rem; }
        .section-grid { display: block; }
        .section-content { margin-top: 1rem; }
        .edge-cards { display: block; margin-top: 2rem; }
        .edge-card { margin-bottom: 2rem; }
        .highlight { background: #d4af37; color: #1a1a1a; padding: 0.2em 0.4em; }
        footer { text-align: center; padding: 3rem; font-size: 0.75rem; opacity: 0.5; border-top: 1px solid rgba(212,175,55,0.3); }
        .contact-form { max-width: 550px; margin: 0 auto; }
        .form-group { margin-bottom: 1.75rem; }
        label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; color: #d4af37; }
        input, select, textarea { width: 100%; padding: 0.75rem; border: 1px solid #d4af37; background: transparent; color: #d4af37; font-family: inherit; font-size: 0.875rem; }
        textarea { min-height: 120px; }
        .submit-btn { background: #d4af37; color: #1a1a1a; border: none; padding: 1rem 2rem; cursor: pointer; font-family: inherit; font-weight: 600; }
        .text-center { text-align: center; }
    `,
    '13': `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Verdana', Geneva, sans-serif; background: #f0f0f0; color: #1a1a1a; line-height: 1.65; font-size: 15px; padding-top: 85px; }
        header { position: fixed; top: 0; left: 0; right: 0; background: #fff; border-bottom: 4px solid #ff6b6b; padding: 1.75rem 2.5rem; z-index: 1000; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        nav { display: flex; justify-content: space-between; align-items: center; max-width: 1100px; margin: 0 auto; }
        .brand-logo { font-size: 1rem; font-weight: 700; color: #1a1a1a; }
        .accent-m { background: #ff6b6b; color: #fff; padding: 0.15em 0.4em; }
        .nav-links { display: flex; gap: 2rem; list-style: none; }
        .nav-links a { color: #1a1a1a; text-decoration: none; font-size: 0.85rem; font-weight: 600; }
        .menu-toggle { display: none; }
        section, .hero { max-width: 850px; margin: 2rem auto; padding: 3.5rem 3rem; background: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .container { max-width: 100%; }
        h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 2rem; color: #ff6b6b; }
        h2, .section-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.75rem; color: #ff6b6b; }
        h3 { font-size: 1.125rem; font-weight: 700; margin-top: 2rem; margin-bottom: 0.5rem; }
        p { margin-bottom: 1.15rem; }
        .subtitle, .inspired-by { opacity: 0.65; margin-bottom: 1rem; }
        .description { margin-bottom: 2rem; }
        .section-grid { display: block; }
        .section-content { margin-top: 1rem; }
        .edge-cards { display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-top: 2rem; }
        .edge-card { padding: 1.5rem; background: #f9f9f9; border-left: 4px solid #ff6b6b; border-radius: 6px; }
        .highlight { background: #ff6b6b; color: #fff; padding: 0.2em 0.4em; border-radius: 3px; }
        footer { text-align: center; padding: 2.5rem; font-size: 0.75rem; opacity: 0.6; }
        .contact-form { max-width: 550px; margin: 0 auto; }
        .form-group { margin-bottom: 1.5rem; }
        label { display: block; margin-bottom: 0.5rem; font-size: 0.85rem; font-weight: 600; }
        input, select, textarea { width: 100%; padding: 0.85rem; border: 2px solid #e0e0e0; background: #fff; color: #1a1a1a; font-family: inherit; font-size: 0.875rem; border-radius: 6px; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #ff6b6b; }
        textarea { min-height: 110px; }
        .submit-btn { background: #ff6b6b; color: #fff; border: none; padding: 1rem 2.5rem; cursor: pointer; font-family: inherit; font-weight: 700; border-radius: 6px; }
        .text-center { text-align: center; }
    `,
    '14': `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Trebuchet MS', sans-serif; background: #0d1117; color: #c9d1d9; line-height: 1.7; font-size: 16px; padding-top: 75px; }
        header { position: fixed; top: 0; left: 0; right: 0; background: #161b22; border-bottom: 1px solid #30363d; padding: 1.5rem 2.5rem; z-index: 1000; }
        nav { display: flex; justify-content: space-between; align-items: center; max-width: 1050px; margin: 0 auto; }
        .brand-logo { font-size: 0.95rem; font-weight: 600; color: #58a6ff; font-family: monospace; }
        .accent-m { background: #58a6ff; color: #0d1117; padding: 0.1em 0.3em; }
        .nav-links { display: flex; gap: 2rem; list-style: none; }
        .nav-links a { color: #c9d1d9; text-decoration: none; font-size: 0.875rem; }
        .nav-links a:hover { color: #58a6ff; }
        .menu-toggle { display: none; }
        section, .hero { max-width: 900px; margin: 0 auto; padding: 3.5rem 2.5rem; border-bottom: 1px solid #21262d; }
        section:last-of-type { border-bottom: none; }
        .container { max-width: 100%; }
        h1 { font-size: 2.25rem; font-weight: 600; margin-bottom: 2rem; color: #58a6ff; }
        h2, .section-title { font-size: 1.65rem; font-weight: 600; margin-bottom: 1.75rem; color: #58a6ff; }
        h3 { font-size: 1.125rem; font-weight: 600; margin-top: 2rem; margin-bottom: 0.5rem; color: #8b949e; }
        p { margin-bottom: 1.15rem; }
        .subtitle, .inspired-by { opacity: 0.7; margin-bottom: 1rem; }
        .description { margin-bottom: 2rem; }
        .section-grid { display: block; }
        .section-content { margin-top: 1rem; }
        .edge-cards { display: block; margin-top: 2rem; }
        .edge-card { margin-bottom: 2rem; padding: 1.25rem; background: #161b22; border: 1px solid #30363d; border-radius: 6px; }
        .highlight { background: #58a6ff; color: #0d1117; padding: 0.2em 0.4em; border-radius: 3px; }
        footer { text-align: center; padding: 2.5rem; font-size: 0.75rem; opacity: 0.5; border-top: 1px solid #21262d; }
        .contact-form { max-width: 550px; margin: 0 auto; }
        .form-group { margin-bottom: 1.5rem; }
        label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; color: #8b949e; }
        input, select, textarea { width: 100%; padding: 0.75rem; border: 1px solid #30363d; background: #0d1117; color: #c9d1d9; font-family: inherit; font-size: 0.875rem; border-radius: 6px; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #58a6ff; }
        textarea { min-height: 110px; }
        .submit-btn { background: #238636; color: #fff; border: none; padding: 0.85rem 2rem; cursor: pointer; font-family: inherit; font-weight: 600; border-radius: 6px; }
        .text-center { text-align: center; }
    `,
    '15': `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Georgia', serif; background: #fff5e6; color: #3d2817; line-height: 1.9; font-size: 18px; padding-top: 95px; }
        header { position: fixed; top: 0; left: 0; right: 0; background: #fff5e6; border-bottom: 3px solid #8b6914; padding: 2rem 3.5rem; z-index: 1000; }
        nav { display: flex; justify-content: space-between; align-items: center; max-width: 1000px; margin: 0 auto; }
        .brand-logo { font-size: 1.25rem; font-weight: 400; color: #3d2817; font-style: italic; }
        .accent-m { background: #8b6914; color: #fff5e6; padding: 0.15em 0.35em; }
        .nav-links { display: flex; gap: 2.5rem; list-style: none; }
        .nav-links a { color: #3d2817; text-decoration: none; font-size: 0.9rem; border-bottom: 2px solid transparent; }
        .nav-links a:hover { border-bottom-color: #8b6914; }
        .menu-toggle { display: none; }
        section, .hero { max-width: 750px; margin: 0 auto; padding: 4rem 3rem; border-bottom: 1px solid #d4a574; }
        section:last-of-type { border-bottom: none; }
        .container { max-width: 100%; }
        h1 { font-size: 2.85rem; font-weight: 400; margin-bottom: 2.5rem; font-style: italic; color: #8b6914; line-height: 1.2; }
        h2, .section-title { font-size: 2.15rem; font-weight: 400; margin-bottom: 2rem; font-style: italic; color: #8b6914; }
        h3 { font-size: 1.25rem; font-weight: 600; margin-top: 2.5rem; margin-bottom: 0.75rem; }
        p { margin-bottom: 1.35rem; text-align: justify; }
        .subtitle, .inspired-by { opacity: 0.65; margin-bottom: 1.25rem; font-style: italic; }
        .description { margin-bottom: 2.5rem; }
        .section-grid { display: block; }
        .section-content { margin-top: 1.5rem; }
        .edge-cards { display: block; margin-top: 2.5rem; }
        .edge-card { margin-bottom: 2.5rem; }
        .highlight { background: #8b6914; color: #fff5e6; padding: 0.2em 0.4em; }
        footer { text-align: center; padding: 3rem; font-size: 0.8rem; opacity: 0.6; border-top: 2px solid #d4a574; }
        .contact-form { max-width: 600px; margin: 0 auto; }
        .form-group { margin-bottom: 1.75rem; }
        label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 600; }
        input, select, textarea { width: 100%; padding: 0.85rem; border: 2px solid #d4a574; background: #fff; color: #3d2817; font-family: inherit; font-size: 0.9rem; }
        textarea { min-height: 120px; }
        .submit-btn { background: #8b6914; color: #fff5e6; border: none; padding: 1rem 2.5rem; cursor: pointer; font-family: inherit; font-weight: 600; }
        .text-center { text-align: center; }
    `,
    '16': `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Monaco', 'Lucida Console', monospace; background: #282a36; color: #f8f8f2; line-height: 1.6; font-size: 14px; padding-top: 70px; }
        header { position: fixed; top: 0; left: 0; right: 0; background: #44475a; border-bottom: 2px solid #6272a4; padding: 1.5rem 2rem; z-index: 1000; }
        nav { display: flex; justify-content: space-between; align-items: center; max-width: 1000px; margin: 0 auto; }
        .brand-logo { font-size: 0.95rem; font-weight: 700; color: #50fa7b; }
        .accent-m { background: #50fa7b; color: #282a36; padding: 0.1em 0.3em; }
        .nav-links { display: flex; gap: 1.75rem; list-style: none; }
        .nav-links a { color: #8be9fd; text-decoration: none; font-size: 0.85rem; }
        .nav-links a:hover { color: #50fa7b; }
        .menu-toggle { display: none; }
        section, .hero { max-width: 850px; margin: 0 auto; padding: 3.25rem 2.5rem; border-bottom: 1px solid #44475a; }
        section:last-of-type { border-bottom: none; }
        .container { max-width: 100%; }
        h1 { font-size: 2rem; font-weight: 700; margin-bottom: 1.75rem; color: #ff79c6; }
        h2, .section-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: #bd93f9; }
        h3 { font-size: 1rem; font-weight: 700; margin-top: 1.75rem; margin-bottom: 0.5rem; color: #ffb86c; }
        p { margin-bottom: 1rem; }
        .subtitle, .inspired-by { opacity: 0.7; margin-bottom: 1rem; color: #6272a4; }
        .description { margin-bottom: 2rem; }
        .section-grid { display: block; }
        .section-content { margin-top: 1rem; }
        .edge-cards { display: block; margin-top: 2rem; }
        .edge-card { margin-bottom: 2rem; background: #44475a; padding: 1.25rem; border-left: 3px solid #50fa7b; }
        .highlight { background: #50fa7b; color: #282a36; padding: 0.2em 0.4em; }
        footer { text-align: center; padding: 2.5rem; font-size: 0.75rem; opacity: 0.5; border-top: 1px solid #44475a; }
        .contact-form { max-width: 500px; margin: 0 auto; }
        .form-group { margin-bottom: 1.5rem; }
        label { display: block; margin-bottom: 0.5rem; font-size: 0.85rem; color: #8be9fd; }
        input, select, textarea { width: 100%; padding: 0.75rem; border: 1px solid #6272a4; background: #44475a; color: #f8f8f2; font-family: inherit; font-size: 0.85rem; }
        textarea { min-height: 100px; }
        .submit-btn { background: #50fa7b; color: #282a36; border: none; padding: 0.85rem 2rem; cursor: pointer; font-family: inherit; font-weight: 700; }
        .text-center { text-align: center; }
    `,
    '17': `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Optima', 'Candara', sans-serif; background: #e8f4f8; color: #1c3d5a; line-height: 1.75; font-size: 16px; padding-top: 80px; }
        header { position: fixed; top: 0; left: 0; right: 0; background: #fff; border-bottom: 3px solid #4a90e2; padding: 1.75rem 3rem; z-index: 1000; box-shadow: 0 2px 6px rgba(74,144,226,0.15); }
        nav { display: flex; justify-content: space-between; align-items: center; max-width: 1050px; margin: 0 auto; }
        .brand-logo { font-size: 1.05rem; font-weight: 600; color: #1c3d5a; letter-spacing: 0.08em; }
        .accent-m { background: #4a90e2; color: #fff; padding: 0.12em 0.35em; }
        .nav-links { display: flex; gap: 2.25rem; list-style: none; }
        .nav-links a { color: #1c3d5a; text-decoration: none; font-size: 0.875rem; font-weight: 500; }
        .nav-links a:hover { color: #4a90e2; }
        .menu-toggle { display: none; }
        section, .hero { max-width: 850px; margin: 0 auto; padding: 3.75rem 3rem; background: #fff; margin-bottom: 2.5rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
        .container { max-width: 100%; }
        h1 { font-size: 2.5rem; font-weight: 400; margin-bottom: 2.25rem; color: #4a90e2; }
        h2, .section-title { font-size: 1.85rem; font-weight: 500; margin-bottom: 2rem; color: #4a90e2; }
        h3 { font-size: 1.15rem; font-weight: 600; margin-top: 2rem; margin-bottom: 0.65rem; color: #2c5f8d; }
        p { margin-bottom: 1.2rem; }
        .subtitle, .inspired-by { opacity: 0.65; margin-bottom: 1.15rem; }
        .description { margin-bottom: 2.25rem; }
        .section-grid { display: block; }
        .section-content { margin-top: 1.25rem; }
        .edge-cards { display: block; margin-top: 2.25rem; }
        .edge-card { margin-bottom: 2.25rem; padding: 1.5rem; background: #f5fafc; border-left: 4px solid #4a90e2; }
        .highlight { background: #4a90e2; color: #fff; padding: 0.2em 0.4em; }
        footer { text-align: center; padding: 2.75rem; font-size: 0.75rem; opacity: 0.6; }
        .contact-form { max-width: 550px; margin: 0 auto; }
        .form-group { margin-bottom: 1.6rem; }
        label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 600; color: #2c5f8d; }
        input, select, textarea { width: 100%; padding: 0.8rem; border: 2px solid #b8d8ee; background: #fff; color: #1c3d5a; font-family: inherit; font-size: 0.875rem; border-radius: 5px; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #4a90e2; }
        textarea { min-height: 110px; }
        .submit-btn { background: #4a90e2; color: #fff; border: none; padding: 0.95rem 2.25rem; cursor: pointer; font-family: inherit; font-weight: 600; border-radius: 5px; }
        .text-center { text-align: center; }
    `,
    '18': `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Rockwell', 'Courier Bold', serif; background: #2c1810; color: #e8dcc8; line-height: 1.7; font-size: 16px; padding-top: 85px; }
        header { position: fixed; top: 0; left: 0; right: 0; background: #2c1810; border-bottom: 3px solid #c19a6b; padding: 1.75rem 2.75rem; z-index: 1000; }
        nav { display: flex; justify-content: space-between; align-items: center; max-width: 1000px; margin: 0 auto; }
        .brand-logo { font-size: 1.125rem; font-weight: 700; color: #c19a6b; letter-spacing: 0.12em; }
        .accent-m { background: #c19a6b; color: #2c1810; padding: 0.15em 0.35em; }
        .nav-links { display: flex; gap: 2.25rem; list-style: none; }
        .nav-links a { color: #e8dcc8; text-decoration: none; font-size: 0.875rem; }
        .nav-links a:hover { color: #c19a6b; }
        .menu-toggle { display: none; }
        section, .hero { max-width: 850px; margin: 0 auto; padding: 3.75rem 3rem; border: 2px solid #4a3222; background: rgba(74,50,34,0.3); margin-bottom: 2rem; }
        .container { max-width: 100%; }
        h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 2.25rem; color: #c19a6b; text-transform: uppercase; }
        h2, .section-title { font-size: 1.85rem; font-weight: 700; margin-bottom: 2rem; color: #c19a6b; text-transform: uppercase; }
        h3 { font-size: 1.125rem; font-weight: 700; margin-top: 2rem; margin-bottom: 0.65rem; }
        p { margin-bottom: 1.2rem; }
        .subtitle, .inspired-by { opacity: 0.7; margin-bottom: 1rem; }
        .description { margin-bottom: 2.25rem; }
        .section-grid { display: block; }
        .section-content { margin-top: 1.25rem; }
        .edge-cards { display: block; margin-top: 2.25rem; }
        .edge-card { margin-bottom: 2.25rem; border: 1px solid #4a3222; padding: 1.5rem; }
        .highlight { background: #c19a6b; color: #2c1810; padding: 0.2em 0.4em; }
        footer { text-align: center; padding: 2.75rem; font-size: 0.75rem; opacity: 0.5; border-top: 2px solid #4a3222; }
        .contact-form { max-width: 550px; margin: 0 auto; }
        .form-group { margin-bottom: 1.6rem; }
        label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700; color: #c19a6b; }
        input, select, textarea { width: 100%; padding: 0.8rem; border: 2px solid #4a3222; background: rgba(74,50,34,0.3); color: #e8dcc8; font-family: inherit; font-size: 0.875rem; }
        textarea { min-height: 110px; }
        .submit-btn { background: #c19a6b; color: #2c1810; border: none; padding: 0.95rem 2.25rem; cursor: pointer; font-family: inherit; font-weight: 700; text-transform: uppercase; }
        .text-center { text-align: center; }
    `,
    '19': `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Futura', 'Century Gothic', sans-serif; background: #fafbfc; color: #24292e; line-height: 1.65; font-size: 15px; padding-top: 75px; }
        header { position: fixed; top: 0; left: 0; right: 0; background: #fff; border-bottom: 1px solid #e1e4e8; padding: 1.5rem 2.5rem; z-index: 1000; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
        nav { display: flex; justify-content: space-between; align-items: center; max-width: 1100px; margin: 0 auto; }
        .brand-logo { font-size: 0.95rem; font-weight: 600; color: #24292e; letter-spacing: 0.1em; text-transform: uppercase; }
        .accent-m { background: #0366d6; color: #fff; padding: 0.1em 0.3em; }
        .nav-links { display: flex; gap: 2.25rem; list-style: none; }
        .nav-links a { color: #586069; text-decoration: none; font-size: 0.85rem; font-weight: 500; }
        .nav-links a:hover { color: #0366d6; }
        .menu-toggle { display: none; }
        section, .hero { max-width: 900px; margin: 0 auto; padding: 3.5rem 2.75rem; border-bottom: 1px solid #e1e4e8; }
        section:last-of-type { border-bottom: none; }
        .container { max-width: 100%; }
        h1 { font-size: 2.35rem; font-weight: 600; margin-bottom: 2rem; color: #24292e; letter-spacing: -0.02em; }
        h2, .section-title { font-size: 1.75rem; font-weight: 600; margin-bottom: 1.75rem; color: #24292e; }
        h3 { font-size: 1.125rem; font-weight: 600; margin-top: 2rem; margin-bottom: 0.6rem; color: #24292e; }
        p { margin-bottom: 1.15rem; color: #586069; }
        .subtitle, .inspired-by { opacity: 0.65; margin-bottom: 1.15rem; }
        .description { margin-bottom: 2rem; }
        .section-grid { display: block; }
        .section-content { margin-top: 1.15rem; }
        .edge-cards { display: block; margin-top: 2rem; }
        .edge-card { margin-bottom: 2rem; }
        .highlight { background: #0366d6; color: #fff; padding: 0.2em 0.4em; }
        footer { text-align: center; padding: 2.5rem; font-size: 0.75rem; opacity: 0.5; border-top: 1px solid #e1e4e8; }
        .contact-form { max-width: 550px; margin: 0 auto; }
        .form-group { margin-bottom: 1.5rem; }
        label { display: block; margin-bottom: 0.5rem; font-size: 0.85rem; font-weight: 600; color: #24292e; }
        input, select, textarea { width: 100%; padding: 0.75rem; border: 1px solid #d1d5da; background: #fff; color: #24292e; font-family: inherit; font-size: 0.875rem; border-radius: 5px; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #0366d6; box-shadow: 0 0 0 3px rgba(3,102,214,0.1); }
        textarea { min-height: 110px; }
        .submit-btn { background: #0366d6; color: #fff; border: none; padding: 0.85rem 2rem; cursor: pointer; font-family: inherit; font-weight: 600; border-radius: 5px; }
        .submit-btn:hover { background: #0256c7; }
        .text-center { text-align: center; }
    `,
    '20': `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Didot', 'Bodoni MT', serif; background: #fcfcfc; color: #2a2a2a; line-height: 1.85; font-size: 17px; padding-top: 100px; }
        header { position: fixed; top: 0; left: 0; right: 0; background: #fcfcfc; border-bottom: 1px solid #2a2a2a; padding: 2.25rem 4rem; z-index: 1000; }
        nav { display: flex; justify-content: space-between; align-items: baseline; max-width: 1000px; margin: 0 auto; }
        .brand-logo { font-size: 1.35rem; font-weight: 400; color: #2a2a2a; font-style: italic; }
        .accent-m { background: #2a2a2a; color: #fcfcfc; padding: 0.1em 0.3em; font-style: normal; }
        .nav-links { display: flex; gap: 2.75rem; list-style: none; }
        .nav-links a { color: #2a2a2a; text-decoration: none; font-size: 0.875rem; font-style: italic; }
        .menu-toggle { display: none; }
        section, .hero { max-width: 750px; margin: 0 auto; padding: 5rem 3.5rem; }
        .container { max-width: 100%; }
        h1 { font-size: 3.25rem; font-weight: 400; margin-bottom: 3rem; font-style: italic; line-height: 1.15; }
        h2, .section-title { font-size: 2.35rem; font-weight: 400; margin-bottom: 2.5rem; font-style: italic; }
        h3 { font-size: 1.35rem; font-weight: 400; margin-top: 3rem; margin-bottom: 0.85rem; font-style: italic; }
        p { margin-bottom: 1.45rem; text-align: justify; }
        .subtitle, .inspired-by { opacity: 0.6; margin-bottom: 1.35rem; font-style: italic; font-size: 0.9rem; }
        .description { margin-bottom: 3rem; }
        .section-grid { display: block; }
        .section-content { margin-top: 1.75rem; }
        .edge-cards { display: block; margin-top: 3rem; }
        .edge-card { margin-bottom: 3rem; }
        .highlight { background: #2a2a2a; color: #fcfcfc; padding: 0.2em 0.4em; }
        footer { text-align: center; padding: 3.5rem; font-size: 0.8rem; opacity: 0.5; border-top: 1px solid #ddd; }
        .contact-form { max-width: 600px; margin: 0 auto; }
        .form-group { margin-bottom: 2rem; }
        label { display: block; margin-bottom: 0.6rem; font-size: 0.9rem; font-style: italic; }
        input, select, textarea { width: 100%; padding: 0.85rem; border: 1px solid #ccc; background: #fff; color: #2a2a2a; font-family: inherit; font-size: 0.9rem; }
        textarea { min-height: 130px; }
        .submit-btn { background: #2a2a2a; color: #fcfcfc; border: none; padding: 1.1rem 2.75rem; cursor: pointer; font-family: inherit; font-style: italic; }
        .text-center { text-align: center; }
    `
};

// Generate all 20 designs
for (let i = 1; i <= 20; i++) {
    const num = i.toString().padStart(2, '0');
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mathematricks Fun(d) - Multi-Strategy Quantitative Hedge Fund</title>
    <style>
        ${styles[num]}
    </style>
</head>
<body>
${htmlBody}
</body>
</html>`;

    const filePath = path.join(__dirname, '../design-previews', `design-${num}.html`);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Created design-${num}.html`);
}

console.log('All 20 designs created successfully!');

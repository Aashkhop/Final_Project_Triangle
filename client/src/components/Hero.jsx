import React from 'react';
import './Hero.css';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="hero">
      <h1>Buy, Sell, or Build Projects — All in One Place</h1>
      <p>Discover top-quality student and freelance projects tailored to your needs.</p>
      <div className="cta-buttons">
        <Link to="/explore"><button className="cta explore">Explore Projects</button></Link>
        <Link to="/upload"><button className="cta post">Post a Project</button></Link>
        <Link to="/freelance"><button className="cta freelance">Freelancer Hub</button></Link>
      </div>
    </section>
  );
}

export default Hero;
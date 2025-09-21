import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="home-wrapper">
      <div className="home-content">
        <h1 className="home-title">
          <span>Bienvenue</span>
          <span>sur la plateforme</span>
        </h1>
        <p className="home-subtitle">Gérez vos publications facilement</p>
        <div className="home-buttons">
          <Link to="/posts" className="home-btn posts-btn">
            📄 Voir les publications
          </Link>
          <Link to="/posts/new" className="home-btn add-btn">
            ➕ Ajouter une publication
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

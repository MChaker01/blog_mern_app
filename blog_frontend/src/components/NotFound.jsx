import React from "react";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="notfound-wrapper">
      <div className="notfound-content">
        <h1 className="notfound-title">404</h1>
        <p className="notfound-subtitle">
          Oups, la page que vous cherchez n’existe pas.
        </p>
        <div className="notfound-actions">
          <Link to="/" className="notfound-button">
            🏠 Retour à l'accueil
          </Link>
          <Link to="/posts" className="notfound-button secondary">
            📄 Voir les publications
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PostsList({ refreshTrigger, onDataChanged }) {
  const [posts, setPosts] = useState([]); // Un tableau vide ([]) pour stocker la liste des publications.
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(""); // Une chaîne vide ("") pour stocker un message d'erreur si la récupération échoue.

  const navigate = useNavigate();

  const handleDelete = async (_id) => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${_id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Publication supprimée avec succès.");

        if (onDataChanged) {
          onDataChanged();
        }
      }

      if (!response.ok) {
        console.error(
          "Erreur lors de la suppression du publication : ",
          response.status
        );
        setError("Erreur lors de la suppression du publication");

        return;
      }
    } catch (error) {
      console.error("Erreur de connexion au serveur.", error);
      setError("Erreur de connexion au serveur ou problème inattendu.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:3000/posts");

        if (!response.ok) {
          console.error(
            "Erreur lors de la récupération des publications. Statut : ",
            response.status
          );
          setError(
            "Erreur est survenu lors de la récupération des publications"
          );

          return;
        }

        const postsData = await response.json();
        setPosts(postsData);
      } catch (error) {
        // 6. Gérer l'erreur réseau (setError)
        console.error("Erreur réseau est survenue : ", error);
        setError("Erreur de connexion au serveur ou problème inattendu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(); // Appel de la fonction asynchrone
  }, [refreshTrigger]); // <-- Tableau de dépendances : vide pour un seul déclenchement au montage

  return (
    <div className="posts-wrapper">
      <h2 className="posts-title">Liste des publications</h2>

      {isLoading && <p>Chargement des données ...</p>}

      {!isLoading && posts.length === 0 && (
        <p>Liste des Publication est vide.</p>
      )}

      {!isLoading && error && <p className="error-message">{error}</p>}

      <div className="posts-list">
        {!isLoading &&
          !error &&
          posts.length > 0 &&
          posts.map(({ _id, titre, contenu, auteur, date }) => (
            <div className="post-item" key={_id}>
              <div className="post-header">
                <div>
                  <h3 className="post-heading">{titre}</h3>
                  <div className="post-meta">
                    <span className="post-author">✍ {auteur}</span>
                    <span className="post-date">
                      🕒 {new Date(date).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <p className="post-body">{contenu}</p>

              <div className="post-actions">
                <button className="post-button">Lire la suite</button>
                <button
                  className="edit-button"
                  title="Modifier"
                  onClick={() => navigate(`/posts/${_id}/edit`)}
                >
                  ✏️
                </button>
                <button
                  className="delete-icon"
                  title="Supprimer"
                  onClick={() => handleDelete(_id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default PostsList;

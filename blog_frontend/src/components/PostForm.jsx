import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function PostForm({ formType, onFormCompletion }) {
  // gestion des états des champs de formulaire.
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [auteur, setAuteur] = useState("");
  const [statusPost, setStatusPost] = useState("");

  const navigate = useNavigate();

  const { id } = useParams(); // 'id' sera défini si nous sommes sur la route /posts/:id/edit, sinon undefined

  const handleSubmit = async (e) => {
    e.preventDefault(); // pour empêcher le rechargement de la page.

    const postData = {
      titre,
      contenu,
      auteur,
    };

    let url = "";
    let method = "";
    let succesMessage = "";
    let errorMessage = "";

    if (formType === "edit") {
      url = `http://localhost:3000/posts/${id}`;
      method = "PUT";
      succesMessage = "Modifications engregistrées avec succès.";
      errorMessage = "Erreur lors de l'enregistrement des modifications";
    } else if (formType === "create") {
      url = "http://localhost:3000/add_blog";
      method = "POST";
      succesMessage = "Publication ajoutée avec succès.";
      errorMessage = "Erreur lors de l'ajout du publication.";
    }

    if (id === undefined) {
      try {
        const response = await fetch(url, {
          method: method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        });

        if (response.ok) {
          const Data = await response.text();

          console.log("Message de succès du serveur :", Data);

          setStatusPost(succesMessage);

          // réinisialiser les champs du formulaire après l'envoi.
          setTitre("");
          setContenu("");
          setAuteur("");

          // Redirection et refresh seulement après un petit délai pour voir le message
          setTimeout(() => {
            onFormCompletion();
          }, 1500);
        } else {
          const errorDetails = await response.text();

          console.error(
            "Erreur du serveur (code : ",
            response.status,
            ") : ",
            errorDetails
          );

          setStatusPost(errorMessage);
        }
      } catch (error) {
        console.error("Erreur lors de la soumission du formulaire", error);
        setStatusPost("Erreur de connexion au serveur ou problème inattendu.");
      }
    } else if (id !== undefined) {
      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });

        if (!response.ok) {
          const errorDetails = await response.text();

          console.error(
            "Erreur lors de l'enregistrement des modifications.",
            errorDetails
          );
          setStatusPost(errorMessage);

          return;
        }

        if (response.ok) {
          const data = await response.text();

          console.log(succesMessage, data);
          setStatusPost(succesMessage);

          setAuteur("");
          setContenu("");
          setTitre("");

          setTimeout(() => {
            onFormCompletion();
          }, 1500);
        }
      } catch (error) {
        console.error(
          "Erreur réseau survenu lors de l'enregistrement des modifications",
          error
        );
        setStatusPost(errorMessage);
      }
    }
  };

  useEffect(() => {
    if (id !== undefined) {
      const loadPostData = async () => {
        try {
          const response = await fetch(`http://localhost:3000/getPost/${id}`);

          if (response.ok) {
            const postToEdit = await response.json();

            setTitre(postToEdit.titre);
            setContenu(postToEdit.contenu);
            setAuteur(postToEdit.auteur);
            setStatusPost("");
          }

          if (!response.ok) {
            console.error(
              "Erreur lors de la récupération des données pour les modifiér.",
              response.status
            );

            setStatusPost(
              "Erreur : impossible de charger la publication pour édition."
            );

            return;
          }
        } catch (error) {
          console.error(
            "Erreur lors de laErreur lors du chargement de la publication pour édition :",
            error
          );
          setStatusPost(
            "Erreur de connexion au serveur ou problème inattendu."
          );
          onFormCompletion();
        }
      };

      loadPostData();
    } else if (id === undefined) {
      setAuteur("");
      setContenu("");
      setTitre("");
    }
  }, [id, onFormCompletion]);

  return (
    <div className="postform-wrapper">
      {/* Left panel */}
      <div className="postform-left">
        <h1 className="brand-title">📰 Blog Studio</h1>
        <p className="brand-subtitle">
          Partage tes idées, Chaque mot compte. ✨
        </p>
      </div>

      {/* Right panel (form) */}
      <div className="postform-right">
        <h2 className="form-title">
          {formType === "edit"
            ? "Modifier la publication"
            : "Créer une nouvelle publication"}
        </h2>
        <form className="creative-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              id="titre"
              name="titre"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              required
            />
            <label htmlFor="titre">Titre</label>
          </div>

          <div className="form-group">
            <textarea
              id="contenu"
              name="contenu"
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              rows="5"
              required
            ></textarea>
            <label htmlFor="contenu">Contenu</label>
          </div>

          <div className="form-group">
            <input
              type="text"
              id="auteur"
              name="auteur"
              value={auteur}
              onChange={(e) => setAuteur(e.target.value)}
              required
            />
            <label htmlFor="auteur">Auteur</label>
          </div>

          {formType === "edit" ? (
            <div className="form-buttons">
              <button type="submit" className="creative-button">
                💾 Enregistrer
              </button>
              <button
                type="button"
                className="creative-button"
                onClick={onFormCompletion}
              >
                ❌ Annuler
              </button>
            </div>
          ) : (
            <button type="submit" className="creative-button">
              🚀 Publier
            </button>
          )}

          {statusPost && (
            <p
              style={{
                marginTop: "1rem",
                textAlign: "center",
                color: statusPost.startsWith("Erreur") ? "red" : "green",
              }}
            >
              {statusPost}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default PostForm;

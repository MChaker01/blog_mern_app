import PostForm from "./components/PostForm";
import PostsList from "./components/PostsList";
import HomePage from "./components/HomePage";
import NotFound from "./components/NotFound";
import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const [dataChanged, setDataChanged] = useState(false);

  const handleDataChanged = () => {
    setDataChanged((prev) => !prev);
  };

  const navigate = useNavigate();

  const handleFormCompletion = () => {
    handleDataChanged(); // pour rafraîchir la liste PostsList.
    navigate("/posts"); // naviger vers La list des posts.
  };

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/posts"
          element={
            <PostsList
              refreshTrigger={dataChanged}
              onDataChanged={handleDataChanged}
            />
          }
        />

        <Route
          path="/posts/new"
          element={
            <PostForm
              formType="create" // Indique au PostForm qu'il est en mode création
              onFormCompletion={handleFormCompletion} // Gère la réussite/annulation du formulaire
            />
          }
        />

        <Route
          path="/posts/:id/edit"
          element={
            <PostForm
              formType="edit" // Indique au PostForm qu'il est en mode édition
              onFormCompletion={handleFormCompletion} // Gère la réussite/annulation du formulaire
            />
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

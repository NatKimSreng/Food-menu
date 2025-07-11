import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Favorites from './pages/Favorites';

function App() {
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (recipeId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(recipeId)
        ? prevFavorites.filter((id) => id !== recipeId)
        : [...prevFavorites, recipeId]
    );
  };

  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mt-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/recipes"
            element={<Recipes favorites={favorites} toggleFavorite={toggleFavorite} />}
          />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route
            path="/favorites"
            element={<Favorites favorites={favorites} toggleFavorite={toggleFavorite} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
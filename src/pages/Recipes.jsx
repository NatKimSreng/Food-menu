import React, { useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import recipes from '../data/recipes.json';

function Recipes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]); // State for favorite recipe IDs

  // Function to toggle a recipe as favorite
  const toggleFavorite = (recipeId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(recipeId)
        ? prevFavorites.filter((id) => id !== recipeId) // Remove from favorites
        : [...prevFavorites, recipeId] // Add to favorites
    );
  };

  // Filter recipes based on search term
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.ingredients.some((ingredient) =>
      ingredient.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Recipes List</h1>
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by recipe name or ingredient..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="row">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={favorites.includes(recipe.id)}
              toggleFavorite={toggleFavorite}
            />
          ))
        ) : (
          <div className="col-12 text-center">
            <p>No recipes found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Recipes;
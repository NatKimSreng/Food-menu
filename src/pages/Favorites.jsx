import React, { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';

function Favorites({ favorites, toggleFavorite }) {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      try {
        setLoading(true);
        const fetchedRecipes = [];
        for (const id of favorites) {
          const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
          );
          const data = await response.json();
          if (data.meals && data.meals[0]) {
            const meal = data.meals[0];
            fetchedRecipes.push({
              id: parseInt(meal.idMeal),
              title: meal.strMeal,
              description: meal.strCategory || 'No description available',
              image: meal.strMealThumb,
              ingredients: Object.keys(meal)
                .filter((key) => key.startsWith('strIngredient') && meal[key])
                .map((key) => meal[key]),
              instructions: meal.strInstructions,
            });
          }
        }
        setFavoriteRecipes(fetchedRecipes);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch favorite recipes');
        setLoading(false);
      }
    };
    fetchFavoriteRecipes();
  }, [favorites]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading favorite recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Favorite Recipes</h1>
      <p className="text-center mb-3">
        You have {favorites.length} favorite recipe{favorites.length !== 1 ? 's' : ''}
      </p>
      <div className="row">
        {favoriteRecipes.length > 0 ? (
          favoriteRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={favorites.includes(recipe.id)}
              toggleFavorite={toggleFavorite}
            />
          ))
        ) : (
          <div className="col-12 text-center">
            <p>No favorite recipes yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;
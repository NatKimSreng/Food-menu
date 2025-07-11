import React, { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';

function Recipes({ favorites, toggleFavorite }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const url =
          selectedCategory === 'All'
            ? 'https://www.themealdb.com/api/json/v1/1/search.php?s='
            : `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.meals) {
          const formattedRecipes = await Promise.all(
            data.meals.map(async (meal) => {
              const detailResponse = await fetch(
                `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
              );
              const detailData = await detailResponse.json();
              const fullMeal = detailData.meals[0];
              return {
                id: parseInt(fullMeal.idMeal),
                title: fullMeal.strMeal,
                description: fullMeal.strCategory || 'No description available',
                image: fullMeal.strMealThumb,
                ingredients: Object.keys(fullMeal)
                  .filter((key) => key.startsWith('strIngredient') && fullMeal[key])
                  .map((key) => fullMeal[key]),
                instructions: fullMeal.strInstructions,
              };
            })
          );
          setRecipes(formattedRecipes);
        } else {
          setRecipes([]);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch recipes');
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [selectedCategory]);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.ingredients.some((ingredient) =>
      ingredient.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading recipes...</p>
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
      <h1 className="text-center mb-4">Recipes List</h1>
      <p className="text-center mb-3">
        You have {favorites.length} favorite recipe{favorites.length !== 1 ? 's' : ''}
      </p>
      <div className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search by recipe name or ingredient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="mt-3">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category.idCategory} value={category.strCategory}>
                {category.strCategory}
              </option>
            ))}
          </select>
        </div>
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
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const data = await response.json();
        if (data.meals && data.meals[0]) {
          const meal = data.meals[0];
          setRecipe({
            id: parseInt(meal.idMeal),
            title: meal.strMeal,
            description: meal.strCategory || 'No description available',
            image: meal.strMealThumb,
            ingredients: Object.keys(meal)
              .filter((key) => key.startsWith('strIngredient') && meal[key])
              .map((key) => meal[key]),
            instructions: meal.strInstructions,
          });
        } else {
          setRecipe(null);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch recipe');
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading recipe...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="container mt-5 text-center">
        <h1>Recipe Not Found</h1>
        <p>{error || 'Sorry, we couldn’t find that recipe.'}</p>
        <Link to="/recipes" className="btn btn-secondary">Back to Recipes</Link>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">{recipe.title}</h1>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <img src={recipe.image} className="card-img-top" alt={recipe.title} />
            <div className="card-body">
              <h5 className="card-title">Description</h5>
              <p className="card-text">{recipe.description}</p>
              <h5 className="card-title">Ingredients ({recipe.ingredients.length})</h5>
              <ul className="list-group list-group-flush mb-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="list-group-item">{ingredient}</li>
                ))}
              </ul>
              <h5 className="card-title">Instructions</h5>
              <p className="card-text">{recipe.instructions}</p>
              <Link to="/recipes" className="btn btn-secondary">Back to Recipes</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
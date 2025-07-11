import React from 'react';
import { Link } from 'react-router-dom';

function RecipeCard({ recipe, isFavorite, toggleFavorite }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100">
        <img src={recipe.image} className="card-img-top card-food" alt={recipe.title} />
        <div className="card-body">
          <h5 className="card-title">{recipe.title}</h5>
          <p className="card-text">{recipe.description}</p>
          <p className="card-text">Ingredients: {recipe.ingredients.length}</p>
          <div className="d-flex justify-content-between">
            <Link to={`/recipes/${recipe.id}`} className="btn btn-primary">
              View Recipe
            </Link>
            <button
              className={`btn ${isFavorite ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => toggleFavorite(recipe.id)}
            >
              {isFavorite ? '♥' : '♡'} Favorite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
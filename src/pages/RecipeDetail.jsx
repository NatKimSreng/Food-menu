import React from 'react';
import { useParams } from 'react-router-dom';
import recipes from '../data/recipes.json';
function RecipeDetail() {
  const { id } = useParams(); // Get the recipe ID from the URL
  const recipe = recipes.find((r) => r.id === parseInt(id));  
  if (!recipe) {
    return (
      <div className="container mt-5">
        <h1 className="text-center">Recipe Not Found</h1>
        <p className="text-center">Sorry, we couldn't find that recipe.</p>
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
              <h5 className="card-title">Ingredients</h5>
              <ul className="list-group list-group-flush mb-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="list-group-item">{ingredient}</li>
                ))}
              </ul>
              <h5 className="card-title">Instructions</h5>
              <p className="card-text">{recipe.instructions}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
import React, { useEffect, useState } from "react";

function Top() {
  const [topRecipes, setTopRecipes] = useState([]);

  useEffect(() => {
    const fetchTopRecipes = async () => {
      try {
        const response = await fetch('http://localhost:3000/recipes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }

        const data = await response.json();
        const sortedRecipes = data.recipes.sort((a, b) => b.rating - a.rating);
        setTopRecipes(sortedRecipes.slice(0, 3));
      } catch (error) {
        console.error('Error fetching recipes:', error.message);
      }
    };

    fetchTopRecipes();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating); 
    const hasHalfStar = rating % 1 !== 0; 

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            // Full star
            stars.push(
                <span key={i} className="star filled">
                    ⭐
                </span>
            );
        } else if (hasHalfStar && i === fullStars) {
            // Half star
            stars.push(
                <span key={i} className="star half-filled">
                    ⭐
                </span>
            );
        } else {
            // Empty star
            stars.push(
                <span key={i} className="star">
                    ☆
                </span>
            );
        }
    }
    return stars;
};


return (
  <section className="top-rated">
    <h1>Top Rated Recipes</h1>
    <div className="recipes-grid">
      {topRecipes.map((recipe) => (
        <div key={recipe._id} className="recipe-card">
          <div className="image-container">
            {recipe.image && <img src={`http://localhost:3000/${recipe.image}`} alt={recipe.title} />}
          </div>
          <div className="info-container-top">
            <h3>{recipe.title}</h3>
            <div className="view-rating">{renderStars(recipe.rating)}</div>
            <p className="author">Author: {recipe.author}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
  );
}

export default Top;
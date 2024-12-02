import React, { useEffect, useState } from 'react';

function View() {
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const testId = "674d8b6a07fb9d99fcb514e2";
                const response = await fetch(`http://localhost:3000/recipes/${testId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch recipe');
                }

                const data = await response.json();
                console.log('Fetched recipe:', data);
                setRecipe(data.recipe); 
            } catch (error) {
                console.error('Error fetching recipe:', error.message);
            }
        };

        fetchRecipe();
    }, []);

    if (!recipe) {
        return <div>Loading...</div>;
    }

    const extractImagePath = (absolutePath) => {
        const filename = absolutePath.split('\\').pop(); 
        return `http://localhost:3000/uploads/${filename}`;
      };
    
    return (
        <section className="hero">
            <div className="info-container">
                <h1 className="label-container">{recipe.title}</h1> 
                
                <div className="info-group">
                    <p><strong>Description:</strong> {recipe.description}</p> 
                    <p><strong>Rating:</strong> {recipe.rating}</p> 
                    {recipe.image && (
                        <div className="image-container">
                            <img src={extractImagePath(recipe.image)} alt={recipe.title} />
                        </div>
                    )}
                    <p><strong>Author:</strong> {recipe.author}</p> 
                </div>
            </div>
        </section>
    );
}

export default View;

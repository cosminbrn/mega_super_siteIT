import React, { useEffect, useState } from 'react';
import './View.css'; 

function View() {
    const [recipes, setRecipes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [filterStars, setFilterStars] = useState(null); 
    const [review, setReview] = useState({ recipeId: null, rating: 0 }); 

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch(`http://localhost:3000/recipes`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch recipes');
                }

                const data = await response.json();
                setRecipes(data.recipes); 
            } catch (error) {
                console.error('Error fetching recipes:', error.message);
            }
        };

        fetchRecipes();
    }, []);

    const extractImagePath = (absolutePath) => {
        const filename = absolutePath.split('/').pop(); 
        return `http://localhost:3000/uploads/${filename}`;
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSort = (order) => {
        const sortedRecipes = [...recipes].sort((a, b) => order === 'asc' ? a.rating - b.rating : b.rating - a.rating);
        setRecipes(sortedRecipes);
        setSortOrder(order);
        setActiveDropdown(null);
    };

    const handleFilter = (stars) => {
        setFilterStars(stars);
        setActiveDropdown(null);
    };

    const handleStarClick = async (recipeId, rating) => {
        setReview({ recipeId, rating }); 
    };

    const handleSubmitReview = async () => {
        try {
            const { recipeId, rating } = review;
            const reviewer = "Anonymous"; 

            const response = await fetch(`http://localhost:3000/recipe/${recipeId}/review`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reviewer, rating }) 
            });

            if (!response.ok) {
                throw new Error('Failed to submit review');
            }

            const updatedRecipe = await response.json();

            setRecipes(prevRecipes =>
                prevRecipes.map(recipe =>
                    recipe._id === recipeId ? updatedRecipe.recipe : recipe 
                )
            );

            setReview({ recipeId: null, rating: 0 });
        } catch (error) {
            console.error('Error submitting review:', error.message);
        }
    };
    
    const filteredRecipes = recipes
        .filter(recipe => recipe.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(recipe => filterStars === null || recipe.rating === filterStars);

    const renderStars = (recipeId, rating) => {
        const stars = [];
        const fullStars = Math.floor(rating); 
        const hasHalfStar = rating % 1 !== 0; 
    
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                
                stars.push(
                    <span 
                        key={i} 
                        className="star filled" 
                        onClick={() => handleStarClick(recipeId, i + 1)}
                    >
                        ⭐
                    </span>
                );
            } else if (hasHalfStar && i === fullStars) {
                
                stars.push(
                    <span 
                        key={i} 
                        className="star half-filled" 
                        onClick={() => handleStarClick(recipeId, i + 1)}
                    >
                        ⭐
                    </span>
                );
            } else {
                
                stars.push(
                    <span 
                        key={i} 
                        className="star" 
                        onClick={() => handleStarClick(recipeId, i + 1)}
                    >
                        ☆
                    </span>
                );
            }
        }
        return stars;
    };

    return (
        <section className="recipes-page-container">
            <section className="view-section-container">
                <img></img>
                <div className="view-top-bar">
                    <input 
                        name="view-search"
                        type="text" 
                        placeholder="Search" 
                        className="view-search-bar" 
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <section className="view-button-container">
                        <div className="view-filter-dropdown">
                            <button 
                                className="view-filter-button" 
                                onClick={() => setActiveDropdown(activeDropdown === 'filter' ? null : 'filter')}
                            >
                                Filter by Stars
                            </button>
                            {activeDropdown === 'filter' && (
                                <div className="view-filter-options">
                                    {[0, 1, 2, 3, 4, 5].map(stars => (
                                        <button 
                                            key={stars} 
                                            className="view-filter-option" 
                                            onClick={() => handleFilter(stars)}
                                        >
                                            {stars} Stars
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="view-sort-dropdown">
                            <button     
                                className="view-sort-button" 
                                onClick={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')}
                            >
                                Sort by Rating
                            </button>
                            {activeDropdown === 'sort' && (
                                <div className="view-sort-options">
                                    <button className="view-sort-option" onClick={() => handleSort('asc')}>1 to 5 Stars</button>
                                    <button className="view-sort-option" onClick={() => handleSort('desc')}>5 to 1 Stars</button>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                <div className="view-grid-container">
                    {filteredRecipes.map((recipe) => (
                        <div key={recipe._id} className="view-info-container">
                            <div className="view-recipe-header-container">
                                {recipe.image && (
                                    <div className="view-image-container">
                                        <img src={extractImagePath(recipe.image)} alt={recipe.title} />
                                    </div>
                                )}
                            </div>
                            <div className="view-info-group">
                                <h1 className="view-label-container">{recipe.title}</h1>
                                <div className="view-rating">{renderStars(recipe._id, recipe.rating)}</div>
                                <p className="view-review-count">
                                    {recipe.reviewCount === 0 ? <strong>No reviews yet.</strong> : `${recipe.reviewCount} review${recipe.reviewCount > 1 ? 's' : ''}`}
                                </p>
                                <p className="view-author">Author: <br></br> <strong className="view-author-name">{recipe.author}</strong></p> 

                                \
                                {review.recipeId === recipe._id ? (
                                    <div className="view-review-form">
                                        <h3>Submit your review:</h3>
                                        <div className="view-rating-input">
                                            {renderStars(recipe._id, review.rating)}
                                        </div>
                                        <button onClick={handleSubmitReview}>Submit Review</button>
                                    </div>
                                ) : (
                                    <button onClick={() => setReview({ recipeId: recipe._id, rating: 0 })}>
                                        Leave a Review
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </section>
    );
}

export default View;

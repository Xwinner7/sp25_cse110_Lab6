import React, { useState } from 'react';

function RecipeForm({ onAddRecipe, onClearRecipes }) {
  const initialFormData = {
    imgSrc: '',
    imgAlt: '',
    titleTxt: '',
    titleLnk: '',
    rating: '0', // Corresponds to radio button value
    numRatings: '0',
    organization: '',
    lengthTime: '',
    ingredients: '',
  };
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'radio' && name === 'rating') {
      setFormData(prev => ({ ...prev, rating: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 将表单数据转换为 RecipeCard 和初始数据期望的格式
    const newRecipe = {
      imgSrc: formData.imgSrc,
      imgAlt: formData.imgAlt,
      titleTxt: formData.titleTxt, // RecipeCard uses titleTxt or title
      titleLnk: formData.titleLnk, // RecipeCard uses titleLnk or href
      organization: formData.organization,
      lengthTime: formData.lengthTime, // RecipeCard uses lengthTime or time
      ingredients: formData.ingredients.split('\n').map(item => item.trim()).filter(item => item), // Split by newline for textarea
      // Rating is handled directly by value in RecipeCard for simplicity from form
      rating: formData.rating, // This will be the string value from radio "0"-"5"
      numRatings: formData.numRatings, // This will be used by RecipeCard
      // id will be added in App.js
    };
    onAddRecipe(newRecipe);
    setFormData(initialFormData); // Reset form
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Add New Recipe</h3>
      <fieldset>
        <legend>Image:</legend>
        <label htmlFor="imgSrc">Source: 
          <input type="text" id="imgSrc" name="imgSrc" value={formData.imgSrc} onChange={handleChange} required />
        </label>
        <label htmlFor="imgAlt">Alt Text: 
          <input type="text" id="imgAlt" name="imgAlt" value={formData.imgAlt} onChange={handleChange} required />
        </label>
      </fieldset>
      <fieldset>
        <legend>Title:</legend>
        <label htmlFor="titleTxt">Text: 
          <input type="text" id="titleTxt" name="titleTxt" value={formData.titleTxt} onChange={handleChange} required />
        </label>
        <label htmlFor="titleLnk">Link: 
          <input type="url" id="titleLnk" name="titleLnk" value={formData.titleLnk} onChange={handleChange} required />
        </label>
      </fieldset>
      <fieldset>
        <legend>Rating</legend>
        {[0, 1, 2, 3, 4, 5].map(rate => (
          <label htmlFor={`rating-${rate}`} key={rate}> {rate}
            <input type="radio" id={`rating-${rate}`} value={String(rate)} name="rating" 
                   checked={formData.rating === String(rate)} onChange={handleChange} /> 
          </label>
        ))}
        <label htmlFor="numRatings">Num Ratings: 
          <input type="number" id="numRatings" name="numRatings" value={formData.numRatings} onChange={handleChange} min="0" />
        </label>
      </fieldset>
      <fieldset>
        <legend>Other Info:</legend>
        <label htmlFor="organization">Organization: 
          <input type="text" id="organization" name="organization" value={formData.organization} onChange={handleChange} required />
        </label>
        <label htmlFor="lengthTime">Length (time): 
          <input type="text" id="lengthTime" name="lengthTime" value={formData.lengthTime} onChange={handleChange} required />
        </label>
        <label htmlFor="ingredients">
          <p style={{ margin: '0 0 4px 0' }}>Ingredients:</p>
          <textarea name="ingredients" id="ingredients" value={formData.ingredients} onChange={handleChange} cols="38" rows="5" required></textarea>
        </label>
      </fieldset>
      <button type="submit" style={{ marginRight: '10px', marginTop: '10px' }}>Add Recipe</button>
      <button 
        type="button" 
        onClick={onClearRecipes} 
        style={{ 
          marginTop: '10px', 
          fontSize: '0.8em',  // Smaller font
          padding: '4px 8px'   // Reduced padding
        }} 
        className="danger"
      >
        Clear Local Storage
      </button>
    </form>
  );
}

export default RecipeForm; 
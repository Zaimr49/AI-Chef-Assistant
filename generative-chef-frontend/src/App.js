import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import RecipeSteps from './RecipeSteps';

function App() {
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setIngredients(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const backend_url = ""
      const response = await axios.post(backend_url, { ingredients });
      setSteps(response.data);
      // setSteps(['season chops with salt and pepper', 'heat oil in large saute pan over medium-high heat']);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch recipes', error);
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Generative AI Chef</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="ingredientsInput" className="form-label">Ingredients</label>
          <input
            type="text"
            className="form-control"
            id="ingredientsInput"
            value={ingredients}
            onChange={handleInputChange}
            placeholder="Enter ingredients separated by commas"
          />
        </div>
        <button type="submit" className="btn btn-primary">Get Recipe</button>
      </form>

      {loading && <p>Loading...</p>}
      <RecipeSteps steps={steps} />
    </div>
  );
}

export default App;

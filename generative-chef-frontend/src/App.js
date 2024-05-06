import React, { useState } from 'react';
import axios from 'axios';
import { Container, Button, InputGroup, FormControl, ListGroup, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import RecipeSteps from './RecipeSteps';

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleIngredientChange = (event) => {
    setNewIngredient(event.target.value);
  };

  const addIngredient = () => {
    if (newIngredient) {
      setIngredients(prev => [...prev, newIngredient]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (index) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    // check if there are ingredients 
    if (ingredients.length === 0) {
      alert('Please enter at least one ingredient');
      return;
    }
    event.preventDefault();
    setLoading(true);
    try {
      const ingredientsString = ingredients.join(', ');
      const backend_url = "http://localhost:3000/generate"; 
      // setSteps(['jam','egg']);
      const response = await axios.post(backend_url, { ingredients: ingredientsString });
      console.log(response);
      // setSteps(response.data);
      setSteps(response.data);
      // setSteps(['season chops with salt and pepper', 'heat oil in large saute pan over medium-high heat']);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch recipes', error);
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 bg-dark text-white" style={{ paddingBottom: '20px', borderRadius: '15px' }}>
      <h1 className="text-center header-title">
  Generative AI Chef
</h1>
<p className="text-center">Enter ingredients one at a time and press "Get Recipe" to see how you can cook them into a delicious dish!</p>

      <InputGroup className="mb-3">
        <FormControl
          placeholder="Enter an ingredient"
          aria-label="Enter an ingredient"
          aria-describedby="basic-addon2"
          value={newIngredient}
          onChange={handleIngredientChange}
          className='bg-dark text-white mx-2'
        />
        <Button variant="primary" onClick={addIngredient}>
          Add Ingredient
        </Button>
      </InputGroup>
      <ListGroup>
        {ingredients.length > 0 && <h2>Ingredients</h2>}
        {ingredients.map((ingredient, index) => (
          <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center bg-dark text-white">
            {ingredient}
            <Button variant="danger" size="sm" onClick={() => removeIngredient(index)}>
              Remove
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <div className="text-center mt-4">
        <Button variant="success" onClick={handleSubmit} disabled={loading}>
          {loading ? <Spinner as="span" aanimation="border" variant="primary" size="sm" role="status" aria-hidden="true" /> : "Get Recipe"}
        </Button>
      </div>
      <RecipeSteps steps={steps} />
    </Container>
  );
}

export default App;

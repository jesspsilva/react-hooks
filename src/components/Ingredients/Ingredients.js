import React, { useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

function Ingredients() {

  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch('https://react-hooks-21-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => {
      setIsLoading(false);
      return res.json();
    }).then(data => {
      console.log(data);
      setIngredients(prevState => [
        ...prevState, 
        {id: data.name, ...ingredient}
      ]);
    });
  }

  const removeIngredientHandler = ingId => {
    setIsLoading(true);
    fetch(`https://react-hooks-21-default-rtdb.firebaseio.com/ingredients/${ingId}.jon`, {
      method: 'DELETE',
    }).then(res => {
      setIsLoading(false);
      setIngredients(prevState => prevState.filter(ingredient => ingredient.id !== ingId));
    }).catch(err => {
      setError('Something went wrong!');
      setIsLoading(false);
    })
  }

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setIngredients(filteredIngredients);
  }, []);

  const clearError = () => {
    setError(null);
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm onAddIngredientHandler={addIngredientHandler} loading={isLoading}/>
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;

import React, { useReducer, useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientReducer = (currentIngredients, action) => {
  switch(action.type){
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Something went wrong');
  }
}

function Ingredients() {
  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
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
      dispatch({
        type: 'ADD',
        ingredient: {id: data.name, ...ingredient}
      })
    });
  }

  const removeIngredientHandler = ingId => {
    setIsLoading(true);
    fetch(`https://react-hooks-21-default-rtdb.firebaseio.com/ingredients/${ingId}.json`, {
      method: 'DELETE',
    }).then(res => {
      setIsLoading(false);
      dispatch({
        type: 'DELETE',
        id: ingId,
      })
    }).catch(err => {
      setError('Something went wrong!');
      setIsLoading(false);
    })
  }

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({
      type: 'SET',
      ingredients: filteredIngredients
    })
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

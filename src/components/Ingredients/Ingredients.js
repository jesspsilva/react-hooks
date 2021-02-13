import React, { useReducer, useCallback } from 'react';

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

const httpReducer = (httpState, action) => {
  switch(action.type) {
    case 'SEND':
      return {loading: true, error: null};
    case 'RESPONSE':
      return {...httpState, loading: false};
    case 'ERROR':
      return {loading: false, error: action.errorMessage};
    case 'CLEAR':
      return {...httpState, error: null};
    default:
      throw new Error('Something went wrong');
  }
}

function Ingredients() {
  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null});

  const addIngredientHandler = ingredient => {
    dispatchHttp({type: 'SEND'});
    fetch('https://react-hooks-21-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => {
      dispatchHttp({type:'RESPONSE'});
      return res.json();
    }).then(data => {
      dispatch({
        type: 'ADD',
        ingredient: {id: data.name, ...ingredient}
      })
    });
  }

  const removeIngredientHandler = ingId => {
    dispatchHttp({type: 'SEND'});
    fetch(`https://react-hooks-21-default-rtdb.firebaseio.com/ingredients/${ingId}.json`, {
      method: 'DELETE',
    }).then(res => {
      dispatchHttp({type:'RESPONSE'});
      dispatch({
        type: 'DELETE',
        id: ingId,
      })
    }).catch(err => {
      dispatchHttp({type:'ERROR', errorMessage: 'Something went wrong!'});
    })
  }

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({
      type: 'SET',
      ingredients: filteredIngredients
    })
  }, []);

  const clearError = () => {
    dispatchHttp({type:'CLEAR'});
  }

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredientHandler={addIngredientHandler} loading={httpState.loading}/>
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;

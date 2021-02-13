import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

function Ingredients() {

  const [ingredients, setIngredients] = useState([]);

  const addIngredientHandler = ingredient => {
    fetch('https://react-hooks-21-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => {
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
    setIngredients(prevState => prevState.filter(ingredient => ingredient.id !== ingId))
  }

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setIngredients(filteredIngredients);
  }, []);

  return (
    <div className="App">
      <IngredientForm onAddIngredientHandler={addIngredientHandler}/>
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;

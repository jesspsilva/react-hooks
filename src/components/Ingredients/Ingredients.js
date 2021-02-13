import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

function Ingredients() {

  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    fetch('https://react-hooks-21-default-rtdb.firebaseio.com/ingredients.json')
    .then(res => res.json())
    .then(data => {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount:  data[key].amount
        })
      }
      setIngredients(loadedIngredients);
    })
  }, []);

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

  return (
    <div className="App">
      <IngredientForm onAddIngredientHandler={addIngredientHandler}/>

      <section>
        <Search />
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;

import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

function Ingredients() {

  const [ingredients, setIngredients] = useState([]);

  const addIngredientHandler = ingredient => {
    setIngredients(prevState => [
      ...prevState, 
      {id: Math.random().toString(), ...ingredient}
    ]);
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredientHandler={addIngredientHandler}/>

      <section>
        <Search />
        <IngredientList ingredients={ingredients} onRemoveItem={() => {}}/>
      </section>
    </div>
  );
}

export default Ingredients;

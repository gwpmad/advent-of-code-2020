const fs = require('fs');
const recipes = fs.readFileSync(__dirname + '/input', 'utf8');

function getAllergenicIngredients(input) {
  const recipeLines = getRecipeData(input);
  const allergenIngredientLookup = getAllergenIngredientLookup(recipeLines);
  return outputIngredientsByAllergen(allergenIngredientLookup);
}

function getRecipeData(input) {
  const lines = input.split('\n');
  return lines.reduce((recipeLines, line) => {
    const splitLine = line.split(' (contains ')
    const ingredients = new Set(splitLine[0].split(' '));
    const allergens = new Set(splitLine[1].match(/[a-z]+/g));
    return [...recipeLines, [ingredients, allergens]];
  }, []);
}

function getAllergenIngredientLookup(recipeLines) {
  const lookup = new Map();
  
  let finished = false;
  while (!finished) {
    const allergenIngredientCounts = countAllergensAndIngredients(recipeLines);

    Object.entries(allergenIngredientCounts)
      .forEach(([allergen, { count, ingredients }]) => {
        const possibleIngredients = Object.keys(ingredients).filter(ingredient => ingredients[ingredient] === count);
        lookup.set(allergen, new Set(possibleIngredients));
      });

    lookup.forEach((ingredients, allergen) => {
      if (ingredients.size !== 1) return;
      const knownIngredent = ingredients.values().next().value;
      lookup.forEach((ingredients2, allergen2) => {
        if (allergen2 !== allergen) ingredients2.delete(knownIngredent);
      });
    });

    recipeLines.forEach(([ingredients, allergens]) => {
      const possibleIngredientsForLine = new Set();
      allergens.forEach(allergen =>
        lookup.get(allergen).forEach(lookupIngredient => possibleIngredientsForLine.add(lookupIngredient))
      );
      ingredients.forEach(ingredient => {
        if (!possibleIngredientsForLine.has(ingredient)) ingredients.delete(ingredient);
      })
    });
    
    finished = [...lookup.values()].every(ingredients => ingredients.size === 1);
  }
  return lookup;
}

function countAllergensAndIngredients(recipeLines) {
  return recipeLines.reduce((acc, [ingredients, allergens]) => {
    allergens.forEach(allergen => {
      acc[allergen] = acc[allergen] || { count: 0, ingredients: {} };
      acc[allergen].count++;
      ingredients.forEach(ingredient => {
        acc[allergen].ingredients[ingredient] = (acc[allergen].ingredients[ingredient] || 0) + 1;
      });
    });
    return acc;
  }, {});
}

function outputIngredientsByAllergen(lookup) {
  return [...lookup.keys()]
    .sort((allergenA, allergenB) => {
      if (allergenA < allergenB) return -1;
      return allergenA > allergenB ? 1 : 0;
    })
    .map(allergen => lookup.get(allergen).values().next().value)
    .join(',');
}

console.log(getAllergenicIngredients(recipes));

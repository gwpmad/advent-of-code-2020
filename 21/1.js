const fs = require('fs');
const recipes = fs.readFileSync(__dirname + '/input', 'utf8');

function getNonAllergenIngredientOccurrences(input) {
  const { remainingIngredients, recipeLines, ingredientOccurrences } = getRecipeData(input);
  const nonAllergenIngredients = getNonAllergenIngredients(recipeLines, remainingIngredients);
  return nonAllergenIngredients.reduce((sum, ingredient) => sum + ingredientOccurrences[ingredient], 0);
}

function getRecipeData(input) {
  const lines = input.split('\n');
  const recipeLines = [], ingredientOccurrences = {};
  for (const line of lines) {
    const splitLine = line.split(' (contains ')
    const ingredients = splitLine[0].split(' ');
    const allergens = splitLine[1].match(/[a-z]+/g);
    recipeLines.push([ingredients, allergens]);

    ingredients.forEach(ingredient => {
      ingredientOccurrences[ingredient] = ingredientOccurrences[ingredient] || 0;
      ingredientOccurrences[ingredient]++;
    });
  }
  return {
    remainingIngredients: new Set(Object.keys(ingredientOccurrences)),
    recipeLines,
    ingredientOccurrences,
  }
}

function getNonAllergenIngredients(recipeLines, remainingIngredients) {
  for (const [ingredients, allergens] of recipeLines) {
    ingredients.forEach(ingredient => {
      if (!remainingIngredients.has(ingredient)) return;
      allergens.forEach(allergen => {
        const couldBePair = recipeLines.reduce((decision, [lineIngredients, lineAllergens]) => {
          if (decision === false) return decision;
          if (!lineAllergens.includes(allergen)) return true;
          return lineIngredients.includes(ingredient);
        }, true);
        if (couldBePair) remainingIngredients.delete(ingredient);
      });
    });
  }
  return Array.from(remainingIngredients);
}

console.log(getNonAllergenIngredientOccurrences(recipes));

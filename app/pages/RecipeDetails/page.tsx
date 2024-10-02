import React from 'react';
import { Heart } from 'lucide-react';

const RecipeDetailsPage = () => {
  const recipe = {
    title: "Mashed Potatoes",
    ingredients: [
      "5 pounds potatoes",
      "2 large cloves garlic, minced",
      "1 teaspoon salt",
      "6 tablespoons butter",
      "1 cup whole milk",
      "4 ounces cream cheese, room temperature",
      "1/2 cup sour cream",
      "Paprika, chopped fresh chives or green onions, freshly cracked black pepper"
    ],
    instructions: [
      "Cut the potatoes into 1-inch cubes. Put them in a large pot and cover with cold water. Add the garlic and 1 teaspoon of salt to the water. Bring the water to a boil over high heat, then lower the heat to medium and simmer until the potatoes are tender, about 15 to 20 minutes.",
      "While the potatoes are cooking, warm the milk and butter in a small saucepan over low heat until the butter is melted. Keep the mixture warm.",
      "When the potatoes are tender, drain them in a large colander. Return them to the pot and mash them with a potato masher or a hand mixer. Slowly add the warm milk mixture, stirring constantly, until the potatoes are smooth and creamy.",
      "Stir in the cream cheese and sour cream. Season with salt and pepper to taste.",
      "Transfer to a serving bowl. Top with a pat of butter if desired, and sprinkle with paprika and chopped fresh chives or green onions.",
      "Serve hot and enjoy!"
    ]
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div className="bg-light" style={{height: '300px', width: '100%'}}></div>
        </div>
        <div className="col-md-6">
          <h1 className="mb-3 d-flex justify-content-between align-items-center">
            {recipe.title}
            <Heart size={24} className="text-muted" />
          </h1>
          <h2 className="h4 mb-3">Ingredients:</h2>
          <ul className="list-unstyled">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="mb-2">• {ingredient}</li>
            ))}
          </ul>
          <h2 className="h4 mb-3 mt-4">Instructions:</h2>
          <ol>
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="mb-3">{instruction}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailsPage;
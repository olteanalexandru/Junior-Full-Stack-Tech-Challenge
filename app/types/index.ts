export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  nutritionInfo?: string;
  cookingTime?: string;
  servingSize?: string;
}
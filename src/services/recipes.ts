import {Recipe} from "../models/recipe";
import {Ingredient} from "../models/ingredient";

export class RecipesService {
  private recipes: Recipe[] = [];

  addRecipe(title: string,
            description: string,
            difficulity: string,
            ingredients: Ingredient[]) {
    this.recipes.push(new Recipe(title, description, difficulity, ingredients));
  }

  getRecipe() {
    return this.recipes.slice();
  }

  updateRecipe(index: number,
               title: string,
               description: string,
               difficulity: string,
               ingredients: Ingredient[]) {
    this.recipes[index] = new Recipe(title, description, difficulity, ingredients);
  }

  removeRecipe(index: number) {
    this.recipes.splice(index, 1);
  }
}

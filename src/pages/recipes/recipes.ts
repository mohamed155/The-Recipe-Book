import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {RecipePage} from "../recipe/recipe";

@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecipesPage');
  }

  onNewRecipe() {
    this.navCtrl.push(RecipePage, {mode: 'New'});
  }

}

import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {EditRecipePage} from "../edit-recipe/edit-recipe";
import {RecipesService} from "../../services/recipes";
import {Recipe} from "../../models/recipe";
import {RecipePage} from "../recipe/recipe";
import {DatabaseOptionsPage} from "../database-options/database-options";
import {AuthService} from "../../services/auth";

@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage {
  recipes: Recipe[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public recipesService: RecipesService, private loadingCtrl: LoadingController,
              private alertCtrl: AlertController, private popoverCtrl: PopoverController,
              private authService: AuthService) {
  }

  ionViewWillEnter() {
    this.recipes = this.recipesService.getRecipes();
  }

  onNewRecipe() {
    this.navCtrl.push(EditRecipePage, {mode: 'New'});
  }

  onLoadRecipe(recipe: Recipe, index: number) {
    this.navCtrl.push(RecipePage, {recipe: recipe, index: index});
  }

  onShowOptions(event: MouseEvent) {
    const loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    const popover = this.popoverCtrl.create(DatabaseOptionsPage);
    popover.present({ev: event});
    popover.onDidDismiss(
      data => {
        if (data) {
          if (data.action == 'load') {
            loader.present();
            this.authService.getActiveUser().getIdToken()
              .then(
                (token: string) => {
                  this.recipesService.fetchList(token)
                    .subscribe(
                      (list: Recipe[]) => {
                        if (list) {
                          this.recipes = list;
                        }
                        loader.dismiss();
                      },
                      error => {
                        loader.dismiss();
                        this.handleError(error.message);
                      }
                    );
                }
              );
          } else {
            loader.present();
            this.authService.getActiveUser().getIdToken()
              .then(
                (token: string) => {
                  this.recipesService.storeList(token)
                    .subscribe(
                      () => loader.dismiss(),
                      error => {
                        loader.dismiss();
                        this.handleError(error.message);
                      }
                    );
                }
              );
          }
        }
      }
    );
  }

  private handleError(errorMessage: string) {
    this.alertCtrl.create({
      title: 'An error occured!',
      message: errorMessage,
      buttons: ['Ok']
    }).present();
  }

}

import {Component} from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {ShoppingListService} from "../../services/shopping-list";
import {Ingredient} from "../../models/ingredient";
import {DatabaseOptionsPage} from "../database-options/database-options";
import {AuthService} from "../../services/auth";

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {

  listItems: Ingredient[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private slServive: ShoppingListService, private popoverCtrl: PopoverController,
              private authService: AuthService, private loadingCtrl: LoadingController,
              private alertCtrl: AlertController) {
  }

  ionViewWillEnter() {
    this.loadItems();
  }

  onAddItem(form: NgForm) {
    this.slServive.addItem(form.value.ingredientName, form.value.amount);
    form.reset();
    this.loadItems();
  }

  onChechItem(index: number) {
    this.slServive.removeItem(index);
    this.loadItems();
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
                  this.slServive.fetchList(token)
                    .subscribe(
                      (list: Ingredient[]) => {
                        if (list) {
                          this.listItems = list;
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
                  this.slServive.storeList(token)
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

  private loadItems() {
    this.listItems = this.slServive.getItems();
  }

  private handleError(errorMessage: string) {
    this.alertCtrl.create({
      title: 'An error occured!',
      message: errorMessage,
      buttons: ['Ok']
    }).present();
  }
}

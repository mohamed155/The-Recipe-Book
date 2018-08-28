import { Component } from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {ShoppingListService} from "../../services/shopping-list";
import {Ingredient} from "../../models/ingredient";
import {SlOptionsPage} from "./sl-options/sl-options";

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {

  listItems: Ingredient[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private slServive: ShoppingListService, private popoverCtrl: PopoverController) {
  }

  ionViewWillEnter(){
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
    const popover = this.popoverCtrl.create(SlOptionsPage);
    popover.present({ev: event});
  }

  private loadItems() {
    this.listItems = this.slServive.getItems();
  }
}

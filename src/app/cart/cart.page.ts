import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})

export class CartPage {
  product: any;
  product2: any;
  constructor(public platform: Platform, private iap2: InAppPurchase2) { }

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      this.setup();
    })
  }

  setup() {
    this.iap2.verbosity = this.iap2.DEBUG;
    this.iap2.register({
      id: 'ionic_101',
      type: this.iap2.CONSUMABLE
    });
    this.product = this.iap2.get('ionic_101');
    console.log('product 1 ' + JSON.stringify(this.product));
    this.registerHandlersForPurchase('ionic_101');
    // restore purchase
    this.iap2.refresh();

  }


  checkout() {
    this.registerHandlersForPurchase('ionic_101');
    try {
      this.product = this.iap2.get('ionic_101');
      console.log('product 1 ' + JSON.stringify(this.product))
      this.iap2.order('ionic_101').then((p) => {
        console.log('Purchase Succesful' + JSON.stringify(p));
      }).catch((e) => {
        console.log('Error Ordering From Store' + e);
      });
    } catch (err) {
      console.log('Error Ordering ' + JSON.stringify(err));
    }
  }

  registerHandlersForPurchase(productId) {
    let self = this.iap2;
    this.iap2.when(productId).updated(function (product) {
      console.log('updated: ' + JSON.stringify(product));
      if (product.loaded && product.valid && product.state === self.APPROVED && product.transaction != null) {
        product.finish();
      }
    });

    this.iap2.when(productId).registered((product: IAPProduct) => {
      // alert(` owned ${product.owned}`);
      console.log('registered: ' + JSON.stringify(product));
    });

    this.iap2.when(productId).owned((product: IAPProduct) => {
      // alert(` owned ${product.owned}`);
      console.log('owned: ' + JSON.stringify(product));
      product.finish();
    });

    this.iap2.when(productId).approved((product: IAPProduct) => {
      // alert('approved');
      console.log('approved: ' + JSON.stringify(product));
      product.finish();
    });

    this.iap2.when(productId).refunded((product: IAPProduct) => {
      // alert('refunded');
      console.log('refunded: ' + JSON.stringify(product));
    });

    this.iap2.when(productId).expired((product: IAPProduct) => {
      // alert('expired');
      console.log('expired: ' + JSON.stringify(product));
    });
  }

}

import { cart } from "../data/cart.js";
import { getProduct } from "../data/products.js";
import { getdeliveryOption } from "../data/deliveryop.js";
import { addorders } from "../backend/orders.js";


function cartsize() {
  let cartsize = 0;

  cart.forEach((cartitem) => {

    cartsize = cartitem.quantity + cartsize;

  });
  return cartsize;

}


export function renderpaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;


  cart.forEach((cartitem) => {

    const product = getProduct(cartitem.productId);
    productPriceCents += product.priceCents * cartitem.quantity;

    const deliveryOption = getdeliveryOption(cartitem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents * cartitem.quantity;
  });
  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  let taxCents = Math.round(totalBeforeTaxCents * 0.1);
  let totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
 <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${cartsize()}):</div>
            <div class="payment-summary-money">$${(productPriceCents / 100).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${(shippingPriceCents / 100).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${(totalBeforeTaxCents / 100).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${(taxCents / 100).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${(totalCents / 100).toFixed(2)}</div>
          </div>
        </div>
      <button class="place-order-button button-primary js-place-order  ">
        Place your order
      </button>
    `;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

document.querySelector('.js-place-order').addEventListener('click', async () => {
  try {
     const response = await fetch('https://supersimplebackend.dev/orders',{
    method: 'POST',
    headers: {
      'Content-type' : 'application/json'
    },
    body: JSON.stringify( {
      cart: cart
    })
  })

  const order =  await response.json()
  addorders(order);
  }
  catch(error){
    console.log('Unexpected error')
  }
  window.location.href = 'orders.html'
 
});
}
import { cart } from "../data/cart.js";
import { products, getProduct, loadProductsFetch, loadProducts } from "../data/products.js";
import { removefromcart, updatecart, updatequantity, updateDeliveryOption } from "../data/cart.js";
import { deliveryoptions, getdeliveryOption } from "../data/deliveryop.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { renderpaymentSummary } from "./payment.js";
import { loadCart } from "../data/cart.js";

async function loadPage() {
  await loadProductsFetch();

  await new Promise((resolve) => {
    loadCart(() => {
      resolve();
    });
  });

  rendercartsummary();
  renderpaymentSummary();

}
loadPage();




/*
Promise.all([
  loadProductsFetch(),
  new Promise((resolve) => {
    loadCart(() => {
      resolve();
    });
  })
]).then(() => {
  rendercartsummary();
  renderpaymentSummary();
});


/*
loadProducts(() => {
  loadCart(() => {
    rendercartsummary();
    renderpaymentSummary();
  });
});*/

function rendercartsummary() {
  let cartsummaryHTML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingproduct = getProduct(productId);


    const deliveryoptionId = Number(cartItem.deliveryOptionId);
    const deliveryOption = getdeliveryOption(deliveryoptionId);

    let dateString;
    if (deliveryOption) {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliverydays, 'days');
      dateString = deliveryDate.format('dddd, MMMM D');
    }

    cartsummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${matchingproduct.id}">
        <div class="delivery-date">${dateString}</div>
        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingproduct.image}">
          <div class="cart-item-details">
            <div class="product-name">${matchingproduct.name}</div>
            <div class="product-price">${matchingproduct.getPrice()}</div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label-${matchingproduct.id}">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link js-update-link link-primary" data-product-id="${matchingproduct.id}">
                <span class="update-main-${matchingproduct.id}">Update</span>
                <span class="update-span-${matchingproduct.id} ds"></span>
              </span>
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingproduct.id}">Delete</span>
            </div>
          </div>
          <div class="delivery-options">
            ${delieveryoptionsHTML(matchingproduct, cartItem)}
          </div>
        </div>
      </div>`;
  });

  function delieveryoptionsHTML(matchingproduct, cartItem) {
    let html = '';
    deliveryoptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliverydays, 'days');
      const dateString = deliveryDate.format('dddd, MMMM D');

      const price = deliveryOption.priceCents === 0
        ? 'FREE'
        : `$${(deliveryOption.priceCents / 100).toFixed(2)} -`;

      const isChecked = String(cartItem.deliveryOptionId) === String(deliveryOption.id);

      html += `
        <div class="delivery-option js-delivery-option" data-product-id="${matchingproduct.id}" data-delivery-option-id="${deliveryOption.id}">
          <input
            type="radio"
            class="delivery-option-input"
            name="delivery-option-${matchingproduct.id}"
            value="${deliveryOption.id}"
            ${isChecked ? 'checked' : ''}>
          <div>
            <div class="delivery-option-date">${dateString}</div>
            <div class="delivery-option-price">${price} Shipping</div>
          </div>
        </div>`;
    });
    return html;
  }

  document.querySelector('.js-order-summary').innerHTML = cartsummaryHTML;


  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removefromcart(productId);
      document.querySelector(`.js-cart-item-container-${productId}`).remove();
      updatecart();
      renderpaymentSummary();
    });
  });


  document.querySelectorAll('.js-update-link').forEach((link) => {
    const productId = link.dataset.productId;
    const updateText = document.querySelector(`.update-main-${productId}`);
    if (!updateText) return;

    updateText.addEventListener('click', () => {
      const span = document.querySelector(`.update-span-${productId}`);
      updateText.style.display = 'none';

      span.innerHTML = `
        <select class="quantity-input-${productId}">
          ${Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
        </select>
        <span class="link-primary save-link">Save</span>`;

      const saveBtn = span.querySelector('.save-link');
      saveBtn.addEventListener('click', () => {
        const quantityInput = Number(document.querySelector(`.quantity-input-${productId}`).value);
        document.querySelector(`.quantity-label-${productId}`).innerHTML = quantityInput;
        updatequantity(productId, quantityInput);
        updatecart();
        span.innerHTML = '';
        updateText.style.display = 'inline';
        renderpaymentSummary();
      });
    });
  });

  updatecart();


  document.querySelectorAll('.delivery-option-input').forEach((element) => {
    element.addEventListener('click', () => {
      const container = element.closest('.js-delivery-option');
      const productId = container.dataset.productId;
      const deliveryOptionId = container.dataset.deliveryOptionId;
      updateDeliveryOption(productId, deliveryOptionId);
      rendercartsummary();
      renderpaymentSummary();
    });
  });
}

export let cart;

cart = JSON.parse(localStorage.getItem('cart'));

if (!cart || cart.length === 0) {
  cart = [
    {
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 2,
      deliveryOptionId: "3"
    },
    {
      productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity: 1,
      deliveryOptionId: "2"
    }
  ];
}


export function savetostorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, selectedQuantity) {
  let matchingItem;

  cart.forEach((item) => {
    if (productId === item.productId) {
      matchingItem = item;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += selectedQuantity;
  }
  else {
    cart.push({
      productId: productId,
      quantity: selectedQuantity

    });
  };
  savetostorage();
}

export let ucq;

export function updatecart() {
  let cartQuantity = 0;

  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });

  ucq = cartQuantity;

  localStorage.setItem('cartQuantity', JSON.stringify(ucq));

  const quantityElement = document.querySelector('.js-cart-quantity');
  if (quantityElement) {
    quantityElement.innerHTML = cartQuantity;
  }

  const checkoutQuantity = document.querySelector('.js-checkout-count');
  if (checkoutQuantity) {
    checkoutQuantity.innerHTML = cartQuantity;
  }
}


export function addedmsg(productId) {
  const addedMsg = document.querySelector(`.js-added-to-cart-${productId}`);
  let timeoutId;

  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  addedMsg.classList.add('visible');
  timeoutId = setTimeout(() => {
    addedMsg.classList.remove('visible');
  }, 2000);
}

export function removefromcart(productId) {

  const newcart = [];
  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newcart.push(cartItem);
    }

  });
  cart.length = 0;
  Array.prototype.push.apply(cart, newcart);
  savetostorage();

}
export function updatequantity(productId, newQuantity) {
  cart.forEach((item) => {
    if (item.productId === productId) {
      item.quantity = newQuantity;
    }
  });
  savetostorage();
}


export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach((item) => {
    if (productId === item.productId) {
      matchingItem = item;
    }
  });
  matchingItem.deliveryOptionId = deliveryOptionId;
  savetostorage();
}

export function loadCart(fun) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {
    console.log(xhr.response)
    fun(); 
  });

  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send();
}

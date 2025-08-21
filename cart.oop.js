function Cart(storageKey) {
    const cart = {

        cartItems: undefined,

        loadfromstorage() {
            this.cartItems = JSON.parse(localStorage.getItem(storageKey));

            if (!this.cartItems || this.cartItems.length === 0) {
                this.cartItems = [
                    {
                        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
                        quantity: 2,
                        deliveryOptionId: "3"
                    },
                    {
                        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
                        quantity: 1,
                        deliveryOptionId: "2"
                    },
                    {
                        productId: "ma02",
                        quantity: 3,
                        deliveryOptionId: "1"
                    }
                ];
            }
        },

        savetostorage() {
            localStorage.setItem(storageKey, JSON.stringify(this.cartItems));
        },

        addtocart(productId, selectedQuantity) {
            let matchingItem;

            this.cartItems.forEach((item) => {
                if (productId === item.productId) {
                    matchingItem = item;
                }
            });

            if (matchingItem) {
                matchingItem.quantity += selectedQuantity;
            } else {
                this.cartItems.push({
                    productId: productId,
                    quantity: selectedQuantity
                });
            }
            this.savetostorage();
        },

        ucq: undefined,

        updatecart() {
            let cartQuantity = 0;

            this.cartItems.forEach((item) => {
                cartQuantity += item.quantity;
            });

            this.ucq = cartQuantity;

            localStorage.setItem('cartQuantity', JSON.stringify(this.ucq));

            const quantityElement = document.querySelector('.js-cart-quantity');
            if (quantityElement) {
                quantityElement.innerHTML = cartQuantity;
            }

            const checkoutQuantity = document.querySelector('.js-checkout-count');
            if (checkoutQuantity) {
                checkoutQuantity.innerHTML = cartQuantity;
            }
        },

        timeoutId: undefined,

        addedmsg(productId) {
            const addedMsg = document.querySelector(`.js-added-to-cart-${productId}`);

            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }
            addedMsg.classList.add('visible');
            this.timeoutId = setTimeout(() => {
                addedMsg.classList.remove('visible');
            }, 2000);
        },

        removefromcart(productId) {
            const newcart = [];
            this.cartItems.forEach((cartItem) => {
                if (cartItem.productId !== productId) {
                    newcart.push(cartItem);
                }
            });
            this.cartItems.length = 0;
            Array.prototype.push.apply(this.cartItems, newcart);
            this.savetostorage();
        },

        updatequantity(productId, newQuantity) {
            this.cartItems.forEach((item) => {
                if (item.productId === productId) {
                    item.quantity = newQuantity;
                }
            });
            this.savetostorage();
        },

        updateDeliveryOption(productId, deliveryOptionId) {
            let matchingItem;

            this.cartItems.forEach((item) => {
                if (productId === item.productId) {
                    matchingItem = item;
                }
            });
            matchingItem.deliveryOptionId = deliveryOptionId;
            this.savetostorage();
        }

    };

    return cart;
}

const cart = Cart('cart-oop');
const buisnessCart = Cart('buisness-cart-oop');

cart.loadfromstorage();
buisnessCart.loadfromstorage();

console.log(cart.cartItems);
console.log(buisnessCart.cartItems);

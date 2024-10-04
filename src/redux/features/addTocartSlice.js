import { createSlice } from "@reduxjs/toolkit";

const addTocartSlice = createSlice({
  name: "cart",
  initialState: {
    isAuth: false,
    cartItems: [],
  },
  reducers: {
    setCartItems(state, action) {
      const item = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        (cartItem) => cartItem.productId === item.productId
      );

      if (existingItemIndex >= 0) {
        // If item already exists, increase the quantity
        state.cartItems[existingItemIndex].quantity += 1;
      } else {
        // If item does not exist, add to cart with quantity 1
        state.cartItems.push({ ...item, quantity: 1 });
      }
    },
    clearCart(state) {
      state.isAuth = false;
      state.cartItems = [];
    },
    removeCartItem(state, action) {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter(
        (cartItem) => cartItem.productId !== itemId
      );
    },
    incrementQuantity(state, action) {
      const itemId = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        (cartItem) => cartItem.productId === itemId
      );

      if (existingItemIndex >= 0) {
        // Increment the quantity if the item exists
        state.cartItems[existingItemIndex].quantity += 1;
      }
    },
    updateQuantity(state, action) {
      const { productId, quantity } = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        (cartItem) => cartItem.productId === productId
      );

      if (existingItemIndex >= 0) {
        state.cartItems[existingItemIndex].quantity = quantity;
      }
    },

    decrementQuantity(state, action) {
      const itemId = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        (cartItem) => cartItem.productId === itemId
      );

      if (existingItemIndex >= 0) {
        const item = state.cartItems[existingItemIndex];
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          // Remove the item if quantity is 1 and it's being decremented
          state.cartItems.splice(existingItemIndex, 1);
        }
      }
    },
  },
});

export const {
  setCartItems,
  clearCart,
  removeCartItem,
  incrementQuantity,
  updateQuantity,
  decrementQuantity,
} = addTocartSlice.actions;
export default addTocartSlice.reducer;

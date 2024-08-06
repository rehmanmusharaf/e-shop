export const addTocart = (data) => (dispatch, getState) => {
  console.log("data in add to cart functionn: ", data);
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
  dispatch({ type: "addToCart", payload: data });
  // console.log("cart Current State is  :", getState().cart.cart);
  return data;
};
export const removeFromCart = (data) => (dispatch, getState) => {
  dispatch({ type: "removeFromCart", payload: data._id });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
  return data;
};

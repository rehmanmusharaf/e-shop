import axios from "axios";
import { server } from "../../server";

export const createProduct = (newForm) => async (dispatch) => {
  try {
    dispatch({
      type: "ProductCreateRequest",
    });
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    };
    const { data } = await axios.post(
      `${server}product/create-product`,
      newForm,
      config
    );
    dispatch({ type: "productCreateSuccess", payload: data.product });
  } catch (error) {
    dispatch({
      type: "productCreateFail",
    });
  }
};
//get all Products
export const getAllProductsShop = (id) => async (dispatch) => {
  try {
    // console.log("get all Products Function Run! and id is", id);
    dispatch({
      type: "getAllProductsShopRequest",
    });
    const { data } = await axios.get(`${server}get-all-products-shop/${id}`, {
      withCredentials: true,
    });
    console.log("All Product data is:", data);
    dispatch({ type: "getAllProductsShopSuccess", payload: data.products });
  } catch (error) {
    console.log("error during getting all product: ", error);
    dispatch({
      type: "getAllProductsShopFailed",
      payload: error?.response?.data?.message,
    });
  }
};
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteProduct",
    });
    const { data } = await axios.delete(`${server}delete-shop-product/${id}`, {
      withCredentials: true,
    });
    // console.log("data For Deleted Product", data);
    dispatch({ type: "deleteProductSuccess", payload: data.success });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "deleteProductFailed",
      payload: error.response.data.message,
    });
  }
};
// get all products
export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsRequest",
    });
    const { data } = await axios.get(`${server}get-all-products`);
    console.log("get all Products Data: ", data);
    dispatch({
      type: "getAllProductsSuccess",
      payload: data.products,
    });
  } catch (error) {
    console.log("get all Products Data error: ", error);
    dispatch({
      type: "getAllProductsFailed",
      payload: error?.response?.data?.message,
    });
  }
};

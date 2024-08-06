import axios from "axios";
import { server } from "../../server";

export const loaduser = () => async (dispatch) => {
  try {
    dispatch({
      type: "LOAD_USER_REQUEST",
    });
    const { data } = await axios.get(`${server}getuser`, {
      withCredentials: true,
    });
    // console.log(data);
    dispatch({
      type: "LOAD_USER_SUCCESS",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "LOAD_USER_FAIL",
      payload: error.response.data.message,
    });
  }
};

export const loadSeller = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadSellerRequest",
    });
    const { data } = await axios.get(`${server}shop/getseller`, {
      withCredentials: true,
    });
    console.log("seller data : ", data);
    dispatch({
      type: "LoadSellerSuccess",
      payload: data.seller,
    });
  } catch (error) {
    console.log("Load Seller Failed ", error);
    dispatch({
      type: "LoadSellerFail",
      payload: error.response.data.message,
    });
  }
};

// error.response.data.message

export const updateUserInformation =
  (name, email, phoneNumber, password) => async (dispatch) => {
    try {
      dispatch({
        type: "updateUserInfoRequest",
      });
      const { data } = await axios.put(
        `${server}user/update-user-info`,
        {
          email,
          name,
          phoneNumber,
          password,
        },
        { withCredentials: true }
      );
      console.log("response of Address updation is:", data);
      dispatch({
        type: "updateUserInfoSuccess",
        payload: data.user,
      });
    } catch (error) {
      dispatch({
        type: "updateUserInfoFailed",
        payload: error.response.data.message,
      });
    }
  };

export const updatUserAddress =
  (country, city, address1, address2, zipCode, addressType) =>
  async (dispatch) => {
    try {
      dispatch({
        type: "updateUserAddressRequest",
      });
      const { data } = await axios.put(
        `${server}user/update-user-addresses`,
        { country, city, address1, address2, zipCode, addressType },
        {
          withCredentials: true,
        }
      );
      // console.log("data is: ", data);
      dispatch({ type: "updateUserAddressSuccess", payload: data.user });
    } catch (error) {
      dispatch({
        type: "updateUserAddressFailed",
        payload: error.response.data.message,
      });
    }
  };
export const deleteUserAddress = (id) => async (dispatch) => {
  try {
    dispatch({ type: "deleteUserAddressRequest" });
    const { data } = await axios.delete(
      `${server}user/delete-user-address/${id}`,
      { withCredentials: true }
    );
    dispatch({ type: "deleteUserAddressSuccess", payload: data.user });
  } catch (error) {
    dispatch({
      type: "deleteUserAddressFailed",
      payload: error.response.data.message,
    });
  }
};

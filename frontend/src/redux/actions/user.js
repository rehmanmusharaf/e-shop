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
// error.response.data.message

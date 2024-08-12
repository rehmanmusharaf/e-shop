import axios from "axios";
import { server } from "../../server";

export const createevent = (eventdata) => async (dispatch) => {
  try {
    // for (let [key, value] of eventdata.entries()) {
    //   console.log(`${key}: ${value}`);
    // }

    // eventdata.images = "";
    dispatch({ type: "createEvent" });
    const { data } = await axios.post(
      `${server}event/create-event`,
      eventdata,
      { withCredentials: true }
    );
    dispatch({ type: "createEventSuccessfull", payload: data });
  } catch (error) {
    console.log("error suring event creation!", error);
    dispatch({
      type: "createEventFailed",
      payload: error.response.data.message,
    });
  }
};

export const getAllEventsShop = (id) => async (dispatch) => {
  try {
    // console.log("get All Events Funtion run!");
    dispatch({ type: "getEvent" });
    const { data } = await axios.get(`${server}event/getallevents/${id}`, {
      widthCredentials: true,
    });
    dispatch({ type: "getEventSuccessfull", payload: data.events });
    console.log("data of Events Get  :: ", data.events);
  } catch (error) {
    // console.log(error);
    dispatch({
      type: "getEventFailed",
      payload: error.response.data.message,
    });
  }
};
export const deleteEvent = (id) => async (dispatch) => {
  try {
    dispatch({ type: "deleteEvent" });
    const { data } = await axios.delete(`${server}event/deleteevent/${id}`, {
      widthCredentials: true,
    });

    dispatch({ type: "deleteEventSuccess", payload: data });
  } catch (error) {
    // console.log(error);
    dispatch({
      type: "deleteEventFailed",
      payload: error.response.data.message,
    });
  }
};

// get all events
export const getAllEvents = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAlleventsRequest",
    });
    const { data } = await axios.get(`${server}get-all-events`);
    // console.log("all Events Are: ", data);
    dispatch({
      type: "getAlleventsSuccess",
      payload: data.events,
    });
  } catch (error) {
    // console.log("error during getting all events!", error);
    dispatch({
      type: "getAlleventsFailed",
      payload: error.response.data.message,
    });
  }
};

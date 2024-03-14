import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";
import axios from "axios";

const Activationpage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState();
  let count = 0;

  function usercheck() {
    // console.log("usecheck Function RUn", count);
    // console.log("count is  : ", count);
    if (activation_token && count === 0) {
      try {
        console.log("if condition run", count);
        count = 1;
        axios
          .post(
            `${server}api/activation`,
            { activation_token },
            { withCredentials: true }
          )
          .then((resp) => {
            console.log(resp);
            if (resp.data.success) {
              setError(true);
            }
          })
          .catch((error) => {
            console.log("Thier is an Eroor", error);
          });
      } catch (error) {
        console.log(error);
        // setError(true);
      }
    }
  }

  useEffect(() => {
    if (activation_token) {
      usercheck();
    }
    console.log("UseEffect Run", count);
  }, []);

  return (
    <div>{error ? <div>Activation Page</div> : <div>Token Expired</div>}</div>
  );
};

export default Activationpage;

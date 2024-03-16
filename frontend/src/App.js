import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loginpage, Productspage } from "./Routes";
import { Signuppage } from "./Routes";
import { Activationpage } from "./Routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Store from "./redux/store";
import { loaduser } from "./redux/actions/user";
import { HomePage } from "./Routes";
import { BestSellingPage } from "./Routes";
import { EventsPage } from "./Routes";
import { FAQPage } from "./Routes";
const App = () => {
  useEffect(() => {
    Store.dispatch(loaduser());
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/sign-up" element={<Signuppage />} />
        <Route
          path="/activation/:activation_token"
          element={<Activationpage />}
        />
        <Route path="/products" element={<Productspage />} />
        <Route path="/best-selling" element={<BestSellingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/faq" element={<FAQPage />} />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
};

export default App;

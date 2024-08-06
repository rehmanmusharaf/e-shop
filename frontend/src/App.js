import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loginpage, Productspage } from "./Routes";
import { Signuppage } from "./Routes";
import { Activationpage } from "./Routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Store from "./redux/store";
import { loadSeller, loaduser } from "./redux/actions/user";
import { getAllProducts } from "./redux/actions/product";
import { HomePage } from "./Routes";
import { BestSellingPage } from "./Routes";
import { EventsPage } from "./Routes";
import { FAQPage } from "./Routes";
import { ProductDetailsPage } from "./Routes";
import { ShopCreateEvents, ShopPreviewPage } from "./Routes";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";
import ShopProtectedRoute from "./ShopProtectedRoute";
import { useSelector } from "react-redux";
import ShopCreatePage from "./pages/ShopCreatePage";
import ShopLoginPage from "./pages/ShopLoginPage";
import ShopHomePage from "./pages/Shop/ShopHomePage";
import ShopDashboardPage from "./pages/Shop/ShopDashboardPage";
import ShopCreateProduct from "./pages/Shop/ShopCreateProduct";
import ShopAllProducts from "./pages/Shop/ShopAllProducts";
import ShopAllEvents from "./pages/Shop/ShopAllEvents";
import ShopAllCoupons from "./pages/Shop/ShopAllCoupons";
import { getAllProductsShop } from "./redux/actions/product";
import { getAllEventsShop } from "./redux/actions/events";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { server } from "./server";
import SuccessPage from "./components/Payment/SuccessPage";
import ShopAllOrders from "./pages/Shop/ShopAllOrders";
import ShopOrderDetails from "./pages/Shop/ShopOrderDetails";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import ShopAllRefunds from "./pages/Shop/ShopAllRefunds.";
import ShopSettingsPage from "./pages/Shop/ShopSettingsPage";
import ShopWithDrawMoneyPage from "./pages/Shop/ShopWithDrawMoneyPage";
import ShopInboxPage from "./pages/Shop/ShopInboxPage";
import UserInbox from "./pages/UserInbox";

const App = () => {
  const [stripeApikey, setStripeApiKey] = useState("");
  const { seller, isSeller, isLoading } = useSelector((state) => state.seller);
  const stripePromise = loadStripe(
    "pk_test_51PfJmCRvfk3sC3a7BsuKH5ma0irV123iPCC8hAXusAcLvtejS4QPQszSA4416IJYCu3IGYsvRmldKJcI1hyL4glc00UAbINbrw"
  );

  if (seller) {
    // console.log("seller if condition run");
    Store.dispatch(getAllEventsShop(seller?._id));
    Store.dispatch(getAllProductsShop(seller?._id));
  }
  async function getStripeApikey() {
    try {
      const { data } = await axios.get(`${server}payment/stripeapikey`);
      console.log("stripe api key is:", data);
      setStripeApiKey(data.stripeApikey);
    } catch (error) {
      console.log("Error During Getting Stripe API Key", error);
    }
  }
  useEffect(() => {
    Store.dispatch(loaduser());
    Store.dispatch(loadSeller());
    Store.dispatch(getAllProducts());
    getStripeApikey();
  }, []);

  return (
    <BrowserRouter>
      {stripeApikey && (
        <Elements stripe={loadStripe(stripeApikey)}>
          <Routes>
            {/* <App /> */}
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Elements>
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/sign-up" element={<Signuppage />} />
        <Route path="/order/success" element={<SuccessPage />} />

        <Route
          path="/activation/:activation_token"
          element={<Activationpage />}
        />
        <Route path="/products" element={<Productspage />} />
        <Route path="/best-selling" element={<BestSellingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/shop-create" element={<ShopCreatePage />} />
        <Route path="/shop-login" element={<ShopLoginPage />} />
        <Route
          path="/seller-acount/:activation_token"
          element={<Activationpage />}
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shop/:id"
          element={
            <ShopProtectedRoute>
              <ShopHomePage />
            </ShopProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ShopProtectedRoute>
              <ShopDashboardPage />
            </ShopProtectedRoute>
          }
        />
        <Route
          path="/dashboard-create-product"
          element={
            <ShopProtectedRoute>
              <ShopCreateProduct />
            </ShopProtectedRoute>
          }
        />

        <Route
          path="/dashboard-products"
          element={
            <ShopProtectedRoute>
              <ShopAllProducts />
            </ShopProtectedRoute>
          }
        />
        <Route
          path="/dashboard-create-event"
          element={
            <ShopProtectedRoute>
              <ShopCreateEvents />
            </ShopProtectedRoute>
          }
        />
        <Route
          path="/dashboard-events"
          element={
            <ShopProtectedRoute>
              <ShopAllEvents />
            </ShopProtectedRoute>
          }
        />
        <Route
          path="/dashboard-coupouns"
          element={
            <ShopProtectedRoute>
              <ShopAllCoupons />
            </ShopProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ShopProtectedRoute>
              <CheckoutPage />
            </ShopProtectedRoute>
          }
        />
        <Route
          path="/dashboard-orders"
          element={
            <ShopProtectedRoute>
              <ShopAllOrders />
            </ShopProtectedRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <ShopProtectedRoute>
              <ShopOrderDetails />
            </ShopProtectedRoute>
          }
        />
        <Route
          path="/dashboard-refunds"
          element={
            <ShopProtectedRoute>
              <ShopAllRefunds />
            </ShopProtectedRoute>
          }
        />
        <Route
          path="/dashboard-messages"
          element={
            <ShopProtectedRoute>
              <ShopInboxPage />
            </ShopProtectedRoute>
          }
        />
        <Route
          path="/dashboard-withdraw-money"
          element={
            <ShopProtectedRoute>
              <ShopWithDrawMoneyPage />
            </ShopProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ShopProtectedRoute>
              <ShopSettingsPage />
            </ShopProtectedRoute>
          }
        />
        <Route
          path="/user/order/:id"
          element={
            <ProtectedRoute>
              <OrderDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/track/order/:id"
          element={
            <ProtectedRoute>
              <TrackOrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <UserInbox />
            </ProtectedRoute>
          }
        />
        <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />
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

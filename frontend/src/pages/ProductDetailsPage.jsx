import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import ProductDetails from "../components/Products/ProductDetails";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import { useSelector } from "react-redux";
import { productData } from "../static/data";
import { getAllEvents } from "../redux/actions/events";
import { useDispatch } from "react-redux";
const ProductDetailsPage = () => {
  const dispatch = useDispatch();
  const { allProducts } = useSelector((state) => state.products);
  // const products = productData;
  const { events, allEvents } = useSelector((state) => state.events);
  let { id } = useParams();
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent");

  useEffect(() => {
    // console.log("ID is :", id);
    if (eventData !== null) {
      // console.log("if Conditionn run due to to this Event!");
      // console.log("events is:", allEvents);
      // if (allEvents == []) dispatchEvent(getAllEvents);
      // const data = allEvents && allEvents.find((i) => i._id === id);
      // setData(data);
    } else {
      // id = Number(id);
      console.log(typeof id);
      // console.log("id is :", id);
      // console.log("Al Products : ", products);
      const data = allProducts && allProducts.find((i) => i._id == id);
      // console.log("data of Suggested Product : ", data);
      setData(data);
    }
  }, [allProducts, id]);
  useEffect(() => {
    if (eventData !== null) {
      // console.log("if Conditionn run due to to this Event!");
      // console.log("events is:", allEvents);
      if (allEvents == null) {
        // console.log("getall Events run!");
        dispatch(getAllEvents());
      }
      const data = allEvents && allEvents.find((i) => i._id === id);
      setData(data);
    }
  }, [allEvents]);
  // [products, ]

  return (
    <div>
      <Header />
      {data && (
        <>
          <ProductDetails data={data} />
          {!eventData && <>{data && <SuggestedProduct data={data} />}</>}
        </>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetailsPage;

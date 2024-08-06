import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import ProductDetails from "../components/Products/ProductDetails";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import { useSelector } from "react-redux";
import { productData } from "../static/data";
const ProductDetailsPage = () => {
  const { allProducts } = useSelector((state) => state.products);
  // const products = productData;
  const { events } = useSelector((state) => state.events);
  let { id } = useParams();
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent");

  useEffect(() => {
    // console.log("ID is :", id);
    if (eventData !== null) {
      // console.log("if Conditionn run due to to this Event!");
      const data = events && events.find((i) => i._id === id);
      setData(data);
    } else {
      // id = Number(id);
      console.log(typeof id);
      // console.log("id is :", id);
      // console.log("Al Products : ", products);
      const data = allProducts && allProducts.find((i) => i._id == id);
      // console.log("data of Suggested Product : ", data);
      setData(data);
    }
  }, [allProducts, id, events]);
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

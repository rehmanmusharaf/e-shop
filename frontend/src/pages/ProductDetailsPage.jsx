import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import ProductDetails from "../components/Products/ProductDetails";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import { useSelector } from "react-redux";
import { productData } from "../static/data";
const ProductDetailsPage = () => {
  // const { allProducts } = useSelector((state) => state.products);
  const allProducts = productData;
  // const { allEvents } = useSelector((state) => state.events);
  let { id } = useParams();
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();
  // const eventData = searchParams.get("isEvent");

  useEffect(() => {
    // if (eventData !== null) {
    //   // const data = allEvents && allEvents.find((i) => i._id === id);
    //   // setData(data);
    // } else {
    id = Number(id);
    // console.log(typeof id);
    // console.log("Al Products : ", allProducts);

    const data = allProducts && allProducts.find((i) => i.id === id);
    console.log("data of Suggested Product : ", data);
    setData(data);
    // }
  }, [allProducts]);
  // [allProducts, allEvents]

  return (
    <div>
      <Header />
      {data && (
        <>
          <ProductDetails data={data} />
          {/* {!eventData && <>{data &&  */}
          <SuggestedProduct data={data} />
          {/* }</>} */}
        </>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetailsPage;

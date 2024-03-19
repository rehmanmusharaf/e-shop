import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { productData } from "../../static/data";
import styles from "../../style/style";
import ProductCard from "../Route/ProductCard/ProductCard";

const SuggestedProduct = ({ data }) => {
  //   const {allProducts} = useSelector((state) => state.products);
  const allProducts = productData;
  const [productData1, setProductData1] = useState(productData);

  useEffect(() => {
    console.log(data);
    // if (data !== null) {
    console.log(allProducts, "data from product deail page is  :", data);
    const d =
      allProducts && allProducts.filter((i) => i.category === data.category);
    setProductData1(d);
    // }
  }, [data]);

  return (
    <div>
      {data ? (
        <div className={`p-4 ${styles.section}`}>
          <h2
            className={`${styles.heading} text-[25px] font-[500] border-b mb-5`}
          >
            Related Product
          </h2>
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
            {productData1 &&
              productData1.map((i, index) => (
                <ProductCard data={i} key={index} />
              ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SuggestedProduct;

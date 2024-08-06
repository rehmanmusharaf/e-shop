import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "../../../style/style";
import ProductCard from "../ProductCard/ProductCard";
import { productData } from "../../../static/data";

const FeaturedProduct = () => {
  const { products } = useSelector((state) => state.products);
  // const products = productData;
  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Featured Products</h1>
        </div>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
          {products && products.length !== 0 && (
            <>
              {products &&
                products.map((i, index) => (
                  <ProductCard data={i} key={index} />
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;

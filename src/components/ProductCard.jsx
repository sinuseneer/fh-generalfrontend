import React from "react";
import { getImageUrl } from "../utils/imageUrl";
import "./ProductCard.css";

const ProductCard = ({ product, onClick }) => {
  return (
    <div className="custom-product-card" onClick={() => onClick(product)}>
      <div className="product-image-container">
        <img
          src={
            product.main_image
              ? getImageUrl(product.main_image)
              : "/images/no-image.jpg"
          }
          alt={product.product_name}
          className="product-image"
        />
      </div>
      <div className="product-info">
        <h2 className="product-title">{product.product_name}</h2>
        <p className="product-id">{product.prod_id}</p>
      </div>
    </div>
  );
};

export default ProductCard;
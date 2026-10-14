import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import { useProduct } from "@/features/products/hooks/useProduct";
import { useCartStore } from "@/features/cart/store/useCartStore";
import "./ProductDetailsPage.scss";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const { data: product, isLoading, isError, error, refetch } = useProduct(productId);
  const addItem = useCartStore((state) => state.addItem);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const images = product?.images?.length ? product.images : product ? [product.thumbnail] : [];
  const activeImage = images.includes(selectedImage) ? selectedImage : images[0];

  return (
    <main className="product-details">
      {isLoading && <Loading message="Loading product..." />}

      {isError && (
        <div className="product-details__error" role="alert">
          <p>{error instanceof Error ? error.message : "Could not load this product."}</p>
          <button type="button" onClick={() => refetch()}>Try again</button>
        </div>
      )}

      {!isLoading && !isError && !product && <p>Product not found.</p>}

      {!isLoading && !isError && product && (
        <>
          <Link className="product-details__back" to="/">← Back to shop</Link>

          <div className="product-details__layout">
            <div className="product-details__gallery">
              <div className="product-details__image-wrapper">
                <img className="product-details__image" src={activeImage} alt={product.title} />
              </div>

              {images.length > 1 && (
                <div className="product-details__thumbnails">
                  {images.map((image) => (
                    <button className={`product-details__thumbnail ${activeImage === image ? "product-details__thumbnail--active" : ""}`} key={image} type="button" onClick={() => setSelectedImage(image)} aria-label={`View image of ${product.title}`}>
                      <img src={image} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="product-details__content">
              <p className="product-details__category">{product.category}</p>
              <h1 className="product-details__title">{product.title}</h1>
              <p className="product-details__rating">★ {product.rating.toFixed(1)} / 5</p>
              <p className="product-details__price">${product.price.toFixed(2)}</p>
              <p className="product-details__description">{product.description}</p>
              <p className="product-details__stock">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>

              {product.stock > 0 && (
                <div className="product-details__purchase">
                  <label className="product-details__quantity-label" htmlFor="product-quantity">Quantity</label>
                  <div className="product-details__quantity">
                    <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} disabled={quantity <= 1} aria-label="Decrease quantity">−</button>
                    <span>{quantity}</span>
                    <button type="button" onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))} disabled={quantity >= product.stock} aria-label="Increase quantity">+</button>
                  </div>
                  <Button onClick={() => addItem(product, quantity)}>Add to cart</Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
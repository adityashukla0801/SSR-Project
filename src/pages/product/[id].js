import React from "react";
import Head from "next/head";
import "../../app/globals.css";

export async function getServerSideProps({ params }) {
  const productId = parseInt(params.id);

  try {
    // Fetch current product
    const res = await fetch(`https://fakestoreapi.com/products/${productId}`);
    if (!res.ok) {
      // Handle the case where the product does not exist
      return {
        notFound: true,
      };
    }

    const product = await res.json();

    // Define next and prev product IDs
    const nextProductId = productId + 1;
    const prevProductId = productId > 1 ? productId - 1 : null;

    // Fetch next and previous products for navigation
    const fetchNextProduct = nextProductId
      ? await fetch(`https://fakestoreapi.com/products/${nextProductId}`)
          .then((res) => res.json())
          .catch(() => null)
      : null;

    const fetchPrevProduct = prevProductId
      ? await fetch(`https://fakestoreapi.com/products/${prevProductId}`)
          .then((res) => res.json())
          .catch(() => null)
      : null;

    return {
      props: {
        product,
        nextProduct: fetchNextProduct,
        prevProduct: fetchPrevProduct,
      },
    };
  } catch (error) {
    return {
      props: {
        notFound: true,
      },
    };
  }
}

const ProductPage = ({ product, nextProduct, prevProduct, notFound }) => {
  const handleNavigation = async (id) => {
    window.location.assign(`/product/${id}`);
  };

  if (notFound) {
    return (
      <div className="container mx-auto px-4 h-[100vh] flex items-center justify-center">
        <div className="flex w-[50%] rounded-lg flex-col items-center justify-center p-8">
          <img
            src="https://img.freepik.com/free-vector/error-404-concept-landing-page_23-2148237748.jpg?w=1800&t=st=1723804676~exp=1723805276~hmac=da96d3862aaab24c787f0046e47f64d2770e8cb6d6a6ca14696d05dde1b0b5e2"
            alt="Not found"
            className="w-[30%] h-[30%]"
          />
          <h1 className="text-2xl font-normal my-4">Invalid ID</h1>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>{product.title}</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image} />
        <meta property="og:type" content="product" />
      </Head>
      <div className="container mx-auto px-4 h-[100vh] flex items-center justify-center">
        <div className="flex w-[50%] bg-white rounded-lg flex-col items-start justify-center p-8">
          <img
            src={product.image}
            alt={product.title}
            className="w-[30%] h-[30%]"
          />
          <h1 className="text-2xl font-bold my-4">{product.title}</h1>
          <p className="text-gray-600">${product.price}</p>
          <p className="text-gray-800 mt-4">{product.description}</p>
          <div className="mt-4">
            <span className="text-yellow-500">
              Rating: {product.rating.rate}
            </span>
            <span className="ml-2 text-gray-500">
              ({product.rating.count} reviews)
            </span>
          </div>
          <div className="mt-8">
            <button
              className={`bg-slate-500 px-8 py-2 mr-4 ${
                !prevProduct ? "disabled:opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => prevProduct && handleNavigation(prevProduct.id)}
              disabled={!prevProduct}
            >
              PREV
            </button>
            <button
              className={`bg-slate-500 px-8 py-2 mr-4 ${
                !nextProduct ? "disabled:opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!nextProduct}
              onClick={() => nextProduct && handleNavigation(nextProduct.id)}
            >
              NEXT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

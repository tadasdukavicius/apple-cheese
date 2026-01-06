import { cart } from "../data/mockCart.js";
import { products } from "../data/mockProducts.js";

export const getCart = (req, res) => {
  const cartWithProducts = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  });
  res.json(cartWithProducts);
};

export const addToCart = (req, res) => {
  const { productId, quantity } = req.body;
  cart.push({ productId, quantity });
  res.json({ message: "Added to cart", cart });
};
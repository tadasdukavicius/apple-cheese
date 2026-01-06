import { orders } from "../data/mockOrders";
import { cart } from "../data/mockCart";

export const createCheckout = (req, res) => {
  const newOrder = {
    id: orders.length + 1,
    userId: 1,
    items: [...cart],
    total: cart.reduce((sum, item) => sum + item.quantity * 5.99, 0), //total
    status: "pending"
  };
  orders.push(newOrder);
  res.json({ message: "Checkout created", orderId: newOrder.id, redirectUrl: "https://paysera.example.com/mock" });
};
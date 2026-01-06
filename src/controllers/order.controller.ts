import { orders } from "../data/mockOrders";

export const getOrderById = (req, res) => {
  const id = parseInt(req.params.id);
  const order = orders.find(o => o.id === id);
  if (!order) return res.json({ message: "Order not found" });
  res.json(order);
};
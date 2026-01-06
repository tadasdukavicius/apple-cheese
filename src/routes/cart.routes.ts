import { Router } from "express";
import { getCart, addToCart } from "../controllers/cart.controller.js";

const router = Router();

router.get("/", getCart);
router.post("/add", addToCart);

export default router;
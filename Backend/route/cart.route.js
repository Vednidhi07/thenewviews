import express from "express";
import { addtocart } from "../controller/cart.controller.js";
const router = express.Router();

router.post("/cart", addtocart);

export default router;
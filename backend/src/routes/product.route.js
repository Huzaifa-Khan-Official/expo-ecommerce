import { Router } from "express";
import { getAllProducts } from "../controllers/admin.controller.js";
import { getProductById } from "../controllers/product.controller.js";

const router = Router();

// Public routes - products can be viewed by anyone
router.get("/", getAllProducts);
router.get("/:id", getProductById);

export default router;

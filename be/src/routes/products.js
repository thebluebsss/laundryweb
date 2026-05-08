import express from "express";
import * as productController from "../controllers/productController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import { validate } from "../utils/validators.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../utils/validators.js";

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lấy danh sách products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price-asc, price-desc, popular, rating]
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get("/", productController.getProducts);

/**
 * @swagger
 * /api/products/recommendations:
 *   get:
 *     summary: Lấy sản phẩm gợi ý
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: service
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lấy recommendations thành công
 */
router.get("/recommendations", productController.getRecommendations);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Lấy chi tiết product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lấy chi tiết thành công
 */
router.get("/:id", productController.getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Tạo product mới (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Tạo product thành công
 */
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  validate(createProductSchema),
  productController.createProduct,
);

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Cập nhật product (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.patch(
  "/:id",
  authenticateToken,
  requireAdmin,
  validate(updateProductSchema),
  productController.updateProduct,
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Xóa product (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  productController.deleteProduct,
);

export default router;

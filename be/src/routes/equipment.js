import express from "express";
import * as equipmentController from "../controllers/equipmentController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import { validate } from "../utils/validators.js";
import {
  createEquipmentSchema,
  updateEquipmentSchema,
} from "../utils/validators.js";

const router = express.Router();

/**
 * @swagger
 * /api/equipment:
 *   get:
 *     summary: Lấy danh sách equipment (Admin)
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get(
  "/",
  authenticateToken,
  requireAdmin,
  equipmentController.getEquipment,
);

/**
 * @swagger
 * /api/equipment/{id}:
 *   get:
 *     summary: Lấy chi tiết equipment (Admin)
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy chi tiết thành công
 */
router.get(
  "/:id",
  authenticateToken,
  requireAdmin,
  equipmentController.getEquipmentById,
);

/**
 * @swagger
 * /api/equipment:
 *   post:
 *     summary: Tạo equipment mới (Admin)
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Tạo equipment thành công
 */
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  validate(createEquipmentSchema),
  equipmentController.createEquipment,
);

/**
 * @swagger
 * /api/equipment/{id}:
 *   patch:
 *     summary: Cập nhật equipment (Admin)
 *     tags: [Equipment]
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
  validate(updateEquipmentSchema),
  equipmentController.updateEquipment,
);

/**
 * @swagger
 * /api/equipment/{id}:
 *   delete:
 *     summary: Xóa equipment (Admin)
 *     tags: [Equipment]
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
  equipmentController.deleteEquipment,
);

export default router;

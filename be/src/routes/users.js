import express from "express";
import * as userController from "../controllers/userController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import { validate } from "../utils/validators.js";
import { createUserSchema, updateUserSchema } from "../utils/validators.js";

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy danh sách users (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get("/", authenticateToken, requireAdmin, userController.getUsers);

/**
 * @swagger
 * /api/users/stats:
 *   get:
 *     summary: Thống kê users (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thống kê thành công
 */
router.get(
  "/stats",
  authenticateToken,
  requireAdmin,
  userController.getUserStats,
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Lấy chi tiết user (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy chi tiết thành công
 */
router.get("/:id", authenticateToken, requireAdmin, userController.getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Tạo user mới (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Tạo user thành công
 */
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  validate(createUserSchema),
  userController.createUser,
);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Cập nhật user (Admin)
 *     tags: [Users]
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
  validate(updateUserSchema),
  userController.updateUser,
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Xóa user (Admin)
 *     tags: [Users]
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
  userController.deleteUser,
);

/**
 * @swagger
 * /api/users/{id}/toggle-active:
 *   patch:
 *     summary: Kích hoạt/vô hiệu hóa user (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.patch(
  "/:id/toggle-active",
  authenticateToken,
  requireAdmin,
  userController.toggleUserActive,
);

export default router;

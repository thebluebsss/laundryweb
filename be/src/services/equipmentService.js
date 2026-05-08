import Equipment from "../models/Equipment.js";
import { NotFoundError } from "../utils/errorHandler.js";

/**
 * Lấy danh sách equipment
 */
export const getEquipment = async (filters = {}) => {
  const query = {};

  if (filters.type) query.type = filters.type;
  if (filters.status) query.status = filters.status;

  const equipment = await Equipment.find(query).sort({ createdAt: -1 });
  return equipment;
};

/**
 * Lấy chi tiết equipment
 */
export const getEquipmentById = async (equipmentId) => {
  const equipment = await Equipment.findById(equipmentId);
  if (!equipment) {
    throw new NotFoundError("Equipment không tồn tại");
  }
  return equipment;
};

/**
 * Tạo equipment mới
 */
export const createEquipment = async (equipmentData) => {
  const equipment = await Equipment.create(equipmentData);
  return equipment;
};

/**
 * Cập nhật equipment
 */
export const updateEquipment = async (equipmentId, updateData) => {
  const equipment = await Equipment.findByIdAndUpdate(
    equipmentId,
    { $set: updateData },
    { new: true, runValidators: true },
  );

  if (!equipment) {
    throw new NotFoundError("Equipment không tồn tại");
  }

  return equipment;
};

/**
 * Xóa equipment
 */
export const deleteEquipment = async (equipmentId) => {
  const equipment = await Equipment.findByIdAndDelete(equipmentId);
  if (!equipment) {
    throw new NotFoundError("Equipment không tồn tại");
  }
  return equipment;
};

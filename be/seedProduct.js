import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./Product.js";

dotenv.config();

const sampleProducts = [
  {
    name: "Bột giặt OMO Matic Comfort",
    description: "Bột giặt chuyên dụng cho máy giặt, hương Comfort thơm lâu",
    price: 89000,
    originalPrice: 120000,
    category: "detergent",
    image:
      "https://th.bing.com/th/id/OIP.nCwuqi2K2d0a446MIBQbQwHaHa?w=177&h=180&c=7&r=0&o=7&dpr=1.2&pid=1.7&rm=3",
    stock: 50,
    unit: "túi",
    weight: "3.5kg",
    brand: "OMO",
    rating: 4.8,
    soldCount: 0,
    tags: ["bột giặt", "omo", "máy giặt", "comfort"],
    recommendFor: ["Giặt hấp/sấy khô", "Giặt ủi", "all"],
  },
  {
    name: "Bột giặt Ariel Matic",
    description: "Giặt sạch vết bẩn cứng đầu, giữ màu quần áo",
    price: 95000,
    originalPrice: 125000,
    category: "detergent",
    image:
      "https://th.bing.com/th/id/OIP.ch-7liUVWKUoiqyvXnu3NwHaHa?w=216&h=216&c=7&r=0&o=7&dpr=1.2&pid=1.7&rm=3",
    stock: 45,
    unit: "túi",
    weight: "3.8kg",
    brand: "Ariel",
    rating: 4.7,
    soldCount: 0,
    tags: ["bột giặt", "ariel", "máy giặt"],
    recommendFor: ["Giặt hấp/sấy khô", "all"],
  },
  {
    name: "Nước giặt Tide Matic",
    description: "Nước giặt đậm đặc, tiết kiệm, hiệu quả cao",
    price: 78000,
    originalPrice: 95000,
    category: "detergent",
    image:
      "https://th.bing.com/th/id/OIP.2h0GfKm6Blu5RnOgvrsYZQHaHa?w=172&h=180&c=7&r=0&o=7&dpr=1.2&pid=1.7&rm=3",
    stock: 60,
    unit: "chai",
    weight: "2.3L",
    brand: "Tide",
    rating: 4.6,
    soldCount: 0,
    tags: ["nước giặt", "tide", "máy giặt"],
    recommendFor: ["Giặt ủi", "all"],
  },

  // Nước xả vải
  {
    name: "Nước xả Comfort đậm đặc",
    description: "Làm mềm vải, thơm lâu, chống nhăn hiệu quả",
    price: 65000,
    originalPrice: 80000,
    category: "softener",
    image:
      "https://th.bing.com/th/id/OIP.nT8SuDmGybvEiDz3ocoi7gHaHa?w=186&h=186&c=7&r=0&o=7&dpr=1.2&pid=1.7&rm=3",
    stock: 40,
    unit: "chai",
    weight: "1.5L",
    brand: "Comfort",
    rating: 4.9,
    soldCount: 0,
    tags: ["nước xả", "comfort", "thơm lâu"],
    recommendFor: ["Giặt ủi", "Giặt hấp/sấy khô", "all"],
  },
  {
    name: "Nước xả Downy Parfum",
    description: "Hương nước hoa cao cấp, mềm mại tuyệt đối",
    price: 72000,
    originalPrice: 90000,
    category: "softener",
    image:
      "https://th.bing.com/th/id/OIP.Of7qH8Jl5IIpH3wOUCYQIQHaHa?w=178&h=180&c=7&r=0&o=7&dpr=1.2&pid=1.7&rm=3",
    stock: 35,
    unit: "chai",
    weight: "1.6L",
    brand: "Downy",
    rating: 4.8,
    soldCount: 0,
    tags: ["nước xả", "downy", "cao cấp"],
    recommendFor: ["Giặt khô (Dry Clean)", "all"],
  },

  // Túi giặt
  {
    name: "Túi giặt chuyên dụng cao cấp",
    description: "Bảo vệ quần áo khỏi phai màu, rách, xù lông",
    price: 25000,
    originalPrice: 35000,
    category: "bag",
    image:
      "https://th.bing.com/th/id/OIP.YPbsrM6oIT3avzReoq0aNQHaHa?w=186&h=186&c=7&r=0&o=7&dpr=1.2&pid=1.7&rm=3",
    stock: 100,
    unit: "cái",
    weight: "Size L",
    brand: "LaundryPro",
    rating: 4.7,
    soldCount: 0,
    tags: ["túi giặt", "bảo vệ", "an toàn"],
    recommendFor: ["Giặt khô (Dry Clean)", "all"],
  },
  {
    name: "Túi lưới giặt đồ lót",
    description: "Chuyên dụng cho đồ lót, tránh biến dạng",
    price: 15000,
    originalPrice: 20000,
    category: "bag",
    image:
      "https://th.bing.com/th/id/OIP.T6kfi4REh5Z1jnbp0MwSPgHaHa?w=195&h=195&c=7&r=0&o=7&dpr=1.2&pid=1.7&rm=3",
    stock: 80,
    unit: "cái",
    weight: "Size M",
    brand: "LaundryPro",
    rating: 4.6,
    soldCount: 0,
    tags: ["túi giặt", "đồ lót", "lưới"],
    recommendFor: ["all"],
  },

  // Chất tẩy
  {
    name: "Nước tẩy quần áo trắng",
    description: "Tẩy vết bẩn cứng đầu, làm trắng sáng",
    price: 32000,
    originalPrice: 42000,
    category: "bleach",
    image:
      "https://th.bing.com/th/id/OIP.mvusulm-hP_8HUvPgWOvyAHaHa?w=164&h=180&c=7&r=0&o=7&dpr=1.2&pid=1.7&rm=3",
    stock: 55,
    unit: "chai",
    weight: "500ml",
    brand: "CleanMax",
    rating: 4.5,
    soldCount: 0,
    tags: ["tẩy trắng", "vết bẩn"],
    recommendFor: ["Giặt hấp/sấy khô"],
  },

  // Phụ kiện
  {
    name: "Bi giặt tẩy sạch nano",
    description: "Giúp giặt sạch sâu, không cần dùng nhiều bột giặt",
    price: 45000,
    originalPrice: 65000,
    category: "accessory",
    image: "/img/laundry-ball.png",
    stock: 30,
    unit: "hộp",
    weight: "1 bộ",
    brand: "EcoClean",
    rating: 4.4,
    soldCount: 0,
    tags: ["phụ kiện", "tiết kiệm", "thân thiện"],
    recommendFor: ["all"],
  },
  {
    name: "Giấy thơm quần áo",
    description: "Làm thơm tủ quần áo, giữ mùi hương lâu",
    price: 18000,
    originalPrice: 25000,
    category: "accessory",
    image:
      "https://th.bing.com/th/id/OIP.KvjmbYjjSL005mAb9tEIHAHaHa?w=175&h=180&c=7&r=0&o=7&dpr=1.2&pid=1.7&rm=3",
    stock: 70,
    unit: "hộp",
    weight: "10 tờ",
    brand: "FreshScent",
    rating: 4.8,
    soldCount: 0,
    tags: ["thơm", "giấy thơm", "tiện lợi"],
    recommendFor: ["all"],
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/laundry-booking"
    );
    console.log("✅ Đã kết nối MongoDB");
    await Product.deleteMany({});
    console.log("🗑️  Đã xóa sản phẩm cũ");
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Đã thêm ${products.length} sản phẩm mẫu`);

    console.log("\n📦 Danh sách sản phẩm:");
    products.forEach((p) => {
      console.log(`   - ${p.name} (${p.category}) - ${p.price}đ`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error);
    process.exit(1);
  }
};

seedProducts();

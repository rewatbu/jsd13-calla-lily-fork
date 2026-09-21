// ============================================================
// ข้อมูลสินค้าตั้งต้น (Seed Data) ของร้าน Calla Lily
// - ใช้เป็นข้อมูลเริ่มต้นก่อนสินค้าใน localStorage
// - แต่ละตัว: id (รหัสสินค้า), name (ชื่อ), price (ราคาบาท),
//   category (หมวดหมู่), image (URL รูปภาพ),
//   description (รายละเอียด), stock (จำนวนคงเหลือ)
// - ผู้ดูแลระบบสามารถเพิ่ม/แก้ไข/ลบสินค้าได้ที่หน้า Admin
// ============================================================
const products = [
  {
    id: 1,
    name: "Lavender Dreams Soap",
    price: 120.0,
    category: "Relaxation",
    image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400",
    description:
      "Handcrafted lavender soap with natural essential oils for a calming bath experience.",
    stock: 25,
  },
  {
    id: 2,
    name: "Citrus Burst Soap",
    price: 110.0,
    category: "Energizing",
    image: "https://images.unsplash.com/photo-1614806687792-7fcec07dcbbd?w=400",
    description:
      "Refreshing citrus soap made with real orange and lemon extracts to wake up your senses.",
    stock: 30,
  },
  {
    id: 3,
    name: "Honey Oat Bar",
    price: 130.0,
    category: "Moisturizing",
    image: "https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=400",
    description:
      "Gentle honey and oatmeal soap that soothes and moisturizes dry skin.",
    stock: 18,
  },
  {
    id: 4,
    name: "Rose Petal Veil Mist",
    price: 190.0,
    category: "Fragrance",
    image: "https://images.unsplash.com/photo-1585145868057-135bf14b0503?w=400",
    description:
      "A delicate rose water mist that softens and refreshes, leaving a whisper of floral scent.",
    stock: 22,
  },
  {
    id: 5,
    name: "Silk Hand Cream",
    price: 150.0,
    category: "Skin Care",
    image: "https://images.unsplash.com/photo-1617030557331-75cb865d9d20?w=400",
    description:
      "Lightweight hand cream with shea butter that absorbs fast and leaves hands silky smooth.",
    stock: 35,
  },
  {
    id: 6,
    name: "Bamboo Charcoal Bar",
    price: 125.0,
    category: "Relaxation",
    image: "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400",
    description:
      "Deep-cleaning charcoal soap that gently draws out impurities for refreshed, calm skin.",
    stock: 14,
  },
  {
    id: 7,
    name: "Green Tea Body Wash",
    price: 160.0,
    category: "Energizing",
    image: "https://images.unsplash.com/photo-1704428381427-02f6d220a312?w=400",
    description:
      "Antioxidant-rich green tea body wash that energizes the skin with a clean, crisp finish.",
    stock: 27,
  },
  {
    id: 8,
    name: "Shea Cocoa Butter",
    price: 175.0,
    category: "Moisturizing",
    image: "https://images.unsplash.com/photo-1781343219437-40f58c5458d6?w=400",
    description:
      "Rich shea and cocoa butter blend that deeply nourishes very dry skin all day.",
    stock: 20,
  },
  {
    id: 9,
    name: "White Jasmine Cologne",
    price: 225.0,
    category: "Fragrance",
    image: "https://images.unsplash.com/photo-1630573133526-8d090e0269af?w=400",
    description:
      "A luminous white jasmine cologne with soft musk, made for warm evenings.",
    stock: 12,
  },
  {
    id: 10,
    name: "Aloe Vera Soothing Gel",
    price: 165.0,
    category: "Skin Care",
    image: "https://images.unsplash.com/photo-1774663543332-03e32085e8f3?w=400",
    description:
      "Cooling aloe vera gel that calms sun-kissed and sensitive skin instantly.",
    stock: 26,
  },
  {
    id: 11,
    name: "Coconut Milk Bath Soak",
    price: 185.0,
    category: "Relaxation",
    image: "https://images.unsplash.com/photo-1618840152526-92682643af2d?w=400",
    description:
      "A creamy coconut milk soak that softens skin and melts away stress.",
    stock: 16,
  },
  {
    id: 12,
    name: "Charcoal & Mint Cleanser",
    price: 140.0,
    category: "Energizing",
    image: "https://images.unsplash.com/photo-1785144983450-0316fad05c9e?w=400",
    description:
      "Brisk mint and charcoal cleanser that brightens and refreshes tired skin.",
    stock: 22,
  },
];

export default products;
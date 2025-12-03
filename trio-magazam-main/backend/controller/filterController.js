import { Product } from "../model/Product.js"; // Yolu yoxlayın

export const getFilterControllers = async (req, res) => {
  try {
    let filter = {};
    const { category, price } = req.query;

    // Kateqoriya üçün filter (enum dəyəri: "Children", "Men", "Women")
    if (category) {
      // Dəqiq uyğunluq: query-də göndərdiyiniz dəyərin modeldəki kimi olduğuna əmin olun.
      filter.category = category;
    }

    // Qiymət aralığı üçün filter, məsələn: "100-500"
    if (price) {
      const [min, max] = price.split("-").map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        filter.price = { $gte: min, $lte: max };
      }
    }

    // Məlumat bazasından filter-ə uyğun məhsulları gətiririk
    const products = await Product.find(filter);

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err) {
    console.error("Filter controller error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

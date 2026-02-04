const { getAllCategories,deleteCategory,createCategory, getCategoryById } = require("../service/category.service");
]
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.render("categories/list", { categories });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).render("error", {
            message: "Error fetching products. Please try again.",
        });
    }
};


exports.createCategory = async (req, res) => {
    try {
        const { name, price, quantity } = req.body;

        // Validation
        if (!name) {
            return res.status(400).render("error", {
                message: "Name is required.",
            });
        }       
        // Create product in DynamoDB
        const categoryData = {
            name,
            description
        };

        const newCategory = await createCategory(categoryData)
        res.redirect("/");
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).render("error", {
            message: "Error creating category. Please try again.",
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Get product to find image URL
        const category = await getCategoryById(id);
        if (!category) {
            return res.status(404).render("error", {
                message: "Category not found.",
            });
        }

        await deleteCategory(id);
        res.redirect("/");
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).render("error", {
            message: "Error deleting category. Please try again.",
        });
    }
};


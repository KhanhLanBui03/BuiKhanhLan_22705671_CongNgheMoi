const {
    getAllProduct,
    getProductById,
    upsertProduct,
    deleteProductById
} = require("../services/product-service");


// const renderItem = async (req,res)=>{
//     const data = await getAllProduct();
//     res.render("index", { products: data })
// }
const renderItem = async (req, res) => {
    const data = await getAllProduct(req.query);
    res.render("index", { products: data });
};
const renderForm = async (req,res)=>{
    const {id} = req.params;
    const product = id ? await getProductById(id) : null;
    res.render("form", { product })
}
const handleUpsert = async (req,res)=>{
    const { id } = req.params;
    const { name, price } = req.body;
    const file = req.file;
    await upsertProduct(id, { name, price }, file);
    res.redirect("/");
}
const detailItem = async (req,res)=>{
    const { id } = req.params;
    const data = await getProductById(id);
    res.render("detail", { product: data })
}
const deleteItem = async (req,res)=>{
    const { id } = req.params;
    await deleteProductById(id);
    res.redirect("/");
}
module.exports = {
    renderItem,
    detailItem,
    deleteItem,
    renderForm,
    handleUpsert
};
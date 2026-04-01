const { getAllRoom, getRoomById, deleteRoom, upsertRoom, countAvailableByType } = require("../services/hotel-service")


const renderRooms = async (req, res) => {
    const rooms = await getAllRoom(req.query)
    const availableCount = await countAvailableByType()
    res.render("index", {
        rooms,
        availableCount,
        search: req.query.search || "",
        roomType: req.query.roomType || "",
        status: req.query.status || ""
    })
}
const renderForm = async (req, res) => {
    const room = req.params.roomId ? await getRoomById(req.params.roomId) : null
    res.render("form", {room})
}
const renderDetail = async (req, res) => {
    const room = await getRoomById(req.params.roomId)
    if(!room){
        return res.status(404).send("Room not found")
    }
    res.render("detail", {room})
}
const handleUpsert = async (req, res) => {
    try {
        const {roomId} = req.params
        await upsertRoom(roomId, req.body, req.file)
        res.redirect("/")
    }catch (error) {
        res.status(400).send(error.message)
    }
}
const handleDelete = async (req, res) => {
    try {
        const {roomId} = req.params
        await deleteRoom(roomId)
        res.redirect("/")
    }catch (error) {
        res.status(400).send(error.message)
    }
}
module.exports = {
    renderRooms,
    renderForm,
    renderDetail,
    handleUpsert,
    handleDelete
}

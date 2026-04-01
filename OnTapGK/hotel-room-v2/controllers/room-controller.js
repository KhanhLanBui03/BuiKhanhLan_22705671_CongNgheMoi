const { getAllRooms, getRoomById, deleteRoomById, upsertRoom } = require("../services/room-service")


const renderIndex = async (req, res) => {
    const rooms = await getAllRooms(req.query)
    res.render("index", {
        rooms,
        search: req.query.search || "",
        roomType: req.query.roomType || "",
        status: req.query.status || ""
    })
}
const renderForm = async (req, res) => {
    const { roomId } = req.params
    const room = roomId ? await getRoomById(roomId) : null
    res.render("form", {
        room
    })
}
const handleUpsert = async (req, res) => {
    const { roomId } = req.params
    await upsertRoom(roomId, req.body, req.file)
    res.redirect("/")
}
const renderDetail = async (req, res) => {
    const { roomId } = req.params
    const room = await getRoomById(roomId)
    res.render("detail", {
        room
    })
}
const handleDelete = async (req, res) => {
    const { roomId } = req.params
    await deleteRoomById(roomId)
    res.redirect("/")
}
module.exports = {
    renderIndex,
    renderForm,
    handleUpsert,
    renderDetail,
    handleDelete
}
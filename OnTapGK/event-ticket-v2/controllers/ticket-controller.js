const { getAllTickets, getTicketById } = require("../services/ticket-service")

const renderIndex = async (req, res) => {
    const tickets = await getAllTickets(req.query)
    res.render("index", {tickets,
        search: req.query.search || "",
        status: req.query.status || ""
    })
}
const renderDetail = async (req,res)=>{
    const {ticketId} = req.params
    const room = await getTicketById(ticketId)
    res.render("detail", {room})
}

const renderForm = async (req,res)=>{
    const {ticketId} = req.params
    const ticket = ticketId ? await getTicketById(ticketId) : null
    res.render("form", {ticket})
}
const handleUpsert = async (req,res)=>{
    const {ticketId} = req.params
    const result = await upsertTicket(ticketId, req.body, req.file)
    if(!result) return res.status(404).send("Ticket not found")
    res.redirect("/")
}
const handleDelete = async (req,res)=>{
    const {ticketId} = req.params
    const result = await deleteTicket(ticketId)
    if(!result) return res.status(404).send("Ticket not found")
    res.redirect("/")
}
module.exports = {
    renderIndex,
    renderDetail,
    renderForm,
    handleUpsert,
    handleDelete
}
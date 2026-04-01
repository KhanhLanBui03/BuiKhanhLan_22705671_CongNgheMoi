const { getAllTicket, getTicketById, upsertTicket, deleteTicket } = require("../services/ticket-service")

const renderTicket = async (req, res) => {
    const data = await getAllTicket(req.query)
    res.render("index", {
        tickets: data,
        search: req.query.search || "",
        statusFilter: req.query.status || ""
    })
}

const renderTicketById = async (req, res) => {
    const { ticketId } = req.params
    const data = await getTicketById(ticketId)
    if (!data) return res.redirect("/")
    res.render("detail", { ticket: data })
}

const renderForm = async (req, res) => {
    const { ticketId } = req.params
    const ticket = ticketId ? await getTicketById(ticketId) : null
    res.render("form", { ticket })
}

const handleUpsert = async (req, res) => {
    try {
        const { ticketId } = req.params
        const { eventName, holderName, category, quantity, pricePerTicket, eventDate, status } = req.body
        const file = req.file
        await upsertTicket(
            ticketId,
            { eventName, holderName, category, quantity, pricePerTicket, eventDate, status },
            file
        )
        res.redirect("/")
    } catch (err) {
        res.status(400).send(`<h2>Lỗi: ${err.message}</h2><a href="javascript:history.back()">← Quay lại</a>`)
    }
}

const handleDelete = async (req, res) => {
    const { ticketId } = req.params
    await deleteTicket(ticketId)
    res.redirect("/")
}

module.exports = {
    handleDelete,
    handleUpsert,
    renderForm,
    renderTicket,
    renderTicketById
}
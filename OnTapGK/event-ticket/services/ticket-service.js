const { ScanCommand, GetCommand, PutCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb")
const { docClient, s3Client } = require("../config/aws")
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3")

const TableName = process.env.TABLE_NAME
const Bucket = process.env.BUCKET_NAME

// ─── Tính giảm giá ──────────────────────────────────────────────
// VIP + quantity >= 4  → giảm 10%
// VVIP + quantity >= 2 → giảm 15%
// Còn lại             → không giảm
function calcAmounts(category, quantity, pricePerTicket) {
    const qty = Number(quantity) || 0
    const price = Number(pricePerTicket) || 0
    const totalAmount = qty * price

    let discountRate = 0
    if (category === "VIP" && qty >= 4) discountRate = 0.10
    if (category === "VVIP" && qty >= 2) discountRate = 0.15

    const finalAmount = totalAmount * (1 - discountRate)
    return { totalAmount, finalAmount, discountRate }
}

// ─── Lấy tất cả vé (có tìm kiếm + lọc status) ───────────────────
const getAllTicket = async (query) => {
    const data = await docClient.send(new ScanCommand({ TableName }))
    let items = data.Items || []

    if (query.search) {
        const keyword = query.search.toLowerCase()
        items = items.filter(i =>
            (i.eventName || "").toLowerCase().includes(keyword) ||
            (i.holderName || "").toLowerCase().includes(keyword)
        )
    }

    if (query.status) {
        items = items.filter(i => i.status === query.status)
    }

    return items
}

// ─── Lấy vé theo ID ─────────────────────────────────────────────
const getTicketById = async (ticketId) => {
    const data = await docClient.send(new GetCommand({ TableName, Key: { ticketId } }))
    return data.Item
}

// ─── Thêm mới / Cập nhật vé ─────────────────────────────────────
const upsertTicket = async (ticketId, body, file) => {
    const { eventName, holderName, category, quantity, pricePerTicket, eventDate, status } = body

    // Validation
    if (Number(quantity) <= 0) throw new Error("Số lượng phải lớn hơn 0")
    if (Number(pricePerTicket) <= 0) throw new Error("Đơn giá phải lớn hơn 0")
    if (new Date(eventDate) < new Date()) throw new Error("Ngày sự kiện không được nhỏ hơn ngày hiện tại")

    const validCategory = ["Standard", "VIP", "VVIP"]
    if (!validCategory.includes(category)) throw new Error("Category không hợp lệ (Standard / VIP / VVIP)")

    const validStatus = ["Upcoming", "Sold", "Cancelled"]
    if (!validStatus.includes(status)) throw new Error("Status không hợp lệ (Upcoming / Sold / Cancelled)")

    // Tính thành tiền + giảm giá
    const { totalAmount, finalAmount, discountRate } = calcAmounts(category, quantity, pricePerTicket)

    // Xây dựng ticketData
    let ticketData = {
        ticketId: ticketId ?? String(Date.now()),
        eventName, holderName, category,
        quantity: Number(quantity),
        pricePerTicket: Number(pricePerTicket),
        eventDate, status,
        totalAmount, finalAmount, discountRate,
        createdAt: Date.now()
    }

    // Nếu update → giữ createdAt gốc
    if (ticketId) {
        const existing = await docClient.send(new GetCommand({ TableName, Key: { ticketId } }))
        if (existing.Item) {
            ticketData = {
                ...existing.Item,
                eventName, holderName, category,
                quantity: Number(quantity),
                pricePerTicket: Number(pricePerTicket),
                eventDate, status,
                totalAmount, finalAmount, discountRate
            }
        }
    }

    // Xử lý upload ảnh S3
    if (file) {
        const key = `${Date.now()}-${file.originalname}`
        await s3Client.send(new PutObjectCommand({
            Bucket, Key: key,
            Body: file.buffer,
            ContentType: file.mimetype
        }))
        const imageUrl = `https://${Bucket}.s3.amazonaws.com/${key}`

        // Xóa ảnh cũ nếu có
        if (ticketData.imageUrl) {
            await s3Client.send(new DeleteObjectCommand({
                Bucket,
                Key: ticketData.imageUrl.split("/").pop()
            }))
        }
        ticketData.imageUrl = imageUrl
    }

    await docClient.send(new PutCommand({ TableName, Item: ticketData }))
    return ticketData
}

// ─── Xóa vé ─────────────────────────────────────────────────────
const deleteTicket = async (ticketId) => {
    const data = await docClient.send(new GetCommand({ TableName, Key: { ticketId } }))
    if (data.Item?.imageUrl) {
        await s3Client.send(new DeleteObjectCommand({
            Bucket,
            Key: data.Item.imageUrl.split("/").pop()
        }))
    }
    await docClient.send(new DeleteCommand({ TableName, Key: { ticketId } }))
}

module.exports = {
    upsertTicket,
    getAllTicket,
    getTicketById,
    deleteTicket
}
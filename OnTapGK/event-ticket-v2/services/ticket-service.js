const { ScanCommand, GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb")
const { docClient, s3Client } = require("../config/aws")
const { DeleteObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3")
const TableName = process.env.TABLE_NAME
const Bucket = process.env.BUCKET_NAME
const getAllTickets = async (query) => {
    const data = await docClient.send(new ScanCommand({
        TableName
    }))
    let tickets = data.Items || []

    if(query.search){
        const keyword = query.search.toLowerCase()
        tickets = tickets.filter(ticket => ticket.eventName.toLowerCase().includes(keyword) ||
        ticket.holderName.toLowerCase().includes(keyword))
    }
    if (query.status){
        tickets = tickets.filter(ticket => ticket.status === query.status)
    }
    return tickets

}
const getTicketById = async (ticketId) => {
    const data = await docClient.send(new GetCommand({
        TableName,
        Key:{ticketId}
    }))
    return data.Item
}
const deleteTicket = async (ticketId)=>{
    const data = await docClient.send(new GetCommand({
        TableName,
        Key:{ticketId}
    }))
    if(!data.Item) return null
    if(data.Item?.imageUrl){
        await s3Client.send(new DeleteObjectCommand({
            Bucket,
            Key: data.Item.imageUrl.split("/").pop()
        }))
    }
    await docClient.send(new DeleteCommand({
        TableName,
        Key:{ticketId}
    }))
    
}
const upsertTicket = async (ticketId, body, file)=>{
    const { eventName, holderName, category, quantity, pricePerTicket, eventDate, status } = body
    let ticketData = {
        ticketId: ticketId || Date.now().toString(),
        eventName,
        holderName,
        category,
        quantity: Number(quantity),
        pricePerTicket: Number(pricePerTicket),
        eventDate,
        status,
        createAt: Date.now().toString()
    }
    if(ticketId){
        const existingTicket = await getTicketById(ticketId)
        if(!existingTicket) return null
        ticketData = {...existingTicket,
            eventName,
            holderName,
            category,
            quantity: Number(quantity),
            pricePerTicket: Number(pricePerTicket),
            eventDate,
            status,
         }
    }
    if(file){
        const key = `${Date.now()}-${file.originalname}`
        await s3Client.send(new PutObjectCommand({
            Bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype
        }))
        const imageUrl = `https://${Bucket}.s3.amazonaws.com/${key}`
        if(ticketId && ticketData.imageUrl){
            await s3Client.send(new DeleteObjectCommand({
                Bucket,
                Key: ticketData.imageUrl.split("/").pop()
            }))
        }
        ticketData.imageUrl = imageUrl
    }
    await docClient.send(new PutCommand({
        TableName,
        Item: ticketData
    }))
}

module.exports = {
    getAllTickets,
    getTicketById,
    deleteTicket,
    upsertTicket
}

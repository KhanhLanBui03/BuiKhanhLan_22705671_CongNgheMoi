const { ScanCommand, GetCommand, PutCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb")
const { docClient,s3Client } = require("../config/aws")
const { DeleteObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3")

const TableName = process.env.TABLE_NAME
const Bucket = process.env.BUCKET_NAME

const getAllRoom = async (query) =>{
    const data = await docClient.send(new ScanCommand({TableName}))
    let items = data.Items || []
    if(query.search){
        const keyword = query.search.toLowerCase()
        items = items.filter(item => item.roomName.toLowerCase().includes(keyword))
    }
    if(query.roomType){
        items = items.filter(item => item.roomType === query.roomType)
    }
    if(query.status){
        items = items.filter(item=>item.status == query.status)
    }
    return items
}
const getRoomById = async (roomId) => {
    if(!roomId) return null
    const data = await docClient.send(new GetCommand({
        TableName,
        Key: {roomId: roomId}
    }))
    return data.Item
}
function calcRevenue(pricePerNight) {
    return Number(pricePerNight || 0) * 3
}
const upsertRoom = async (roomId,body,file) => {
    const {roomName, roomType, pricePerNight, capacity, status, imageUrl} = body
    if(!roomName || roomName.trim()===""){
        throw new Error("Room name is required")
    }
    if(pricePerNight <= 0){
        throw new Error("Price per night must be greater than 0")
    }
    if(capacity <= 0 || capacity > 10){
        throw new Error("Capacity must be a positive number and not exceed 10")
    }
    const validationRoomTypes = ["Standard", "Deluxe", "Suite"];
    if(!validationRoomTypes.includes(roomType)){
        throw new Error("Invalid room type. Valid types are: Standard, Deluxe, Suite")
    }
    const validationStatus = ["Available", "Occupied", "Maintenance"];
    if(!validationStatus.includes(status)){
        throw new Error("Invalid status. Valid statuses are: Available, Occupied, Maintenance")
    }
    const revenue3Night = calcRevenue(pricePerNight)
    let roomData = {
        roomId: roomId || Date.now().toString(),
        roomName,
        roomType,
        pricePerNight: Number(pricePerNight),
        capacity,
        status,
        revenue3Night,
        createAt: Date.now(),
    }
    if (roomId) {
        const existing = await docClient.send(new GetCommand({ TableName, Key: { roomId } }))
        if (existing.Item) {
            roomData = {
                ...existing.Item,
                roomName: roomName.trim(),
                roomType,
                pricePerNight: Number(pricePerNight),
                capacity: capacity,
                status,
                revenue3Night
            }
        }
    }
    if (file) {
        const key = `${Date.now()}-${file.originalname}`
        await s3Client.send(new PutObjectCommand({
            Bucket, Key: key,
            Body: file.buffer,
            ContentType: file.mimetype
        }))
        // Xóa ảnh cũ
        if (roomData.imageUrl) {
            await s3Client.send(new DeleteObjectCommand({
                Bucket, Key: roomData.imageUrl.split("/").pop()
            })).catch(() => { })
        }
        roomData.imageUrl = `https://${Bucket}.s3.amazonaws.com/${key}`
    }

    await docClient.send(new PutCommand({ TableName, Item: roomData }))
    return roomData
}
const deleteRoom = async (roomId) => {
    if(!roomId) return false
    const existing = await docClient.send(new GetCommand({ TableName, Key: { roomId } }))
    if (!existing.Item) return false
    if (existing.Item.imageUrl) {
        await s3Client.send(new DeleteObjectCommand({
            Bucket, Key: existing.Item.imageUrl.split("/").pop()
        })).catch(() => { })
    }
    await docClient.send(new DeleteCommand({ TableName, Key: { roomId } }))
    return true
}
const VALID_TYPES = ["Standard", "Deluxe", "Suite"]
const countAvailableByType = async () => {
    const data = await docClient.send(new ScanCommand({ TableName }))
    const items = (data.Items || []).filter(r => r.status === "Available")
    const result = {}
    VALID_TYPES.forEach(t => { result[t] = 0 })
    items.forEach(r => { if (result[r.roomType] !== undefined) result[r.roomType]++ })
    return result
}
module.exports = {
    getAllRoom,
    getRoomById,
    upsertRoom,
    deleteRoom,
    countAvailableByType
}
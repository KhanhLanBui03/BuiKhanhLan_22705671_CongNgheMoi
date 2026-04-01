const { ScanCommand, GetCommand, DeleteCommand, PutCommand } = require("@aws-sdk/lib-dynamodb")
const { docClient, s3Client } = require("../config/aws")
const { DeleteObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3")

const TableName = process.env.TABLE_NAME
const Bucket= process.env.BUCKET_NAME
const getAllRooms =async(query)=>{
    const data = await docClient.send(new ScanCommand({
        TableName
    }))
    let items = data.Items || []
    if(query.search){
        keyword = query.search.toLowerCase();
        items = items.filter(item=>item.roomName.toLowerCase().includes(keyword))
    }
    if(query.roomType){
        items = items.filter(item=>item.roomType === query.roomType)
    }
    if(query.status){
        items = items.filter(item=>item.status === query.status)
    }
    return items;
}

const getRoomById = async(roomId)=>{
    if(!roomId) return null
    const data = await docClient.send(new GetCommand({
        TableName,
        Key: {roomId}
    }))
    return data.Item
}

const deleteRoomById = async(roomId)=>{
    const data = await docClient.send(new GetCommand({
        TableName,
        Key: {roomId}
    }))
    if(!data.Item) return null
    if(data.Item.imageUrl){
        await s3Client.send(new DeleteObjectCommand({
            Bucket,
            Key: data.Item.imageUrl.split("/").pop()
        }))
    }
    await docClient.send(new DeleteCommand({
        TableName,
        Key: {roomId}
    }))
    
}
const countRevenue = (pricePerNight)=>{
    return pricePerNight * 3
}
const upsertRoom = async(roomId, body, file)=>{
    const {roomName, roomType,pricePerNight,capacity, status} = body
    const revenue3Night = countRevenue(pricePerNight)
    let roomData = {
        roomId: roomId ?? Date.now().toString(),
        roomName,
        roomType,
        pricePerNight:Number(pricePerNight),
        capacity:Number(capacity),
        status,
        revenue3Night,
        createAt:  Date.now().toString()
    }
    if(roomId){
        const data = await docClient.send(new GetCommand({
            TableName,
            Key: {roomId}}))
        if(!data.Item) return null
        roomData = {...data.Item,roomName, roomType, pricePerNight:Number(pricePerNight), capacity:Number(capacity), status, revenue3Night}
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
        if(roomData.imageUrl){
            await s3Client.send(new DeleteObjectCommand({
                Bucket,
                Key: roomData.imageUrl.split("/").pop()
            }))
        }
        roomData.imageUrl = imageUrl
    }

    await docClient.send(new PutCommand({
        TableName,
        Item: roomData
    }))
   
}

module.exports = {
    getAllRooms,
    getRoomById,
    deleteRoomById,
    upsertRoom,
}
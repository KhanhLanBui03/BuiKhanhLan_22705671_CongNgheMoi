const { ScanCommand } = require("@aws-sdk/lib-dynamodb");;
const { docClient } = require("../config/aws");
const { GetCommand } = require("@aws-sdk/lib-dynamodb");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { PutCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { s3Client } = require("../config/aws");

const TableName = process.env.TABLE_NAME;
const Bucket = process.env.BUCKET_NAME;

// const getAllProduct = async () => {
//     const data = await docClient.send(new ScanCommand({
//         TableName
//     }));
//     return data.Items;
// }
const getAllProduct = async (query) => {
    const data = await docClient.send(new ScanCommand({ TableName }));

    let items = data.Items || [];

    // 🔍 SEARCH
    if (query.search) {
        const keyword = query.search.toLowerCase();
        items = items.filter(p =>
            p.name.toLowerCase().includes(keyword)
        );
    }

    // 🔃 SORT
    if (query.sort === "price_asc") {
        items.sort((a, b) => a.price - b.price);
    }

    if (query.sort === "price_desc") {
        items.sort((a, b) => b.price - a.price);
    }

    return items;
};
const getProductById = async (id) => {
    const data = await docClient.send(new GetCommand({
        TableName,
        Key:{ id }
    }));
    return data.Item;
}
const upsertProduct = async (id, body, file) => {
    const { name, price } = body;

    // 2.1 Tạo payload TH1 Create
    let productData = { id: id ?? Date.now().toString(), name, price };

    // 2.2 Tạo payload TH2 Update
    if (id) {
        const data = await docClient.send(
            new GetCommand({
                TableName,
                Key: { id },
            }),
        );
        if (data.Item) productData = { ...data.Item, name, price };
    }

    // 3. Cập nhật s3
    if (file) {
        // 3.1 Upload ảnh
        const key = `${Date.now()}-${file.originalname}`;
        await s3Client.send(
            new PutObjectCommand({
                Bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            }),
        );
        const image = `https://${Bucket}.s3.amazonaws.com/${key}`;

        // 3.2 Xóa ảnh nếu có
        if (productData.image) {
            await s3Client.send(
                new DeleteObjectCommand({
                    Bucket,
                    Key: productData.image.split("/").pop(),
                }),
            );
        }

        // 3.3 Cập nhật payload
        productData.image = image;
    }

    // 4.
    await docClient.send(
        new PutCommand({
            TableName,
            Item: productData,
        }),
    );
};
const deleteProductById = async (id) => {
    const data = await docClient.send(new GetCommand({
        TableName,
        Key: { id }
    }));
    if(data.Item?.image){
        await s3Client.send(new DeleteObjectCommand({
            Bucket,
            Key: data.Item.image.split("/").pop(),
        }))
    }
    await docClient.send(new DeleteCommand({
        TableName,
        Key: { id }
    }))
}
module.exports = {
    getAllProduct,
    getProductById,
    deleteProductById,
    upsertProduct
}
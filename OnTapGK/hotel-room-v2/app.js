
require("dotenv").config()
const express = require("express")
const multer = require("multer")
const app = express()

app.use(express.urlencoded({ extended: true }))
const upload = multer({storage: multer.memoryStorage()});
const PORT = process.env.PORT || 3000



const roomController = require("./controllers/room-controller")
app.set("view engine", "ejs")
app.set("views", "./views");
app.get("/", roomController.renderIndex)
app.get("/rooms", roomController.renderForm)
app.get("/rooms/:roomId", roomController.renderForm)
app.get("/rooms/detail/:roomId", roomController.renderDetail)
app.post("/rooms/:roomId", upload.single("imageUrl"), roomController.handleUpsert)
app.post("/rooms", upload.single("imageUrl"), roomController.handleUpsert)
app.post("/rooms/delete/:roomId", roomController.handleDelete)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
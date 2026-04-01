require("dotenv").config();
const express = require("express");
const multer = require("multer");
const app = express();

app.use(express.urlencoded({ extended: true }));
const upload = multer({ storage: multer.memoryStorage() });

// views
app.set("view engine", "ejs");
app.set("views", "./views");

const PORT = process.env.PORT || 3000;

const hotelController = require("./controllers/hotel-controller")

app.get("/rooms",hotelController.renderRooms)
app.get("/rooms/form", hotelController.renderForm)
app.get("/rooms/detail/:roomId", hotelController.renderDetail) 
app.get("/rooms/form/:roomId", hotelController.renderForm)
app.post("/rooms", upload.single("imageUrl"), hotelController.handleUpsert)
app.post("/rooms/:roomId", upload.single("imageUrl"), hotelController.handleUpsert)
app.post("/rooms/delete/:roomId", hotelController.handleDelete)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
}
)

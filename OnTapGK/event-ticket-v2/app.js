require("dotenv").config()
const express = require("express")
const multer = require("multer")
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
const upload = multer({storage: multer.memoryStorage()})

app.set("view engine", "ejs")
app.set("views", "./views")



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
const express = require("express");
const dotenv = require("dotenv");
const conncetDatabase = require("./helpers/database/connectDatabase");
const routers = require("./routers/index.js");
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
const path = require("path");

//Enviroment Variables
dotenv.config({
    path: "./config/env/config.env"
});

//mogodb connceting
conncetDatabase();


const app = express();

//express-bodymiddleware
app.use(express.json());


const PORT= process.env.PORT;

//routers middleware
app.use("/api",routers);

//error handler
app.use(customErrorHandler);

//static files --> kullanıcıdan alınan veriler gibi fotoğraf vb
//burda express static dosyalarının yerini söylüyoruz
// path kütüphanesiyle dirname yani prjenin olduğu yerdeki public klasöründe 
app.use(express.static(path.join(__dirname,"public")))


app.listen(PORT,()=>{
    console.log(`app started on: ${PORT}: ${process.env.NODE_ENV}`);
})
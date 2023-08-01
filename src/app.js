import express from "express";
import cors from "cors";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { dirname } from "./path.js";

import ProductManager from "./models/product-manager.js";
import Product from "./models/product.js";

const app = express();
const port = 8080;

const httpServer = app.listen(port, () => {
    console.log(`Server running in port: ${port}`);
});

const socketServer = new Server(httpServer);

app.use(cors());
app.use(express.json());
app.use(express.static(`${dirname}/public`));

app.engine("handlebars", handlebars.engine());

app.set("views", `${dirname}/views`);
app.set("view engine", "handlebars");

const productManager = new ProductManager();
const products = productManager.getProducts();

socketServer.on("connection", socket => {
    console.log(`Cliente conectado ${socket.id}`);
    socketServer.emit("products", products);

    socket.on("form-data", ({ title, description, price, code, stock }) => {
        productManager.addProduct(new Product(title, description, price, "sin imagen", code, stock));
        socket.emit("products", products);
    });
});

app.get("/", (req, res) => {
    res.render('home', {
        title: 'Productos',
        products
    });
});

app.get("/realtimeproducts", (req, res) => {
    res.render('realTimeProducts', {
        title: 'Productos con WebSockets',
    })
});
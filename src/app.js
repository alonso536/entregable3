import express from "express";
import ProductManager from "./product-manager.js";

const app = express();
const port = 8080;

const productManager = new ProductManager();

app.get("/products", (req, res) => {
    const { limit } = req.query;
    let products = productManager.getProducts();

    if(limit) {
        products = products.slice(0, limit);
    }

    return res.status(200).json({
        products
    });
});

app.get("/products/:id", (req, res) => {
    const { id } = req.params;
    
    try {
        const product = productManager.getProductById(Number(id));

        return res.status(200).json({
            product
        });
    } catch(error) {
        return res.status(404).json({
            msg: `No se  encontró un producto con el id ${id}`
        });
    }
    
});

app.listen(port, () => {
    console.log(`Server running in port: ${port}`);
});
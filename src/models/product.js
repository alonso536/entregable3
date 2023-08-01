class Product {
    static increments = 0;

    constructor(title, description, price, thumbnail, code, stock) {
        this.id = ++Product.increments;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

export default Product;

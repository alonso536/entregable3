const form = document.querySelector("form");
const divErrors = [...document.querySelectorAll(".div-error")];
const tableProducts = document.querySelector("#products");

let codes = [];

const socket = io();

socket.on("connect", () => {
    console.log("Conectado");
});

socket.on("disconnect", () => {
    console.log("Desconectado");
});

socket.on("products", data => {
    let html = "";

    data.forEach(({ id, title, description, price, code, stock }) => {
        codes.push(code);
        html += `
            <tr>
                <td>${id}</td>
                <td>${title}</td>
                <td>${description}</td>
                <td>${price}</td>
                <td>${code}</td>
                <td>${stock}</td>
            </tr>
        `;
    });

    tableProducts.innerHTML = html;
});

const clearErrors = errors => {
    errors.forEach(error => {
        error.innerText = "";
    });
}

const validate = ({ title, description, price, code, stock }) => {
    const errors = {};

    if(!title) {
        divErrors[0].innerHTML = "<small>El título es obligatorio</small>";
        errors.title = false;
    } 
    
    if(!description) {
        divErrors[1].innerHTML = "<small>La descripción es obligatoria</small>";
        errors.description = false;
    } 
    
    if(!price) {
        divErrors[2].innerHTML = "<small>La precio es obligatorio</small>";
        errors.price = false;
    } else if(isNaN(price)) {
        divErrors[2].innerHTML = "<small>La precio debe ser un número</small>";
        errors.price = false;
    } 
    
    if(!code) {
        divErrors[3].innerHTML = "<small>El código es obligatorio</small>";
        errors.code = false;
    } else if(codes.includes(code)) {
        divErrors[3].innerHTML = "<small>El código ya está en uso</small>";
        errors.code = false;
    } 
    
    if(!stock) {
        divErrors[4].innerHTML = "<small>El stock es obligatorio</small>";
        errors.price = false;
    } else if(isNaN(stock)) {
        divErrors[4].innerHTML = "<small>El stock debe ser un número</small>";
        errors.price = false;
    }

    return errors;
}

form.addEventListener("submit", e => {
    e.preventDefault();
    clearErrors(divErrors);

    const title = document.querySelector("#title").value;
    const description = document.querySelector("#description").value;
    const price = document.querySelector("#price").value;
    const code = document.querySelector("#code").value;
    const stock = document.querySelector("#stock").value;

    const data = { title, description, price, code, stock }
    const validation = validate(data);

    if(Object.keys(validation).length === 0) {
        socket.emit("form-data", data);

        clearErrors(divErrors);
        form.reset();
    }
});
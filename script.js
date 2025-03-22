document.addEventListener("DOMContentLoaded", function() {
    const consoleWindow = document.querySelector(".console-window");
    const consoleContent = document.getElementById("console");
    const consoleInput = document.getElementById("console-input");

    let cart = [];
    const products = [
        { name: "Laptop", price: 15000000 },
        { name: "Mouse", price: 250000 },
        { name: "Keyboard", price: 500000 },
        { name: "Monitor", price: 2000000 },
        { name: "Headset", price: 750000 }
    ];

    // Fokus input saat klik konsol
    consoleWindow.addEventListener("click", () => consoleInput.focus());

    // Event Listener untuk Input Konsol
    consoleInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            let command = consoleInput.value.trim();
            processCommand(command);
            consoleInput.value = "";
        }
    });

    function processCommand(command) {
        let response = "";

        if (command.toLowerCase() === "list") {
            response = "Available Products:\n";
            products.forEach((p, i) => {
                response += `(${i + 1}) ${p.name} - Rp${p.price.toLocaleString()}\n`;
            });
        } else if (command.toLowerCase().startsWith("buy ")) {
            let productName = command.substring(4);
            let product = products.find(p => p.name.toLowerCase() === productName.toLowerCase());

            if (product) {
                cart.push(product);
                response = `${product.name} added to cart.`;
            } else {
                response = "Product not found.";
            }
        } else if (command.toLowerCase() === "cart") {
            if (cart.length === 0) {
                response = "Your cart is empty.";
            } else {
                response = "Your Cart:\n";
                let total = 0;
                cart.forEach((item, i) => {
                    response += `(${i + 1}) ${item.name} - Rp${item.price.toLocaleString()}\n`;
                    total += item.price;
                });
                response += `Total: Rp${total.toLocaleString()}`;
            }
        } else if (command.toLowerCase() === "checkout") {
            if (cart.length === 0) {
                response = "Your cart is empty. Add products first!";
            } else {
                response = "Processing payment...\nTransaction successful!";
                cart = [];
            }
        } else if (command.toLowerCase() === "clear") {
            consoleContent.innerHTML = "";
            return;
        } else {
            response = `'${command}' is not recognized as a command. Type 'list' to see available products.`;
        }

        consoleContent.innerHTML += `\n<span class="prompt">C:\\Store></span> ${command}\n${response}\n`;
        consoleWindow.scrollTop = consoleWindow.scrollHeight;
    }
});

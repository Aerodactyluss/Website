document.addEventListener("DOMContentLoaded", function() {
    const consoleWindow = document.querySelector(".console-window");
    const consoleContent = document.getElementById("console");
    const consoleInput = document.getElementById("console-input");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let purchaseHistory = JSON.parse(localStorage.getItem("history")) || [];
    let isOnline = navigator.onLine;

    const products = [
        { name: "Laptop", price: 15000000, desc: "Laptop high-performance untuk gaming & kerja" },
        { name: "Mouse", price: 250000, desc: "Mouse wireless dengan DPI tinggi" },
        { name: "Keyboard", price: 500000, desc: "Mechanical keyboard dengan switch clicky" },
        { name: "Monitor", price: 2000000, desc: "Monitor 144Hz Full HD untuk gaming" },
        { name: "Headset", price: 750000, desc: "Headset noise-cancelling dengan mic" }
    ];

    function updateNetworkStatus() {
        isOnline = navigator.onLine;
        let statusMessage = isOnline ? "Online Mode Activated." : "Offline Mode Activated.";
        consoleContent.innerHTML += `\n[INFO] ${statusMessage}\n`;
    }
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);
    updateNetworkStatus();

    consoleWindow.addEventListener("click", () => consoleInput.focus());

    consoleInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            let command = consoleInput.value.trim();
            processCommand(command);
            consoleInput.value = "";
        }
    });

    function processCommand(command) {
        let response = "";

        if (command.toLowerCase() === "help") {
            response = "Available Commands:\n" +
                "📜 help - Menampilkan daftar command\n" +
                "📦 list - Menampilkan daftar produk\n" +
                "🛒 buy [nama produk] - Membeli produk\n" +
                "📋 cart - Menampilkan isi keranjang\n" +
                "✅ checkout - Melakukan pembayaran\n" +
                "📜 history - Melihat riwayat pembelian\n" +
                "🔍 search [kata kunci] - Mencari produk\n" +
                "ℹ️ info [nama produk] - Melihat detail produk\n" +
                "💰 apply [kode promo] - Menggunakan kode promo\n" +
                "🧹 clear - Membersihkan layar";
        } else if (command.toLowerCase() === "list") {
            response = "Available Products:\n";
            products.forEach((p, i) => {
                response += `(${i + 1}) ${p.name} - Rp${p.price.toLocaleString()}\n`;
            });
        } else if (command.toLowerCase().startsWith("buy ")) {
            let productName = command.substring(4);
            let product = products.find(p => p.name.toLowerCase() === productName.toLowerCase());

            response = product ? `${product.name} added to cart.` : "Product not found.";
            if (product) {
                cart.push(product);
                localStorage.setItem("cart", JSON.stringify(cart));
            }
        } else if (command.toLowerCase() === "cart") {
            response = cart.length === 0 ? "Your cart is empty." : "Your Cart:\n";
            let total = 0;
            cart.forEach((item, i) => {
                response += `(${i + 1}) ${item.name} - Rp${item.price.toLocaleString()}\n`;
                total += item.price;
            });
            if (cart.length > 0) response += `Total: Rp${total.toLocaleString()}`;
        } else if (command.toLowerCase() === "checkout") {
            response = cart.length === 0 ? "Your cart is empty. Add products first!" :
                "Processing payment...\n█▒▒▒▒▒▒▒▒▒▒ 10%\n███▒▒▒▒▒▒▒▒ 30%\n█████▒▒▒▒▒▒ 50%\n███████▒▒▒▒ 70%\n█████████▒▒ 90%\n██████████ 100%\nTransaction successful!";
            if (cart.length > 0) {
                purchaseHistory = purchaseHistory.concat(cart);
                localStorage.setItem("history", JSON.stringify(purchaseHistory));
                cart = [];
                localStorage.removeItem("cart");
            }
        } else if (command.toLowerCase() === "history") {
            response = purchaseHistory.length === 0 ? "No purchase history found." : "Purchase History:\n";
            purchaseHistory.forEach((item, i) => {
                response += `(${i + 1}) ${item.name} - Rp${item.price.toLocaleString()}\n`;
            });
        } else if (command.toLowerCase().startsWith("info ")) {
            let productName = command.substring(5);
            let product = products.find(p => p.name.toLowerCase() === productName.toLowerCase());

            response = product ? `${product.name}: ${product.desc}` : "Product not found.";
        } else if (command.toLowerCase().startsWith("search ")) {
            let keyword = command.substring(7).toLowerCase();
            let results = products.filter(p => p.name.toLowerCase().includes(keyword));

            response = results.length > 0 ? "Search Results:\n" + results.map(p => `${p.name} - Rp${p.price.toLocaleString()}`).join("\n") : "No matching products found.";
        } else if (command.toLowerCase().startsWith("apply ")) {
            let promoCode = command.substring(6).toLowerCase();
            let discount = 0;

            if (promoCode === "diskon50") {
                discount = 0.5;
            } else if (promoCode === "diskon10") {
                discount = 0.1;
            }

            response = discount > 0 ? `Promo applied! New Total: Rp${(cart.reduce((sum, item) => sum + item.price, 0) * (1 - discount)).toLocaleString()}` : "Invalid promo code.";
        } else if (command.toLowerCase() === "clear") {
            consoleContent.innerHTML = "";
            return;
        } else {
            response = `'${command}' is not recognized. Type 'help' to see available commands.`;
        }

        consoleContent.innerHTML += `\n<span class="prompt">C:\\Store></span> ${command}\n${response}\n`;
        consoleWindow.scrollTop = consoleWindow.scrollHeight;
    }
});

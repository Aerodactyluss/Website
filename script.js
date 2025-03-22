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

    function showWelcomeMessage() {
        consoleContent.innerHTML += 
            "[WELCOME] Selamat datang di Windows Console Store!\n" +
            "Ketik 'help' untuk melihat daftar command.\n" +
            "Untuk melihat produk, ketik 'list'.\n" +
            "Untuk membeli, ketik 'buy [nama produk]'.\n";
    }

    function updateNetworkStatus() {
        isOnline = navigator.onLine;
        let statusMessage = isOnline ? "Online Mode Activated." : "Offline Mode Activated.";
        consoleContent.innerHTML += `\n[INFO] ${statusMessage}\n`;
    }

    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);
    
    showWelcomeMessage();
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

            if (product) {
                let confirmBuy = confirm(`Apakah Anda ingin membeli ${product.name} seharga Rp${product.price.toLocaleString()}?`);
                if (confirmBuy) {
                    cart.push(product);
                    localStorage.setItem("cart", JSON.stringify(cart));
                    response = `${product.name} telah ditambahkan ke keranjang.`;
                } else {
                    response = "Pembelian dibatalkan.";
                }
            } else {
                response = "Produk tidak ditemukan.";
            }
        } else if (command.toLowerCase() === "cart") {
            response = cart.length === 0 ? "Keranjang Anda kosong. Ketik 'list' untuk melihat produk." : "Keranjang Belanja:\n";
            let total = 0;
            cart.forEach((item, i) => {
                response += `(${i + 1}) ${item.name} - Rp${item.price.toLocaleString()}\n`;
                total += item.price;
            });
            if (cart.length > 0) response += `Total: Rp${total.toLocaleString()}`;
        } else if (command.toLowerCase() === "checkout") {
            if (cart.length === 0) {
                response = "Keranjang Anda kosong. Tambahkan produk terlebih dahulu!\nGunakan 'list' untuk melihat produk.";
            } else {
                response = "Processing payment...\n█▒▒▒▒▒▒▒▒▒▒ 10%\n███▒▒▒▒▒▒▒▒ 30%\n█████▒▒▒▒▒▒ 50%\n███████▒▒▒▒ 70%\n█████████▒▒ 90%\n██████████ 100%\nTransaction successful!";
                purchaseHistory = purchaseHistory.concat(cart);
                localStorage.setItem("history", JSON.stringify(purchaseHistory));
                cart = [];
                localStorage.removeItem("cart");
            }
        } else if (command.toLowerCase() === "history") {
            response = purchaseHistory.length === 0 ? "Tidak ada riwayat pembelian." : "Riwayat Pembelian:\n";
            purchaseHistory.forEach((item, i) => {
                response += `(${i + 1}) ${item.name} - Rp${item.price.toLocaleString()}\n`;
            });
        } else if (command.toLowerCase().startsWith("info ")) {
            let productName = command.substring(5);
            let product = products.find(p => p.name.toLowerCase() === productName.toLowerCase());

            response = product ? `${product.name}: ${product.desc}` : "Produk tidak ditemukan.";
        } else if (command.toLowerCase().startsWith("search ")) {
            let keyword = command.substring(7).toLowerCase();
            let results = products.filter(p => p.name.toLowerCase().includes(keyword));

            response = results.length > 0 ? "Hasil Pencarian:\n" + results.map(p => `${p.name} - Rp${p.price.toLocaleString()}`).join("\n") : "Tidak ada produk yang cocok.";
        } else if (command.toLowerCase().startsWith("apply ")) {
            let promoCode = command.substring(6).toLowerCase();
            let discount = 0;

            if (promoCode === "diskon50") discount = 0.5;
            else if (promoCode === "diskon10") discount = 0.1;

            response = discount > 0 ? `Kode promo diterapkan! Total baru: Rp${(cart.reduce((sum, item) => sum + item.price, 0) * (1 - discount)).toLocaleString()}` : "Kode promo tidak valid.";
        } else if (command.toLowerCase() === "clear") {
            consoleContent.innerHTML = "";
            showWelcomeMessage();
            return;
        } else {
            response = `'${command}' tidak dikenali. Ketik 'help' untuk melihat daftar perintah.`;
        }

        consoleContent.innerHTML += `\n<span class="prompt">C:\\Store></span> ${command}\n${response}\n`;
        consoleWindow.scrollTop = consoleWindow.scrollHeight;
    }
});

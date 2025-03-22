document.addEventListener("DOMContentLoaded", function() {
    const consoleWindow = document.querySelector(".console-window");
    const consoleContent = document.getElementById("console");
    const consoleInput = document.getElementById("console-input");
    emailjs.init("kfI2cDSPeQxwKnRoO");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let purchaseHistory = JSON.parse(localStorage.getItem("history")) || [];
    let isOnline = navigator.onLine;
    let username = localStorage.getItem("username") || null;
    let isAdmin = localStorage.getItem("isAdmin") === "true";

    let products = JSON.parse(localStorage.getItem("products")) || [
        { name: "Laptop", price: 15000000, desc: "Laptop high-performance untuk gaming & kerja" },
        { name: "Mouse", price: 250000, desc: "Mouse wireless dengan DPI tinggi" },
        { name: "Keyboard", price: 500000, desc: "Mechanical keyboard dengan switch clicky" },
        { name: "Monitor", price: 2000000, desc: "Monitor 144Hz Full HD untuk gaming" },
        { name: "Headset", price: 750000, desc: "Headset noise-cancelling dengan mic" }
    ];

    function saveProducts() {
        localStorage.setItem("products", JSON.stringify(products));
    }

    function getPrompt() {
        return isAdmin ? "C:\\Admin>" : username ? `C:\\${username}>` : "C:\\Guest>";
    }

    function updatePrompt() {
        consoleContent.innerHTML += `\n<span class="prompt">${getPrompt()}</span> `;
        consoleWindow.scrollTop = consoleWindow.scrollHeight;
    }

    function processCommand(command) {
        let response = "";

        if (command.toLowerCase().startsWith("admin ")) {
            let password = command.split(" ")[1];
            if (password === "@Aerodactylus") {
                isAdmin = true;
                localStorage.setItem("isAdmin", "true");
                response = "✅ Login Admin berhasil!";
            } else {
                response = "❌ Password salah!";
            }

        } else if (command.toLowerCase() === "logout") {
            isAdmin = false;
            username = null;
            localStorage.removeItem("username");
            localStorage.removeItem("isAdmin");
            response = "✅ Anda telah logout.";

        } else if (command.toLowerCase() === "help") {
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
                "🧹 clear - Membersihkan layar" +
                (isAdmin ? 
                "\n⚙ **Perintah Admin:**\n" +
                "----------------------------------\n" +
                "**add [nama] [harga]** - Menambah produk baru\n" +
                "**remove [nama]** - Menghapus produk\n" +
                "**update [nama] [harga baru]** - Mengubah harga produk" 
                : "");

        } else if (command.toLowerCase() === "list") {
            response = "Available Products:\n";
            products.forEach((p, i) => {
                response += `(${i + 1}) ${p.name} - Rp${p.price.toLocaleString()}\n`;
            });

        } else if (command.toLowerCase().startsWith("buy ")) {
            let productName = command.substring(4);
            let product = products.find(p => p.name.toLowerCase() === productName.toLowerCase());

            if (product) {
                cart.push(product);
                localStorage.setItem("cart", JSON.stringify(cart));
                response = `${product.name} telah ditambahkan ke keranjang.`;
            } else {
                response = "Produk tidak ditemukan.";
            }

        } else if (command.toLowerCase().startsWith("add ") && isAdmin) {
            let args = command.split(" ");
            let name = args[1];
            let price = parseInt(args[2]);
            if (!name || isNaN(price)) {
                response = "❌ Format salah! Gunakan: add [nama] [harga]";
            } else {
                products.push({ name, price, desc: "Produk baru" });
                saveProducts();
                response = `✅ Produk '${name}' telah ditambahkan dengan harga Rp${price.toLocaleString()}.`;
            }

        } else if (command.toLowerCase().startsWith("remove ") && isAdmin) {
            let name = command.split(" ")[1];
            let index = products.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
            if (index !== -1) {
                products.splice(index, 1);
                saveProducts();
                response = `✅ Produk '${name}' telah dihapus.`;
            } else {
                response = "❌ Produk tidak ditemukan.";
            }

        } else if (command.toLowerCase().startsWith("update ") && isAdmin) {
            let args = command.split(" ");
            let name = args[1];
            let newPrice = parseInt(args[2]);
            let product = products.find(p => p.name.toLowerCase() === name.toLowerCase());
            if (!product || isNaN(newPrice)) {
                response = "❌ Format salah atau produk tidak ditemukan. Gunakan: update [nama] [harga baru]";
            } else {
                product.price = newPrice;
                saveProducts();
                response = `✅ Harga '${name}' telah diperbarui menjadi Rp${newPrice.toLocaleString()}.`;
            }

        } else {
            response = `'${command}' tidak dikenali. Ketik 'help' untuk melihat daftar perintah.`;
        }

        consoleContent.innerHTML += `\n<span class="prompt">${getPrompt()}</span> ${command}\n${response}\n`;
        consoleWindow.scrollTop = consoleWindow.scrollHeight;
    }

    consoleInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            let command = consoleInput.value.trim();
            consoleContent.innerHTML += `${command}\n`;
            processCommand(command);
            consoleInput.value = "";
            updatePrompt();
        }
    });

    updatePrompt();
});

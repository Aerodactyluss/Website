document.addEventListener("DOMContentLoaded", function () {
    const consoleWindow = document.querySelector(".console-window");
    const consoleContent = document.getElementById("console");
    const consoleInput = document.getElementById("console-input");

    emailjs.init("kfI2cDSPeQxwKnRoO");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let purchaseHistory = JSON.parse(localStorage.getItem("history")) || [];
    let isOnline = navigator.onLine;
    let username = localStorage.getItem("username") || null;
    let isAdmin = localStorage.getItem("isAdmin") === "true";

    const products = [
        { name: "Laptop", price: 15000000, desc: "Laptop high-performance untuk gaming & kerja" },
        { name: "Mouse", price: 250000, desc: "Mouse wireless dengan DPI tinggi" },
        { name: "Keyboard", price: 500000, desc: "Mechanical keyboard dengan switch clicky" },
        { name: "Monitor", price: 2000000, desc: "Monitor 144Hz Full HD untuk gaming" },
        { name: "Headset", price: 750000, desc: "Headset noise-cancelling dengan mic" }
    ];
    function saveProducts() {
        localStorage.setItem("products", JSON.stringify(products));
    }
    function checkout() {
        if (!username) {
            consoleContent.innerHTML += "❌ Anda harus login dengan Google sebelum bisa checkout.\n";
            return;
        }
        if (cart.length === 0) {
            consoleContent.innerHTML += "🛒 Keranjang Anda kosong. Tambahkan produk terlebih dahulu!\n";
            return;
        }

        let orderDetails = cart.map(p => `${p.name} - Rp${p.price.toLocaleString()}`).join("\n");

        sendOrderEmail(username, orderDetails);
        consoleContent.innerHTML += "✅ Checkout berhasil! Tunggu pesan email dari Admin.\n";

        purchaseHistory = purchaseHistory.concat(cart);
        localStorage.setItem("history", JSON.stringify(purchaseHistory));
        cart = [];
        localStorage.removeItem("cart");
    }

    function sendOrderEmail(user, orderDetails) {
    let adminEmail = "arrodactylusss@gmail.com"; // Ganti dengan email admin
    let subject = encodeURIComponent("Pesanan Baru dari " + user);
    let body = encodeURIComponent("Detail Pesanan:\n" + orderDetails);

    window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
    }

    function showWelcomeMessage() {
        consoleContent.innerHTML += 
            "[WELCOME] Selamat datang di Windows Console Store!\n" +
            "Ketik 'help' untuk melihat daftar command.\n" +
            "Untuk melihat produk, ketik 'list'.\n" +
            "Untuk membeli, ketik 'buy [nama produk]'.\n";
    }

    function getPrompt() {
        return isAdmin ? "C:\\Admin>" : username ? `C:\\${username}>` : "C:\\Guest>";
    }

    function updatePrompt() {
        consoleContent.innerHTML += `\n<span class="prompt">${getPrompt()}</span> `;
        consoleWindow.scrollTop = consoleWindow.scrollHeight;
    }

    function updateNetworkStatus() {
        isOnline = navigator.onLine;
        let statusMessage = isOnline ? "🌐 Online Mode Activated." : "⚠️ Offline Mode Activated.";
        consoleContent.innerHTML += `\n[INFO] ${statusMessage}\n`;
    }

    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    function processCommand(command) {
        let response = "";
        let args = command.split(" ");
        
        if (command.toLowerCase() === "admin") {
        response = "❌ Command tidak lengkap! Gunakan: admin [password]";
    } else if (command.toLowerCase().startsWith("admin ")) {
        let password = args[1];
        if (!password) {
            response = "❌ Anda harus memasukkan password! Gunakan: admin [password]";
        } else if (password === "@Aerodactylus") {
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
            response = "📜 Daftar Command:\n" +
                "- `help` → Menampilkan daftar command\n" +
                "- `list` → Menampilkan daftar produk\n" +
                "- `buy [nama produk]` → Membeli produk\n" +
                "- `cart` → Menampilkan isi keranjang\n" +
                "- `checkout` → Melakukan pembayaran\n" +
                "- `history` → Melihat riwayat pembelian\n" +
                "- `search [kata kunci]` → Mencari produk\n" +
                "- `info [nama produk]` → Melihat detail produk\n" +
                "- `apply [kode promo]` → Menggunakan kode promo\n" +
                "- `clear` → Membersihkan layar\n" +
                (isAdmin ? "\n🔧 **Perintah Admin:**\n" +
                "- `add [nama] [harga]` → Menambah produk baru\n" +
                "- `remove [nama]` → Menghapus produk\n" +
                "- `update [nama] [harga baru]` → Mengubah harga produk\n" : "");
        } else if (command.toLowerCase() === "list") {
            response = "📦 Daftar Produk:\n";
            products.forEach((p, i) => {
                response += `(${i + 1}) ${p.name} - Rp${p.price.toLocaleString()}\n`;
            });
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
        } else if (command.toLowerCase() === "update") {
        response = "❌ Command tidak lengkap! Gunakan: update [nama produk] [harga baru]";
    } else if (command.toLowerCase().startsWith("update ") && isAdmin) {
        let name = args[1];
        let newPrice = parseInt(args[2]);
        if (!name || isNaN(newPrice)) {
            response = "❌ Format salah atau produk tidak ditemukan! Gunakan: update [nama] [harga baru]";
        } else {
            let product = products.find(p => p.name.toLowerCase() === name.toLowerCase());
            if (product) {
                product.price = newPrice;
                saveProducts();
                response = `✅ Harga '${name}' telah diperbarui menjadi Rp${newPrice.toLocaleString()}.`;
            } else {
                response = "❌ Produk tidak ditemukan.";
            }
        }
    } else if (command.toLowerCase() === "remove") {
        response = "❌ Command tidak lengkap! Gunakan: remove [nama produk]";
    } else if (command.toLowerCase().startsWith("remove ") && isAdmin) {
        let name = args[1];
        if (!name) {
            response = "❌ Anda harus memasukkan nama produk! Gunakan: remove [nama produk]";
        } else {
            let index = products.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
            if (index !== -1) {
                products.splice(index, 1);
                saveProducts();
                response = `✅ Produk '${name}' telah dihapus.`;
            } else {
                response = "❌ Produk tidak ditemukan.";
            }
        }
        } else if (command.toLowerCase() === "checkout") {
            checkout();
            return;
        } else if (command.toLowerCase() === "buy") {
        response = "❌ Command tidak lengkap! Gunakan: buy [nama produk]";
            
        } else if (command.toLowerCase().startsWith("buy ")) {
        let productName = args.slice(1).join(" ");
        if (!productName) {
            response = "❌ Anda harus memasukkan nama produk! Gunakan: buy [nama produk]";
        } else {
            let product = products.find(p => p.name.toLowerCase() === productName.toLowerCase());
            if (product) {
                cart.push(product);
                localStorage.setItem("cart", JSON.stringify(cart));
                response = `✅ ${product.name} telah ditambahkan ke keranjang.`;
            } else {
                response = "❌ Produk tidak ditemukan.";
            }
                }
        } else if (command.toLowerCase() === "cart") {
            response = cart.length === 0 ? "🛒 Keranjang kosong." : "🛍 Isi Keranjang:\n";
            let total = 0;
            cart.forEach((item, i) => {
                response += `(${i + 1}) ${item.name} - Rp${item.price.toLocaleString()}\n`;
                total += item.price;
            });
            if (cart.length > 0) response += `💰 Total: Rp${total.toLocaleString()}`;
        } else {
            response = `❌ Command '${command}' tidak dikenali. Ketik 'help' untuk melihat daftar perintah.`;
        }

        consoleContent.innerHTML += `\n${getPrompt()} ${command}\n${response}\n`;
        consoleWindow.scrollTop = consoleWindow.scrollHeight;
    }
    } else if (command.toLowerCase() === "apply") {
        response = "❌ Command tidak lengkap! Gunakan: apply [kode promo]";
    } else if (command.toLowerCase().startsWith("apply ")) {
        let promoCode = args[1];
        if (!promoCode) {
            response = "❌ Anda harus memasukkan kode promo! Gunakan: apply [kode promo]";
        } else {
            let discount = 0;
            if (promoCode === "diskon50") discount = 0.5;
            else if (promoCode === "diskon10") discount = 0.1;

            if (discount > 0) {
                response = `✅ Kode promo diterapkan! Total baru: Rp${(cart.reduce((sum, item) => sum + item.price, 0) * (1 - discount)).toLocaleString()}`;
            } else {
                response = "❌ Kode promo tidak valid.";
            }
        }
    consoleInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            let command = consoleInput.value.trim();
            if (command) {
                consoleContent.innerHTML += `\n${getPrompt()} ${command}`;
                processCommand(command);
                consoleInput.value = "";
                updatePrompt();
            }
        }
    });

    showWelcomeMessage();
    updateNetworkStatus();
    updatePrompt();
});

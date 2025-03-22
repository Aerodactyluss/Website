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

    function checkout() {
    if (!username) {
        consoleContent.innerHTML += "Anda harus login dengan Google sebelum bisa checkout.\n";
        return;
    }
    if (cart.length === 0) {
        consoleContent.innerHTML += "Keranjang Anda kosong. Tambahkan produk terlebih dahulu!\n";
        return;
    }

    let orderDetails = cart.map(item => `${item.name} - Rp${item.price.toLocaleString()}`).join("\n");

    sendOrderEmail(username, orderDetails); // Pastikan fungsi ini dipanggil

    consoleContent.innerHTML += "✅ Anda Berhasil Checkout. Tunggu pesan email dari admin.\n";

    // Simpan riwayat pembelian
    purchaseHistory = purchaseHistory.concat(cart);
    localStorage.setItem("history", JSON.stringify(purchaseHistory));
    
    // Kosongkan keranjang
    cart = [];
    localStorage.removeItem("cart");
        }

    function sendOrderEmail(user, orderDetails) {
        emailjs.send("service_baqdrdx", "template_2n0iqja", {
            user_name: user,
            order_details: orderDetails
        }).then(
            function (response) {
                console.log("✅ Email terkirim!", response.status, response.text);
            },
            function (error) {
                console.log("❌ Gagal mengirim email:", error);
            }
        );
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

        if (command.toLowerCase() === "help") {
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
        } else if (command.toLowerCase() === "checkout") {
            checkout();
            return;
        } else if (command.toLowerCase().startsWith("buy ")) {
            let productName = command.substring(4);
            let product = products.find(p => p.name.toLowerCase() === productName.toLowerCase());

            if (product) {
                cart.push(product);
                localStorage.setItem("cart", JSON.stringify(cart));
                response = `✅ ${product.name} telah ditambahkan ke keranjang.`;
            } else {
                response = "❌ Produk tidak ditemukan.";
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

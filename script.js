document.addEventListener("DOMContentLoaded", function() {
    const consoleWindow = document.querySelector(".console-window");
    const consoleContent = document.getElementById("console");
    const consoleInput = document.getElementById("console-input");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let purchaseHistory = JSON.parse(localStorage.getItem("history")) || [];

    function showWelcomeMessage() {
        consoleContent.innerHTML += 
            "[WELCOME] Selamat datang di Windows Console Store!\n" +
            "Ketik 'help' untuk melihat daftar command.\n" +
            "Untuk melihat produk, ketik 'list'.\n" +
            "Untuk membeli, ketik 'buy [nama produk]'.\n";
    }

    showWelcomeMessage();

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
            response = 
                "📜 **Daftar Perintah:**\n" +
                "----------------------------------\n" +
                "**help** - Menampilkan daftar command\n" +
                "**list** - Menampilkan daftar produk\n" +
                "**buy [nama produk]** - Membeli produk\n" +
                "**cart** - Melihat isi keranjang\n" +
                "**checkout** - Membayar pesanan\n" +
                "**history** - Melihat riwayat pembelian\n" +
                "**search [kata kunci]** - Mencari produk\n" +
                "**info [nama produk]** - Melihat detail produk\n" +
                "**apply [kode promo]** - Menggunakan kode promo\n" +
                "**clear** - Membersihkan layar";
        } else {
            response = `'${command}' tidak dikenali. Ketik 'help' untuk melihat daftar perintah.`;
        }

        consoleContent.innerHTML += `\n<span class="prompt">C:\\Store></span> ${command}\n${response}\n`;
        consoleWindow.scrollTop = consoleWindow.scrollHeight;
    }
});
 (promoCode === "diskon10") {
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

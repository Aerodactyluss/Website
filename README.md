# Aerodactylus Store  

Windows Console Store adalah website toko online yang dirancang dengan tampilan terminal Windows Console. Website ini memungkinkan pengguna untuk membeli produk melalui command-line interface yang modern dan interaktif.  

## **Fitur Utama**  
✅ Simpan keranjang belanja menggunakan `localStorage`  
✅ Checkout dengan animasi loading  
✅ Pencarian produk menggunakan command `search [kata kunci]`  
✅ Detail produk dengan command `info [nama produk]`  
✅ Riwayat pembelian dengan command `history`  
✅ Diskon dan promo menggunakan command `apply [kode promo]`  
✅ Mode online & offline detection  
✅ Sistem login menggunakan Google untuk pemesanan  
✅ Checkout otomatis mengirimkan email ke admin  
✅ Mode Admin: Tambah, edit, dan hapus produk  

## **Cara Menggunakan**  
1. **Login dengan Google** untuk memesan produk  
2. Ketik `help` untuk melihat daftar command  
3. Gunakan `list` untuk melihat semua produk  
4. Tambahkan produk ke keranjang dengan `buy [nama produk]`  
5. Cek isi keranjang dengan `cart`  
6. Lakukan checkout dengan `checkout`  

## **Command List**  
- `help` - Menampilkan semua command  
- `list` - Menampilkan daftar produk  
- `buy [nama produk]` - Menambahkan produk ke keranjang  
- `cart` - Melihat isi keranjang  
- `checkout` - Membayar pesanan  
- `history` - Melihat riwayat pembelian  
- `search [kata kunci]` - Mencari produk  
- `info [nama produk]` - Melihat detail produk  
- `apply [kode promo]` - Menggunakan kode promo  
- `clear` - Membersihkan layar  
- `admin [password]` - Masuk ke mode admin  
- `add [nama] [harga]` - Menambah produk *(Admin only)*  
- `remove [nama]` - Menghapus produk *(Admin only)*  
- `update [nama] [harga]` - Mengubah harga produk *(Admin only)*  
- `logout` - Keluar dari akun  

## **Instalasi**  
1. Clone repository ini  
   ```sh
   git clone https://github.com/Aerodactyluss/repository.git
   cd repository
   

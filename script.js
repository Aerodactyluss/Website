// Toggle Menu Navbar
function toggleMenu() {
    document.querySelector(".nav-links").classList.toggle("show");
}

// Toggle Mode Gelap/Terang
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

// Animasi Scroll
function revealOnScroll() {
    document.querySelectorAll(".reveal").forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 50) {
            el.classList.add("visible");
        }
    });
}
window.addEventListener("scroll", revealOnScroll);

// Slider
let index = 0;
setInterval(() => {
    const slides = document.querySelector(".slides");
    index = (index + 1) % slides.children.length;
    slides.style.transform = `translateX(-${index * 100}%)`;
}, 3000);

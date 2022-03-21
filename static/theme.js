var storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
if (storedTheme)
    document.documentElement.setAttribute('data-theme', storedTheme)

if (storedTheme === 'dark') {
    var dark_mode = true;
} else {
    var dark_mode = false;
}

var dark_btn = document.getElementById("dark-btn");
dark_btn.addEventListener("click", function() {
    if (!dark_mode) {
        document.documentElement.setAttribute('data-theme', "dark")
        localStorage.setItem('theme', "dark");
        dark_mode = true;
    } else {
        document.documentElement.setAttribute('data-theme', "light")
        localStorage.setItem('theme', "light");
        dark_mode = false;
    } 
});
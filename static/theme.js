var dark_mode = localStorage.getItem('theme');
if (dark_mode == "dark")
    setDarkMode()
else
    setLightMode()

var dark_btn = document.getElementById("dark-btn");
dark_btn.addEventListener("click", function() {
    if (!dark_mode) {
        setDarkMode()
    } else {
        setLightMode()
    } 
});

function setDarkMode() {
    document.documentElement.setAttribute('data-theme', "dark")
    localStorage.setItem('theme', "dark");
    dark_mode = true;

    anime({
        targets: "#light-svg",
        opacity: 1,
        scale: [3, 1],
        duration: 450,
        easing: 'easeOutExpo'
    })
    anime({
        targets: "#dark-svg",
        opacity: 0,
        scale: [1, 0],
        duration: 450,
        easing: 'easeOutExpo'
    })
}

function setLightMode() {
    document.documentElement.setAttribute('data-theme', "light")
    localStorage.setItem('theme', "light");
    dark_mode = false;

    anime({
        targets: "#dark-svg",
        opacity: 1,
        scale: [3, 1],
        duration: 450,
        easing: 'easeOutExpo'
    })
    anime({
        targets: "#light-svg",
        opacity: 0,
        scale: [1, 0],
        duration: 450,
        easing: 'easeOutExpo'
    })
}
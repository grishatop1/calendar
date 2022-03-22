$(document).ready(function() {
    fetch("/", {
        method: "POST"
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        loadCalendar(data).then(() => {
            scrollToToday();
            hideLoading();  
            
            document.getElementsByClassName("today-btn")[0].addEventListener("click", function() {
                scrollToTodayAnimated();
            });

            document.addEventListener("scroll", function() {
                if (!isInViewport(todayTab["tab"])) {
                    showBackToToday()
                } else {
                    hideBackToToday()
                }
            });
        });
    })
    .catch(err => {
        $(".loading-header h2").text("ГРЕШКА")
        $(".loading-header h2").css("color", "red")
    });
});

function hideLoading() {
    anime({
        targets: '.loading',
        opacity: 0,
        duration: 500,
        easing: 'easeInOutQuad',
        complete: function() {
            document.getElementsByClassName("loading")[0].style.display = "none";
        }
    });
}


var calendar = [];
var todayTab;
var todayBtnShown = false;

async function loadCalendar(dates) {
    for (const i in dates) {
        var date = dates[i]

        var tab = document.createElement("div");
        tab.classList.add("tab");

        var h2 = document.createElement("h2");
        h2.innerHTML = 
            `${date['day']}. ${date['month']}`

        var p = document.createElement("p");
        p.innerHTML = date['text'].replace("; ", "<br>");

        var info_block = document.createElement("div");
        info_block.classList.add("info_block");

        

        if (date['post']) {
            var block = document.createElement("div");
            block.classList.add("post-block", "block");
            block.innerHTML = "Пост";
            info_block.appendChild(block);
            tab.classList.add("post");
        }
        if (date['red']) {
            var block = document.createElement("div");
            block.classList.add("red-block", "block");
            block.innerHTML = "Црвено слово";
            info_block.appendChild(block);
            tab.classList.add("red");
        }

        tab.appendChild(h2);
        tab.appendChild(p);
        tab.appendChild(info_block);

        document.getElementsByClassName("tab-container")[0].appendChild(tab);

        var y = getOffset(tab).top;
        date["y"] = y;
        date["tab"] = tab;
        calendar.push(date)

        var d = date["day"] + " " + date["month"]
        if (getDateForJson() == d) {
            todayTab = date;
            tab.classList.add("today");
        }
    }
}

function scrollToToday() {
    var y = todayTab["y"];
    var tab = todayTab["tab"];
    window.scrollTo(0, y - (window.innerHeight / 2) + (tab.offsetHeight / 2));
    flashToday()
}

function scrollToTodayAnimated() {
    const scrollElement = window.document.scrollingElement || window.document.body || window.document.documentElement;
    let y = todayTab["y"];
    let tab = todayTab["tab"];
    anime({
        targets: scrollElement,
        scrollTop: y - (window.innerHeight / 2) + (tab.offsetHeight / 2),
        duration: 500,
        easing: 'easeInOutQuad',
        complete: function() {
            flashToday()
        }
    });
}

function flashToday() {
    anime({
        targets: todayTab["tab"],
        translateX: ["0px", "-10px", "10px", "0px"],
        duration: 350,
        easing: 'linear'
    })
}

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
  }

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= ((window.innerHeight + rect.height) || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function showBackToToday() {
    if (!todayBtnShown) {
        anime({
            targets: '.today-btn',
            translateY: ["200%", "0"],
            duration: 200,
            easing: 'easeInOutQuad'
        })
        todayBtnShown = true;
    }
}

function hideBackToToday() {
    if (todayBtnShown) {
        anime({
            targets: '.today-btn',
            translateY: ["0", "200%"],
            duration: 200,
            easing: 'easeInOutQuad'
        })
        todayBtnShown = false;
    }
}
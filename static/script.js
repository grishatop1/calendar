p = loadEverything("2022");
p.then(() => {
    document.getElementsByClassName("today-btn")[0].addEventListener("click", function() {
        scrollToTodayAnimated();
    });

    document.getElementById("switch-btn").addEventListener("click", function() {
        showYearPicker();
    });

    document.addEventListener("scroll", function() {
        if (!isInViewport(todayTab["tab"])) {
            showBackToToday()
        } else {
            hideBackToToday()
        }
    });

    $(".select-year-btn").click(function() {
        var year = $(this).attr("data-year");
        switchYear(year);
    });
});

async function loadEverything(year) {
    response = await fetch(`/calendar/${year}`, {
        method: "POST"
    })
    data = await response.json()
    await loadCalendar(data)
    scrollToToday();
    await new Promise(r => {
        requestAnimationFrame(r);
    });
    await new Promise(r => {
        setTimeout(r, 100);
    });
    
    hideLoading();
}

function showLoading(callback) {
    document.getElementsByClassName("loading")[0].style.display = "flex";
    anime({
        targets: '.loading',
        opacity: 1,
        duration: 500,
        easing: 'easeInOutQuad',
        complete: callback
    });
}

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

async function loadCalendar(months_data) {
    document.getElementsByClassName("tab-container")[0].innerHTML = "";
    for (const [mnth, dates] of Object.entries(months_data)) {

        let month_node = document.createElement("div");
        month_node.classList.add("month");

        let month_header = document.createElement("div");
        month_header.classList.add("month-header");
        month_header.innerHTML = mnth;
        month_node.appendChild(month_header);

        for (const i in dates) {
            var date = dates[i]

            var tab = document.createElement("div");
            tab.classList.add("tab");

            var h2 = document.createElement("h2");
            h2.innerHTML = 
                `${date['day']}. ${date['month']} - <span>${date['week']}</span>`

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
            } else if (date["week"] == "недеља") {
                tab.classList.add("red");
            }

            tab.appendChild(h2);
            tab.appendChild(p);
            tab.appendChild(info_block);

            month_node.appendChild(tab);

            date["tab"] = tab;
            calendar.push(date)

            var d = date["day"] + " " + date["month"]
            if (getDateForJson() == d) {
                todayTab = date;
                tab.classList.add("today");
            }
        }
        document.getElementsByClassName("tab-container")[0].appendChild(month_node);
    }
}

function scrollToToday() {
    let tab = todayTab["tab"];
    let y = getOffset(tab).top;
    window.scrollTo(0, y - (window.innerHeight / 2) + (tab.offsetHeight / 2));
    flashToday()
}

function scrollToTodayAnimated() {
    const scrollElement = window.document.scrollingElement || window.document.body || window.document.documentElement;
    let tab = todayTab["tab"];
    let y = getOffset(tab).top;
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

var pickerShown = false;
var allowShow = true;
function showYearPicker() {
    if (!allowShow) return;
    allowShow = false;
    if (!pickerShown) {
        let buttons = document.getElementsByClassName("select-year-btn");
        let calendar_btn = document.getElementById("switch-btn");
        $(".select-year-btn").css("display", "block");
        for (let i = 0; i < buttons.length; i++) {
            let toAdd = 10;
            if (i > 0) toAdd = 20
            anime({
                targets: buttons[i],
                translateY: [0, 50*i + 50 + toAdd],
                duration: 150,
                easing: 'easeInOutQuad',
                complete: function() {
                    pickerShown = true;
                }
            })
            anime({
                targets: calendar_btn,
                rotate: [0, -180],
                duration: 150,
                easing: 'easeInOutQuad'
            })
        }
        setTimeout(function() {
            pickerShown = true;
            allowShow = true;
        }, 150);
    } else {
        hideYearPicker()   
    }
}

function hideYearPicker() {
    let buttons = document.getElementsByClassName("select-year-btn");
    let calendar_btn = document.getElementById("switch-btn");
    for (let i = buttons.length - 1; i >= 0; i--) {
        anime({
            targets: buttons[i],
            translateY: [50*i + 50, 0],
            duration: 150,
            easing: 'easeInOutQuad'
        })
        anime({
            targets: calendar_btn,
            rotate: [-180, 0],
            duration: 150,
            easing: 'easeInOutQuad'
        })
    }
    setTimeout(function() {
        pickerShown = false;
        allowShow = true;
        $(".select-year-btn").css("display", "none");
    }, 150);
}

var currentYear = 2022;
function switchYear(year) {
    if (currentYear == year) return;
    var year_items = document.getElementsByClassName("select-year")[0].children;
    // set class selected to year item where attribute data-year == year
    for (const i in year_items) {
        // if i is not a number then continue
        if (isNaN(i)) continue;
        if (year_items[i].getAttribute("data-year") == year) {
            year_items[i].classList.add("selected-year");
        } else {
            year_items[i].classList.remove("selected-year");
        }
    }
    hideYearPicker();
    currentYear = parseInt(year);
    showLoading(function() {
        loadEverything(year);
    });
}
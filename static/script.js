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

    $(".select-year-item").click(function() {
        var year = $(this).attr("data-year");
        switchYear(year);
    });
    $(".select-year-wrap").click(function(e) {
        hideYearPicker();
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

function showYearPicker() {
    var year_picker = document.getElementsByClassName("select-year-wrap")[0];
    if (year_picker.style.display != "none") return
    year_picker.style.display = "block";
    anime({
        targets: year_picker,
        opacity: [0, 1],
        duration: 100,
        easing: 'easeInOutQuad'
    })
}

function hideYearPicker() {
    var year_picker = document.getElementsByClassName("select-year-wrap")[0];
    anime({
        targets: year_picker,
        opacity: [1, 0],
        duration: 100,
        easing: 'easeInOutQuad',
        complete: function() {
            year_picker.style.display = "none";
        }
    })
}

function switchYear(year) {
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
    showLoading(function() {
        loadEverything(year);
    });
}
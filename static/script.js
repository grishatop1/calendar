p = loadEverything();
p.then(() => {
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

async function loadEverything() {
    response = await fetch("/", {
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
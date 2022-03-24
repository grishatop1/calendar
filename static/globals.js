var months = {
    "1": "јануар",
    "2": "фебруар",
    "3": "март",
    "4": "април",
    "5": "мај",
    "6": "јун",
    "7": "јул",
    "8": "август",
    "9": "септембар",
    "10": "октобар",
    "11": "новембар",
    "12": "децембар"
}

var days = {
    "0": "недеља",
    "1": "понедељак",
    "2": "уторак",
    "3": "среда",
    "4": "четвртак",
    "5": "петак",
    "6": "субота"
}

function getDateForJson() {
    let dateObj = new Date();
    let month = dateObj.getMonth() + 1;
    let day = dateObj.getDate();
    let str = day + " " + months[month];
    return str;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
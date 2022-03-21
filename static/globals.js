months = {
    "1": "Јануар",
    "2": "Фебруар",
    "3": "Март",
    "4": "Април",
    "5": "Мај",
    "6": "Јун",
    "7": "Јул",
    "8": "Август",
    "9": "Септембар",
    "10": "Октобар",
    "11": "Новембар",
    "12": "Децембар"
}

function getDateCustom() {
    let dateObj = new Date();
    let month = dateObj.getMonth() + 1;
    let day = dateObj.getDate();
    let str = day + "." + month;
    return str;
}
function areInTheSameWeek(dateStr1, dateStr2) {
    const tmp1 = new Date(dateStr1);
    const tmp2 = new Date(dateStr2);
    let largeDate;
    let smallDate;
    if (tmp1 > tmp2) {
        largeDate = tmp1;
        smallDate = tmp2;
    } else {
        largeDate = tmp2;
        smallDate = tmp1;
    }
    if (largeDate - smallDate >= 86400 * 1000 * 7) {
        return false;
    }
    const smallDay = smallDate.getDay() === 0 ? 7 : smallDate.getDay();
    const largeDay = largeDate.getDay() === 0 ? 7 : largeDate.getDay();
    return largeDay >= smallDay;
}

module.exports = {
    areInTheSameWeek,
};

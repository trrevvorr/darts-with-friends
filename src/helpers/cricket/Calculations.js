export function calcTotalPointsScored(marksList) {
    let total = 0;
    for (let n = 20; n >= 15; n--) {
        total += calcPointsScored(marksList[n.toString()], n);
    }
    total += calcPointsScored(marksList["B"], 25);

    return total;
}

export function calcPointsScored(marks, number) {
    const extraMarks = marks - 3;
    if (extraMarks > 0) {
        return extraMarks * number;
    } else {
        return 0;
    }
}



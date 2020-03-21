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
    
    if (number === "B") {
        number = 25;
    } else {
        number = parseInt(number);
    }
    
    if (extraMarks > 0) {
        return extraMarks * number;
    } else {
        return 0;
    }
}

export function isLeftPlayersTurn(turnNumber) {
    // if even turn num, left player's turn
    return !Boolean(turnNumber % 2);
}

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

export function calcIsLeftPlayersTurn(turnNumber) {
    // if even turn num, left player's turn
    return !Boolean(turnNumber % 2);
}
/**
 * given a number of marks, calculate the minimum number of throws that could be used to achieve that number of marks
 * @param {int} marks number of marks for the given number (e.g. one triple === three marks)
 * @param {string} number the number that was hit (one of the "numbers" around the outside of the dartboard, including bullseye as "B")
 */
export function calcMinThrowsForMarks(marks, number) {
    const maxMarksPerDart = (number === "B" ? 2 : 3);
    return Math.floor(marks / maxMarksPerDart) + (marks % maxMarksPerDart ? 1 : 0);
}

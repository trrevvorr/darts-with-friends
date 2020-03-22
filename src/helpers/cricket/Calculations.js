import { deepCopy } from "../../helpers/general/Calculations";

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

export function getTurnHistory(state, turnNumber) {
    if (turnNumber < 0) {
        console.error("getTurnHistory called with negative turnIndex: " + turnNumber);
        return [];
    }

    let actionNum = state.actionNumber; 
    const turnHistory = [];

    while (actionNum >= 0 && state.history[actionNum].turnNumber === turnNumber) {
        turnHistory.push(deepCopy(state.history[actionNum]));
        actionNum--;
    }

    return turnHistory.reverse();
}

export function countThrowsThisTurn(turnHistory, isLeftPlayersTurn) {
    let numThrows = 0;
    let marksKey = isLeftPlayersTurn ? "leftMarks" : "rightMarks";

    ["20", "19", "18", "17", "16", "15", "B"].forEach(n => {
        const originalMarksScored = turnHistory[0][marksKey][n];
        const currentMarksScored = turnHistory[turnHistory.length - 1][marksKey][n];
        const numMarks = currentMarksScored - originalMarksScored;
        numThrows += calcMinThrowsForMarks(numMarks, n);
    });

    return numThrows;
}

function validateStateAgainstMarksThisTurn(state) {
    const currentTurn = state.history[state.actionNumber].turnNumber;
    const isLeftPlayersTurn = calcIsLeftPlayersTurn(currentTurn);
    const numThrowsThisTurn = countThrowsThisTurn(getTurnHistory(state, currentTurn), isLeftPlayersTurn);
    return numThrowsThisTurn <= 3;
}

function validateStateAgainstOpponent(state) {
    if (state.actionNum <= 0) {
        return true;
    }

    const currAction = state.history[state.actionNumber];
    const prevAction = state.history[state.actionNumber - 1];
    const isLeftPlayersTurn = calcIsLeftPlayersTurn(currAction.turnNumber);
    const currPlayersMarksKey = isLeftPlayersTurn ? "leftMarks" : "rightMarks";
    const currPlayersCurrMarks = currAction[currPlayersMarksKey];
    const currPlayersPrevMarks = prevAction[currPlayersMarksKey];
    const oppsMarksKey = isLeftPlayersTurn ? "rightMarks" : "leftMarks";
    const oppsCurrMarks = currAction[oppsMarksKey];

    const numbers = ["20", "19", "18", "17", "16", "15", "B"]
    for (let i = 0; i < numbers.length; i++) {
        const n = numbers[i];
        const oppMarkCount = oppsCurrMarks[n];
        const currPlayerCurrMarkCount = currPlayersCurrMarks[n];
        const currPlayersPrevMarkCount = currPlayersPrevMarks[n];
        const marksForNumValid = (oppMarkCount < 3) || (currPlayerCurrMarkCount <= 3) || (currPlayerCurrMarkCount === currPlayersPrevMarkCount);

        if (!marksForNumValid) {
            return false;
        }
    }

    return true;
}

function validateStateGameNotAlreadyOver(state) {
    return calculateWinner(state, state.actionNumber - 1) === "";
}

export function calculateWinner(state, actionNumber) {
    if (actionNumber === undefined) {
        actionNumber = state.actionNumber;
    }
    if (state.actionNum <= 0) {
        return "";
    }

    const currAction = state.history[actionNumber];
    const isLeftPlayersTurn = calcIsLeftPlayersTurn(currAction.turnNumber);

    const currPlayersMarksKey = isLeftPlayersTurn ? "leftMarks" : "rightMarks";
    const currPlayersMarks = currAction[currPlayersMarksKey];
    const currPlayersScore = calcTotalPointsScored(currPlayersMarks);
    let currPlayerClosedAll = true;

    const oppsMarksKey = isLeftPlayersTurn ? "rightMarks" : "leftMarks";
    const oppsMarks = currAction[oppsMarksKey];
    const oppsScore = calcTotalPointsScored(oppsMarks);
    let oppClosedAll = true;

    const numbers = ["20", "19", "18", "17", "16", "15", "B"]
    for (let i = 0; i < numbers.length; i++) {
        const n = numbers[i];

        if (currPlayersMarks[n] < 3) {
            currPlayerClosedAll = false;
        }
        if (oppsMarks[n] < 3) {
            oppClosedAll = false;
        }

        if (!currPlayerClosedAll && !oppClosedAll) {
            return "";
        }
    }

    if (currPlayersScore >= oppsScore && currPlayerClosedAll) {
        return isLeftPlayersTurn ? "left" : "right";
    } else if (oppsScore >= currPlayersScore && oppClosedAll) {
        return isLeftPlayersTurn ? "right" : "left";
    } else {
        return "";
    }
}

export function validateState(state) {
    return (
        validateStateAgainstMarksThisTurn(state) 
        && validateStateAgainstOpponent(state)
        && validateStateGameNotAlreadyOver(state)
    );
}
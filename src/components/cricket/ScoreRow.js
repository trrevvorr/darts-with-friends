import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import MarkIcon from './MarkIcon';
import { calcPointsScored } from "../../helpers/cricket/Calculations"

import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';


const useStyles = makeStyles(theme => ({
    row: {
        paddingBottom: "5px",
        height: "9vh",
        lineHeight: "9vh",
    },
    // number of points scored (when greater than 3 marks scored)
    pointsScoredOnNumber: {
        lineHeight: "9vh",
        transition: "color 0.5s",
    },
    positivePointsScoredOnNumber: {
        color: green[500],
    },
    noPointsScoredOnNumber: {
        display: "none",
    },
    // the left and right sides of the row (left and right player)
    playerSide: {
    },
    leftSide: {
        textAlign: "left",
    },
    rightSide: {
        textAlign: "right",
    },
    activeSide: {
        
    },
    inactiveSide: {
        color: grey[500],
    },
    // count of marks scored per number for the current turn
    marksScoredOnNumber: {
        lineHeight: "9vh",
    },
    leftSideMarksScored: {
        textAlign: "center",
    },
    rightSideMarksScored: {
        textAlign: "center",
    },
    // the "/" and "X" icons denoting marks scored per number
    markIcon: {
        height: "9vh",
        display: "flex",
        alignItems: "center",
        justifyItems: "center",
        transition: "color 0.5s",
    },
    leftMarkIcon: {
    },
    rightMarkIcon: {
    },
    // the "number button" - click to score
    scoreButton: {
        width: "100%",
        height: "8vh",
    }
}));

export default function ScoreRow(props) {
    const classes = useStyles();
    const leftSideClasses = getLeftSideClasses(props.isLeftPlayersTurn, classes);
    const rightSideClasses = getRightSideClasses(!props.isLeftPlayersTurn, classes);

    return (
        <Grid container item xs={12} className={classes.row}>
            <Grid container item xs={5} className={leftSideClasses.join(" ")}>
                <Grid item xs={5}>
                    {getPointsScoredEl(props.leftMarks, props.number, classes, props.isLeftPlayersTurn)}
                </Grid>
                <Grid item xs={4}>
                    <Typography className={[classes.markIcon, classes.leftMarkIcon].join(" ")} variant="h4"><MarkIcon marks={props.leftMarks} /></Typography>
                </Grid>
                <Grid item xs={3}>
                    {getLeftMarksScoredEl(props.number, props.isLeftPlayersTurn, props.turnActions, classes)}
                </Grid>
            </Grid>
            <Grid item xs={2}>
                {getNumberButtonEl(props.addNewMark, props.number, props.numThrowsThisTurn, props.turnActions, props.isLeftPlayersTurn, classes, props.gameIsWon)}
            </Grid>
            <Grid container item xs={5} className={rightSideClasses.join(" ")}>
                <Grid item xs={3}>
                    {getRightMarksScoredEl(props.number, !props.isLeftPlayersTurn, props.turnActions, classes)}
                </Grid>
                <Grid item xs={4}>
                    <Typography className={[classes.markIcon, classes.rightMarkIcon].join(" ")} variant="h4"><MarkIcon marks={props.rightMarks} /></Typography>
                </Grid>
                <Grid item xs={5}>
                    {getPointsScoredEl(props.rightMarks, props.number, classes, !props.isLeftPlayersTurn)}
                </Grid>
            </Grid>
        </Grid>
    );
}

function getNumberButtonEl(addNewMark, number, numThrowsThisTurn, turnActions, isLeftPlayersTurn, classes, gameIsWon) {
    const marksScored = marksScoredForNumberForTurn(isLeftPlayersTurn, turnActions, number);
    const scoreButtonEnabled = isScoreButtonEnabled(number, marksScored, numThrowsThisTurn, isLeftPlayersTurn, turnActions, gameIsWon);
    return (
        <Button variant="contained" onClick={() => addNewMark(number)} disabled={!scoreButtonEnabled} className={classes.scoreButton}>
            <Typography variant="h4">{number}</Typography>
        </Button>
    );
}

function getLeftSideClasses(isLeftPlayersTurn, classes) {
    const leftSideClasses = [classes.leftSide, classes.playerSide];
    if (isLeftPlayersTurn) {
        leftSideClasses.push(classes.activeSide);
    } else {
        leftSideClasses.push(classes.inactiveSide);
    }
    return leftSideClasses;
}

function getRightSideClasses(isRightPlayersTurn, classes) {
    const rightSideClasses = [classes.rightSide, classes.playerSide];
    if (isRightPlayersTurn) {
        rightSideClasses.push(classes.activeSide);
    } else {
        rightSideClasses.push(classes.inactiveSide);
    }
    return rightSideClasses;
}

function getPointsScoredEl(marks, number, classes, isActivePlayer) {
    const pointsScored = calcPointsScored(marks, number);
    let classNames = [classes.pointsScoredOnNumber];

    if (pointsScored > 0) {
        if (isActivePlayer) {
            classNames.push(classes.positivePointsScoredOnNumber);
        }
    } else {
        classNames.push(classes.noPointsScoredOnNumber);
    }

    return <Typography variant="h5" className={classNames.join(" ")}>{"+" + pointsScored}</Typography>
}

function getLeftMarksScoredEl(number, isActivePlayer, turnActions, classes) {
    const marksScored = marksScoredForNumberForTurn(true, turnActions, number);
    const classNames = [classes.leftSideMarksScored]

    return getMarksScoredEl(isActivePlayer, marksScored, classNames, classes);
}

function getRightMarksScoredEl(number, isActivePlayer, turnActions, classes) {
    const marksScored = marksScoredForNumberForTurn(false, turnActions, number);
    const classNames = [classes.rightSideMarksScored]

    return getMarksScoredEl(isActivePlayer, marksScored, classNames, classes);
}

function marksScoredForNumberForTurn(forLeftPlayer, turnActions, number) {
    const marksKey = forLeftPlayer ? "leftMarks" : "rightMarks";
    const originalMarksScored = turnActions[0][marksKey][number];
    const currentMarksScored = turnActions[turnActions.length - 1][marksKey][number];

    return currentMarksScored - originalMarksScored;
}

function getMarksScoredEl(isActivePlayer, marksThisTurn, classNames, classes) {
    classNames.push(classes.marksScoredOnNumber);

    if (marksThisTurn > 0 && isActivePlayer) {
        classNames.push(classes.positivePointsScoredOnNumber);
    } else {
        classNames.push(classes.noPointsScoredOnNumber);
    }

    return <Typography variant="h5" className={classNames.join(" ")}>{marksThisTurn}</Typography>
}

function isScoreButtonEnabled(number, marksScoredForNumber, numThrowsThisTurn, forLeftPlayer, turnActions, gameIsWon) {
    return (
        (!gameIsWon)
        && isAdditionalMarkPossibleForNumber(number, marksScoredForNumber, numThrowsThisTurn) 
        && isAdditionalMarkPossibleAgainstOpponentForNumber(forLeftPlayer, number, turnActions)
    );
}

function isAdditionalMarkPossibleForNumber(number, marksScoredForNumber, numThrowsThisTurn) {
    const maxMarksPerThrowForNumber = (number === "B" ? 2 : 3);
    const marksScoredForNumberRemainder = marksScoredForNumber % maxMarksPerThrowForNumber;
    const throwsRemaining = 3 - numThrowsThisTurn;

    if (throwsRemaining) {
        return true;
    } else {
        // if no throws left, it is still possible to go from single -> double or double -> triple
        return (marksScoredForNumberRemainder > 0) && (marksScoredForNumberRemainder < maxMarksPerThrowForNumber);
    }
}

function isAdditionalMarkPossibleAgainstOpponentForNumber(forLeftPlayer, number, turnActions) {
    const currPlayerMarksKey = forLeftPlayer ? "leftMarks" : "rightMarks";
    const opponentMarksKey = forLeftPlayer ? "rightMarks" : "leftMarks";
    const currentPlayerMarksScored = turnActions[turnActions.length - 1][currPlayerMarksKey][number];
    const opponentMarksScored = turnActions[turnActions.length - 1][opponentMarksKey][number];

    return (opponentMarksScored < 3) || (currentPlayerMarksScored < 3);
}
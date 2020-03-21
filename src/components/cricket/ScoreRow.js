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
    positivePointsScoredOnNumber: {
        color: green[200],
    },
    noPointsScoredOnNumber: {
        display: "none",
    },
    pointsScoredOnNumber: {
        lineHeight: "9vh",
    },
    // the left and right sides of the row (left and right player)
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
        textAlign: "right",
        marginRight: "-5px",
    },
    rightSideMarksScored: {
        textAlign: "left",
        marginLeft: "-5px",
    },
    // the "/" and "X" icons denoting marks scored per number
    markIcon: {
        height: "9vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }
}));

export default function ScoreRow(props) {
    const classes = useStyles();
    const leftSideClasses = getLeftSideClasses(props.isLeftPlayersTurn, classes);
    const rightSideClasses = getRightSideClasses(!props.isLeftPlayersTurn, classes);

    return (
        <Grid container item xs={12} className={classes.row}>
            <Grid container item xs={4} className={leftSideClasses.join(" ")}>
                <Grid item xs={5}>
                    {getPointsScoredEl(props.leftMarks, props.number, classes, props.isLeftPlayersTurn)}
                </Grid>
                <Grid item xs={5}>
                    <Typography className={classes.markIcon} variant="h4"><MarkIcon marks={props.leftMarks} /></Typography>
                </Grid>
                <Grid item xs={2}>
                    {getLeftMarksScoredEl(props.number, props.isLeftPlayersTurn, props.turnHistory, classes)}
                </Grid>
            </Grid>
            <Grid item xs={4}>
                <Button variant="outlined" onClick={() => props.addNewMark(props.number)}><Typography variant="h4">{props.number}</Typography></Button>
            </Grid>
            <Grid container item xs={4} className={rightSideClasses.join(" ")}>
                <Grid item xs={2}>
                    {getRightMarksScoredEl(props.number, !props.isLeftPlayersTurn, props.turnHistory, classes)}
                </Grid>
                <Grid item xs={5}>
                    <Typography className={classes.markIcon} variant="h4"><MarkIcon marks={props.rightMarks} /></Typography>
                </Grid>
                <Grid item xs={5}>
                    {getPointsScoredEl(props.rightMarks, props.number, classes, !props.isLeftPlayersTurn)}
                </Grid>
            </Grid>
        </Grid>
    );
}

function getLeftSideClasses(isLeftPlayersTurn, classes) {
    const leftSideClasses = [classes.leftSide];
    if (isLeftPlayersTurn) {
        leftSideClasses.push(classes.activeSide);
    } else {
        leftSideClasses.push(classes.inactiveSide);
    }
    return leftSideClasses;
}

function getRightSideClasses(isRightPlayersTurn, classes) {
    const rightSideClasses = [classes.rightSide];
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

function getLeftMarksScoredEl(number, isActivePlayer, turnHistory, classes) {
    const originalMarksScored = turnHistory[0].leftMarks[number];
    const currentMarksScored = turnHistory[turnHistory.length - 1].leftMarks[number];
    const classNames = [classes.leftSideMarksScored]

    return getMarksScoredEl(isActivePlayer, currentMarksScored - originalMarksScored, classNames, classes);
}

function getRightMarksScoredEl(number, isActivePlayer, turnHistory, classes) {
    const originalMarksScored = turnHistory[0].rightMarks[number];
    const currentMarksScored = turnHistory[turnHistory.length - 1].rightMarks[number];
    const classNames = [classes.rightSideMarksScored]

    return getMarksScoredEl(isActivePlayer, currentMarksScored - originalMarksScored, classNames, classes);
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

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { calcTotalPointsScored } from "../../helpers/cricket/Calculations"

import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import indigo from '@material-ui/core/colors/indigo';


const useStyles = makeStyles(theme => ({
    headerRow: {
        height: "15vh",
    },
    // score difference in the middle of header
    scoreDiffWrapper: {
        height: "13vh",
        paddingBottom: "2vh",
    },
    scoreDiff: {
        marginTop: "4vh",
        lineHeight: "6vh",
    },
    positiveScore: {
        color: green[500],
    },
    indifferentScore: {
    },
    negativeScore: {
        color: red[500],
    },
    // sides of header (with player name and score)
    playerSide: {
        height: "13vh",
        paddingBottom: "2vh",
        transition: "color 0.5s",
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
    totalScore: {
        lineHeight: "5vh",
    },
    playerName: {
        marginTop: "1vh",
        lineHeight: "4vh",
    },
    // sliding divider div
    divider: {
        height: "2vh",
        width: "60%",
        borderTop: "3px solid " + indigo[500],
        transition: "transform 0.5s",
    },
    dividerLeft: {

    },
    dividerRight: {
        transform: "translateX(67%)",
    }
}));

export default function HeaderRow(props) {
  const classes = useStyles();
  const leftScore = calcTotalPointsScored(props.leftMarks);
  const rightScore = calcTotalPointsScored(props.rightMarks);
  const leftSideClasses = getLeftSideClasses(props.isLeftPlayersTurn, classes);
  const rightSideClasses = getRightSideClasses(!props.isLeftPlayersTurn, classes);

  return (
    <Grid container item xs={12} className={classes.headerRow}>
        <Grid container item xs={4} className={leftSideClasses.join(" ")}>
            <Grid item xs={12}>
                <Typography variant="h4" className={classes.playerName}>{props.leftPlayer.name}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h4" className={classes.totalScore}>{leftScore}</Typography>
            </Grid>
        </Grid>
        <Grid item xs={4} className={classes.scoreDiffWrapper}>
            {getScoreDiffElement(leftScore, rightScore, props.isLeftPlayersTurn, classes)}
        </Grid>
        <Grid container item xs={4} className={rightSideClasses.join(" ")}>
            <Grid item xs={12}>
                <Typography variant="h4" className={classes.playerName}>{props.rightPlayer.name}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h4" className={classes.totalScore}>{rightScore}</Typography>
            </Grid>
        </Grid>
        <div className={getDividerClasses(classes, props.isLeftPlayersTurn).join(" ")}></div>
    </Grid>
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

function getScoreDiffElement (leftScore, rightScore, isLeftPlayersTurn, classes) {
    const scoreDiff = calcScoreDiff(leftScore, rightScore, isLeftPlayersTurn)
    let className;
    let scoreDiffStr;

    if (scoreDiff < 0) {
        scoreDiffStr = scoreDiff.toString();
        className = classes.negativeScore;
    } else if (scoreDiff === 0) {
        scoreDiffStr = scoreDiff.toString();
        className = classes.indifferentScore;
    } else {
        scoreDiffStr = "+" + scoreDiff.toString(); 
        className = classes.positiveScore;
    }

    return <Typography variant="h3" className={[classes.scoreDiff, className].join(" ")}>{scoreDiffStr}</Typography>
}

function calcScoreDiff(leftScore, rightScore, isLeftPlayersTurn) {
    if (isLeftPlayersTurn) {
        return (leftScore - rightScore);
    } else {
        return (rightScore - leftScore);
    }
}

function getDividerClasses(classes, isLeftPlayersTurn) {
    let classNames = [classes.divider];

    if (isLeftPlayersTurn) {
        classNames.push(classes.dividerLeft);
    } else {
        classNames.push(classes.dividerRight);
    }

    return classNames;
}

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import indigo from '@material-ui/core/colors/indigo';
import { calcTotalPointsScored } from "../../helpers/cricket/Calculations"
import AccountCircle from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles(theme => ({
    headerRow: {
        paddingBottom: "3vh",
        marginBottom: "3vh",
        height: "14vh",
        borderBottom: "2px solid " + indigo[500],
    },
    positiveScore: {
        color: green[500],
    },
    indifferentScore: {
    },
    negativeScore: {
        color: red[500],
    },
    profilePicture: {
        fontSize: "40px",
        color: grey[500],
    },
    leftPlayerName: {
        textAlign: "left",
    },
    rightPlayerName: {
        textAlign: "right",
    },
    totalScore: {
        lineHeight: "5vh",
    },
    scoreDiff: {
        marginTop: "4vh",
        lineHeight: "6vh",
    }
}));

export default function HeaderRow(props) {
  const classes = useStyles();
  const leftScore = calcTotalPointsScored(props.leftMarks);
  const rightScore = calcTotalPointsScored(props.rightMarks);

  return (
    <Grid container xs={12} className={classes.headerRow}>
        <Grid container xs={5}>
            <Grid container xs={12}>
                <Grid item xs={4}><AccountCircle className={classes.profilePicture} /></Grid>
                <Grid item xs={8}>
                    <Typography variant="h6" className={classes.leftPlayerName}>{props.leftPlayer}</Typography>
                </Grid>
            </Grid>
            <Grid container xs={12}>
                <Grid item xs={4}>
                    <Typography variant="h4" className={classes.totalScore}>{leftScore}</Typography>
                </Grid>
                <Grid item xs={8}></Grid>
            </Grid>
        </Grid>
        <Grid item xs={2}>
            {getScoreDiffElement(leftScore, rightScore, props.turnNumber, classes)}
        </Grid>
        <Grid container xs={5}>
            <Grid container xs={12}>
                <Grid item xs={8}>
                    <Typography variant="h6" className={classes.rightPlayerName}>{props.rightPlayer}</Typography>
                </Grid>
                <Grid item xs={4}><AccountCircle className={classes.profilePicture} /></Grid>
            </Grid>
            <Grid container xs={12}>
                <Grid item xs={8}></Grid>
                <Grid item xs={4}>
                    <Typography variant="h4" className={classes.totalScore}>{rightScore}</Typography>
                </Grid>
            </Grid>
        </Grid>
    </Grid>
  );
}

function getScoreDiffElement (leftScore, rightScore, turnNumber, classes) {
    const scoreDiff = calcScoreDiff(leftScore, rightScore, turnNumber)
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

    return <Typography variant="h3" className={[classes.scoreDiff, className]}>{scoreDiffStr}</Typography>
}

function calcScoreDiff(leftScore, rightScore, turnNumber) {
    if (isLeftPlayersTurn(turnNumber)) {
        return (leftScore - rightScore);
    } else {
        return (rightScore - leftScore);
    }
}

function isLeftPlayersTurn(turnNumber) {
    // if even turn num, left player's turn
    return !Boolean(turnNumber % 2);
}
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
    buttonBar: {
        paddingTop: "2vh",
        height: "10vh",
    },
    button: {
        width: "100%",
        height: "8vh",
    },
    leftButtonWrapper: {
        paddingRight: "1vh",
    },
    rightButtonWrapper: {
        paddingLeft: "1vh",
    }
}));

export default function ButtonBar(props) {
    const classes = useStyles();

    return (
        <Grid container item xs={12} className={classes.buttonBar}>
            <Grid item xs={6} className={classes.leftButtonWrapper}>
                <Button variant="outlined" color="primary" className={classes.button} onClick={props.undoAction} disabled={!isUndoButtonEnabled(props.actionIndex)}>
                    <Typography variant="h5">Undo</Typography>
                </Button>
            </Grid>
            <Grid item xs={6} className={classes.rightButtonWrapper}>
                {getEndTurnButton(props.gameIsWon, props.endTurn, props.endGame, classes)}
            </Grid>
        </Grid>
    );
}

function getEndTurnButton(gameIsWon, endTurn, endGame, classes) {
    const buttonText = gameIsWon ? "New Game" : "End Turn";
    const buttonAction = gameIsWon ? endGame : endTurn;

    return (
        <Button variant="contained" color="primary" className={classes.button} onClick={buttonAction}>
            <Typography variant="h5">{buttonText}</Typography>
        </Button>
    );
}

function isUndoButtonEnabled(actionIndex) {
    return actionIndex !== 0;
}

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
    row: {
        marginBottom: "2rem",
    },
    gameNumber: {
        fontSize: "2rem",
        textAlign: "right",
        width: "100%",
    },
    gameTitleColumn: {
        textAlign: "left",
    },
    gameTitle: {
        fontWeight: "bold",
        textTransform: "capitalize",
    },
    userWon: {
        color: green[500],
    },
    userLost: {
        color: red[500],
    }
}));

const DATE_FORMAT = new Intl.DateTimeFormat('default', { month: 'short', day: 'numeric' });
const TIME_FORMAT = new Intl.DateTimeFormat('default', { hour: 'numeric', minute: 'numeric' });

export default function PastGame(props) {
    const classes = useStyles();

    return (
        <Grid container className={classes.row} spacing={2}>
            <Grid container item xs={2}>
                <Typography className={classes.gameNumber}>{props.gameNumber}</Typography>
            </Grid>
            <Grid container item className={classes.gameTitleColumn} xs={4}>
                <Grid item xs={12}>
                    <Typography className={classes.gameTitle}>{props.gameType}</Typography>
                </Grid>
                <Grid item xs={12}>
                    {getWinStateText(props.winnerName, props.userDidWin, classes)}
                </Grid>
            </Grid>
            <Grid container item xs={3}>
                <Grid item xs={12}>
                    {getDate(props.timestamp)}
                </Grid>
                <Grid item xs={12}>
                    {getTime(props.timestamp)}
                </Grid>
            </Grid>
            <Grid container item xs={3}>
                {getSelectGameButton(props.winnerName, props.handleGameSelect)}
            </Grid>
        </Grid>
    );
}

function getDate(timestamp) {
    const datetime = new Date(timestamp);
    return DATE_FORMAT.format(datetime);
}

function getTime(timestamp) {
    const datetime = new Date(timestamp);
    return TIME_FORMAT.format(datetime);
}

function getWinStateText(winnerName, userDidWin, classes) {
    let className, text;

    if (winnerName) {
        if (userDidWin) {
            text = "You Won";
            className = classes.userWon;
        } else {
            text = winnerName + " Won";
            className = classes.userLost;
        }
    } else {
        text = "In Progress"
    }

    return <Typography className={className}>{text}</Typography>
}

function getSelectGameButton(winnerName, handleGameSelect) {
    let buttonText, variant;

    if (winnerName) {
        buttonText = "Review";
        variant = "outlined";
    } else {
        buttonText = "Resume";
        variant = "contained";
    }

    return <Button variant={variant} color="primary" onClick={handleGameSelect}>{buttonText}</Button>
}

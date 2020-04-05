import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import { green, red, grey, blue } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
    row: {
        marginBottom: "2rem",
    },
    playersAndSettingsColumn: {
        textAlign: "left",
    },
    dateColumn: {
    },
    playerNames: {
    },
    matchSettings: {
        fontStyle: "italic",
        color: grey[500],
    },
    matchWinStateText: {
        fontSize: "2rem",
        textAlign: "center",
        width: "100%",
        fontWeight: "bold",
    },
    matchWinStateIcon: {
        lineHeight: "3rem",
        width: "3rem",
        height: "3rem",
        backgroundColor: grey[500],
        borderRadius: "1.5rem",
    },
    matchWinStateIconWin: {
        backgroundColor: green[500],
    },
    matchWinStateIconLoss: {
        backgroundColor: red[500],
    },
    matchWinStateIconTie: {
        backgroundColor: blue[500],
    },
    matchWinStateTextIncomplete: {
        transform: "rotate(90deg)",
        fontSize: "3rem",
        lineHeight: "3rem",
    },
    selectButton: {
        height: "3rem",
    }
}));

const DATE_FORMAT = new Intl.DateTimeFormat('default', { month: 'short', day: 'numeric' });
const TIME_FORMAT = new Intl.DateTimeFormat('default', { hour: 'numeric', minute: 'numeric' });

export default function PastMatch(props) {
    const classes = useStyles();

    return (
        <Grid container className={classes.row} spacing={2}>
            <Grid container item xs={2}>
                {getMatchWinStateIcon(props.matchWinState, classes)}
            </Grid>
            <Grid container item className={classes.playersAndSettingsColumn} xs={4}>
                <Grid item xs={12}>
                    <Typography className={classes.playerNames} noWrap>{["You", ...props.opponentsNames].join(" vs ")}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography className={classes.matchSettings}>{getMatchSettingsText(props.matchSettings)}</Typography>
                </Grid>
            </Grid>
            <Grid container item className={classes.dateColumn} xs={3}>
                <Grid item xs={12}>
                    {getDate(props.timestamp)}
                </Grid>
                <Grid item xs={12}>
                    {getTime(props.timestamp)}
                </Grid>
            </Grid>
            <Grid container item xs={3}>
                {getSelectMatchButton(props.handleMatchSelect, props.matchWinState, classes)}
            </Grid>
        </Grid>
    );
}

function getMatchWinStateIcon(matchWinState, classes) {
    let winStateText;
    let iconClassNames = [classes.matchWinStateIcon];
    let textClassNames = [classes.matchWinStateText];

    switch (matchWinState) {
        case "WIN":
            winStateText = "W";
            iconClassNames.push(classes.matchWinStateIconWin);
            break;
        case "LOSS":
            winStateText = "L";
            iconClassNames.push(classes.matchWinStateIconLoss);
            break;
        case "TIE":
            winStateText = "T";
            iconClassNames.push(classes.matchWinStateIconTie);
            break;
        case "INCOMPLETE":
            winStateText = "="; // pause symbol
            textClassNames.push(classes.matchWinStateTextIncomplete);
            break;
        default:
            winStateText = "?";
            console.error(`received invalid matchWinState (${matchWinState})`)
            break;
    }

    return <div className={iconClassNames.join(" ")}>
        <Typography className={textClassNames.join(" ")}>{winStateText}</Typography>
    </div>
}

function getDate(timestamp) {
    const datetime = new Date(timestamp);
    return DATE_FORMAT.format(datetime);
}

function getTime(timestamp) {
    const datetime = new Date(timestamp);
    return TIME_FORMAT.format(datetime);
}

function getSelectMatchButton(handleMatchSelect, matchWinState, classes) {
    let buttonText, variant;

    if (matchWinState === "INCOMPLETE") {
        buttonText = "Resume";
        variant = "contained";
    } else {
        buttonText = "Review";
        variant = "outlined";
    }

    return <Button variant={variant} color="primary" className={classes.selectButton} onClick={handleMatchSelect}>{buttonText}</Button>
}

function getMatchSettingsText(settings) {
    if (settings.gameCount) {
        if (settings.bestOf) {
            return `Best of ${settings.gameCount}`;
        } else {
            return `Play all ${settings.gameCount}`;
        }
    } else {
        return "Free Play";
    }
}

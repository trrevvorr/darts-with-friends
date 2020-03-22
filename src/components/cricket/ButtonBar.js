import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
    buttonBar: {
        marginTop: "1vh",
        height: "10vh",
    },
    button: {
        width: "100%",
        height: "8vh",
    },
    icon: {
        marginRight: "5px",
    }
}));

export default function ButtonBar(props) {
  const classes = useStyles();

  return (
    <Grid container item xs={12} className={classes.buttonBar} spacing={2}>
        <Grid item  xs={6}>
            <Button variant="contained" color="secondary" className={classes.button} onClick={props.undoAction}>
                <Typography variant="h5">Undo</Typography>
            </Button>
        </Grid>
        <Grid item xs={6}>
            <Button variant="contained" color="primary" className={classes.button} onClick={props.endTurn} disabled={!isEndTurnButtonEnabled(props.winner)}>
                <Typography variant="h5">End Turn</Typography>
            </Button>
        </Grid>
    </Grid>
  );
}

function isEndTurnButtonEnabled(winner) {
    return winner === "";
}

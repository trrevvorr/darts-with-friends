import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Done from '@material-ui/icons/Done';
import Undo from '@material-ui/icons/Undo';


const useStyles = makeStyles(theme => ({
    buttonBar: {
        paddingBottom: "5px",
        height: "10vh",
    },
    button: {
        width: "100%",
        height: "8vh",
    }
}));

export default function ButtonBar(props) {
  const classes = useStyles();

  return (
    <Grid container xs={12} className={classes.buttonBar} spacing={2}>
        <Grid item  xs={6}>
            <Button variant="contained" className={classes.button} >
                <Undo />
                <Typography variant="h5">Undo</Typography>
            </Button>
        </Grid>
        <Grid item xs={6}>
            <Button variant="contained" className={classes.button}>
                <Done />
                <Typography variant="h5">Done</Typography>
            </Button>
        </Grid>
    </Grid>
  );
}

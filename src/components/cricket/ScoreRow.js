import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import MarkIcon from './MarkIcon'


const useStyles = makeStyles(theme => ({
    row: {
        marginBottom: "5px",
    }
}));

export default function ScoreRow(props) {
  const classes = useStyles();

  return (
    <Grid container xs={12} className={classes.row}>
        <Grid item xs={4}>
            <Typography variant="h3"><MarkIcon marks={props.leftMarks} /></Typography>
        </Grid>
        <Grid item xs={4}>
            <Button variant="contained"><Typography variant="h3">{props.number}</Typography></Button>
        </Grid>
        <Grid item xs={4}>
        <Typography variant="h4"><MarkIcon marks={props.rightMarks}/></Typography>
        </Grid>
    </Grid>
  );
}
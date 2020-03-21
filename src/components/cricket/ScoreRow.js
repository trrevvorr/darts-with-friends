import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import MarkIcon from './MarkIcon';
import green from '@material-ui/core/colors/green';
import { calcPointsScored } from "../../helpers/cricket/Calculations"


const useStyles = makeStyles(theme => ({
    row: {
        paddingBottom: "5px",
        height: "9vh",
    },
    positiveScore: {
        color: green[200],
    },
    indifferentScore: {
        display: "none",
    },
}));

export default function ScoreRow(props) {
  const classes = useStyles();

  return (
    <Grid container xs={12} className={classes.row}>
        <Grid container xs={4}>
            <Grid item xs={3}>
                {getPointsScoredEl(props.leftMarks, props.number, classes)}
            </Grid>
            <Grid item xs={9}>
                <Typography variant="h4"><MarkIcon marks={props.leftMarks} /></Typography>
            </Grid>
        </Grid>
        <Grid item xs={4}>
            <Button variant="outlined" onClick={() => props.addNewMark(props.number)}><Typography variant="h4">{props.number}</Typography></Button>
        </Grid>
        <Grid container xs={4}>
        <Grid item xs={9}>
                <Typography variant="h4"><MarkIcon marks={props.rightMarks} /></Typography>
            </Grid>
            <Grid item xs={3}>
                {getPointsScoredEl(props.rightMarks, props.number, classes)}
            </Grid>
        </Grid>
    </Grid>
  );
}

function getPointsScoredEl(marks, number, classes) {
    const pointsScored = calcPointsScored(marks, number);
    let className;

    if (pointsScored > 0) {
        className = classes.positiveScore;
    } else {
        className = classes.indifferentScore
    }

    return <Typography variant="h5" className={className}>{"+" + pointsScored}</Typography>
}

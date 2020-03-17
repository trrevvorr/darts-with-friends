import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import MarkIcon from './MarkIcon'
import ScoreRow from './ScoreRow';


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    textAlign: "center",
  },
  headerRow: {
      marginBottom: "5px",
  }
}));

export default function CricketScoreBoard(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
        <Grid container spacing={0}>
            <Grid container xs={12} className={classes.headerRow}>
                <Grid item xs={4}>
                    <Typography variant="h4" color="primary">{props.leftPlayer}</Typography>
                </Grid>
                <Grid container xs={4}>
                    <Grid item xs={5}>
                        <Typography variant="h4" >{props.leftScore}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant="h4" >-</Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography variant="h4" >{props.rightScore}</Typography>
                    </Grid>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="h4" color="primary">{props.rightPlayer}</Typography>
                </Grid>
            </Grid>
            {BuildScoreRows(props.leftMarks, props.rightMarks)}
        </Grid>
    </div>
  );
}

function BuildScoreRows(leftMarks, rightMarks) {
    let scoreRows = [];
    for (let i = 20; i >= 15; i--) {
        let n = i.toString();
        scoreRows.push(<ScoreRow number={n} leftMarks={leftMarks[n]} rightMarks={rightMarks[n]} />);
    }
    scoreRows.push(<ScoreRow number={"B"} leftMarks={leftMarks["B"]} rightMarks={rightMarks["B"]} />);

    return scoreRows;
}
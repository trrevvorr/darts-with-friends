import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ScoreRow from './ScoreRow';
import HeaderRow from './HeaderRow';


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    textAlign: "center",
  },
}));

export default function CricketScoreBoard(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
        <Grid container spacing={0}>
            <HeaderRow 
                leftPlayer={props.leftPlayer} 
                rightPlayer={props.rightPlayer} 
                leftMarks={props.leftMarks} 
                rightMarks={props.rightMarks} 
                turnNumber={props.turnNumber}
            />
            {BuildScoreRows(props.leftMarks, props.rightMarks)}
        </Grid>
    </div>
  );
}

function BuildScoreRows(leftMarks, rightMarks) {
    let scoreRows = [];
    for (let i = 20; i >= 15; i--) {
        let n = i.toString();
        scoreRows.push(<ScoreRow number={n} leftMarks={leftMarks[n]} rightMarks={rightMarks[n]} key={i} />);
    }
    scoreRows.push(<ScoreRow number={"B"} leftMarks={leftMarks["B"]} rightMarks={rightMarks["B"]} />);

    return scoreRows;
}
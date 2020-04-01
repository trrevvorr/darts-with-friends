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
            <Grid container item spacing={0}>
                <HeaderRow 
                    leftPlayer={props.leftPlayer} 
                    rightPlayer={props.rightPlayer} 
                    leftMarks={props.leftMarks} 
                    rightMarks={props.rightMarks} 
                    isLeftPlayersTurn={props.isLeftPlayersTurn}
                />
                {BuildScoreRows(props.leftMarks, props.rightMarks, props.addNewMark, props.isLeftPlayersTurn, props.turnActions, props.numThrowsThisTurn, props.gameIsWon)}
            </Grid>
        </div>
    );
}

function BuildScoreRows(leftMarks, rightMarks, addNewMark, isLeftPlayersTurn, turnActions, numThrowsThisTurn, gameIsWon) {
    let scoreRows = [];
    ["20", "19", "18", "17", "16", "15", "B"].forEach(n => {
        scoreRows.push(<ScoreRow
            number={n}
            leftMarks={leftMarks[n]}
            rightMarks={rightMarks[n]}
            addNewMark={addNewMark}
            key={n} 
            isLeftPlayersTurn={isLeftPlayersTurn}
            turnActions={turnActions}
            numThrowsThisTurn={numThrowsThisTurn}
            gameIsWon={gameIsWon}
        />);
    });

    return scoreRows;
}
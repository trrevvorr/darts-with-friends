import React from 'react';
import Container from "@material-ui/core/Container";
import { makeStyles } from '@material-ui/core/styles';
import CricketScoreBoard from './CricketScoreBoard'
import ButtonBar from './ButtonBar';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    wrapper: {
        height: "90vh",
    },
    fab: {
        position: "absolute",
        bottom: theme.spacing(4),
        right: theme.spacing(4),
    }

}));

export default function CricketGame(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.wrapper} >
                <Container maxWidth="sm">
                    <CricketScoreBoard
                        leftPlayer={props.leftPlayer}
                        rightPlayer={props.rightPlayer}
                        leftScore={props.turnState.leftScore}
                        rightScore={props.turnState.rightScore}
                        leftMarks={props.turnState.leftMarks}
                        rightMarks={props.turnState.rightMarks}
                        isLeftPlayersTurn={props.isLeftPlayersTurn}
                        addNewMark={props.addNewMark}
                        turnHistory={props.turnHistory}
                        numThrowsThisTurn={props.numThrowsThisTurn}
                        winner={props.winner}
                    />
                    <ButtonBar endTurn={props.endTurn} undoAction={props.undoAction} winner={props.winner} actionNumber={props.actionNumber} startNewGame={props.startNewGame}/>
                </Container>
            </div>
        </div>
    );
}

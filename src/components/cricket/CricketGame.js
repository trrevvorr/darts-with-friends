import React from 'react';
import HeaderBar from "../general/HeaderBar";
import Container from "@material-ui/core/Container";
import { makeStyles } from '@material-ui/core/styles';
import CricketScoreBoard from './CricketScoreBoard'
import ButtonBar from './ButtonBar';
import { isLeftPlayersTurn } from "../../helpers/cricket/Calculations"

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    wrapper: {
        height: "100vh",
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
                <HeaderBar></HeaderBar>
                <Container maxWidth="sm">
                    <CricketScoreBoard
                        leftPlayer={props.leftPlayer}
                        rightPlayer={props.rightPlayer}
                        leftScore={props.turnState.leftScore}
                        rightScore={props.turnState.rightScore}
                        leftMarks={props.turnState.leftMarks}
                        rightMarks={props.turnState.rightMarks}
                        isLeftPlayersTurn={isLeftPlayersTurn(props.turnState.turnNumber)}
                        addNewMark={props.addNewMark}
                    />
                    <ButtonBar endTurn={props.endTurn} undoAction={props.undoAction} />
                </Container>
            </div>
        </div>
    );
}

import React from 'react';
import HeaderBar from "../general/HeaderBar";
import Container from "@material-ui/core/Container";
import { makeStyles } from '@material-ui/core/styles';
import CricketScoreBoard from './CricketScoreBoard'
import ButtonBar from './ButtonBar';

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

/*
{
    leftMarks: { "20": 0, "19": 0, "18": 0, "17": 0, "16": 0, "15": 0, "B": 0 },
    leftScore: 0,
    rightMarks: { "20": 0, "19": 0, "18": 0, "17": 0, "16": 0, "15": 0, "B": 0 },
    rightScore: 0,
}
*/
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
                turnNumber={props.turnState.turnNumber}
                addNewMark={props.addNewMark}
            />
            <ButtonBar endTurn={props.endTurn} undoAction={props.undoAction} />
        </Container>
      </div>
    </div>
  );
}

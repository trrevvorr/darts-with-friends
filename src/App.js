import React from 'react';
import './App.css';
import 'typeface-roboto';
import Helmet from "react-helmet";
import CricketGame from './components/cricket/CricketGame';
import { isLeftPlayersTurn, calcMinThrowsForMarks } from "./helpers/cricket/Calculations";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline, createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
    palette: {
      type: "dark"
    }
  });

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    leftMarks: { "20": 0, "19": 0, "18": 0, "17": 0, "16": 0, "15": 0, "B": 0 },
                    leftScore: 18,
                    rightMarks: { "20": 0, "19": 0, "18": 0, "17": 0, "16": 0, "15": 0, "B": 0 },
                    rightScore: 0,
                    turnNumber: 0,
                }
            ],
            leftPlayer: "Nancy",
            rightPlayer: "Trevor",
            actionNumber: 0,
        };
        this.addNewMark = this.addNewMark.bind(this);
        this.endTurn = this.endTurn.bind(this);
        this.undoAction = this.undoAction.bind(this);
        this.getTurnHistory = this.getTurnHistory.bind(this);
        this.countThrowsThisTurn = this.countThrowsThisTurn.bind(this);
    }

    deepCopy(obj) {
        // TODO: this does not work if you store functions in the state, use library instead
        return JSON.parse(JSON.stringify(obj));
    }

    addNewMark(number) {
        const newState = this.deepCopy(this.state);
        newState.history.push(this.deepCopy(newState.history[newState.actionNumber]));
        newState.actionNumber++;
        const turnNumber = newState.history[newState.actionNumber].turnNumber;

        if (isLeftPlayersTurn(turnNumber)) {
            newState.history[newState.actionNumber].leftMarks[number]++;
        } else {
            newState.history[newState.actionNumber].rightMarks[number]++;
        }

        const numThrowsThisTurn = this.countThrowsThisTurn(this.getTurnHistory(newState), isLeftPlayersTurn(turnNumber));
        if (numThrowsThisTurn <= 3) {
            this.setState(newState)
        }
    }

    endTurn() {
        const newState = this.deepCopy(this.state);
        newState.history.push(this.deepCopy(newState.history[newState.actionNumber]));
        newState.actionNumber++;
        newState.history[newState.actionNumber].turnNumber++;

        this.setState(newState);
    }

    undoAction() {
        if (this.state.actionNumber > 0) {
            const newState = this.deepCopy(this.state);
            newState.history.pop();
            newState.actionNumber--;
            this.setState(newState);
        }
    }

    getTurnHistory(state) {
        let actionNum = state.actionNumber; 
        const currentTurn = state.history[actionNum].turnNumber;
        const turnHistory = [];

        while (actionNum >= 0 && state.history[actionNum].turnNumber === currentTurn) {
            turnHistory.push(this.deepCopy(state.history[actionNum]));
            actionNum--;
        }

        return turnHistory.reverse();
    }

    countThrowsThisTurn(turnHistory, isLeftsTurn) {
        let numThrows = 0;
        let marksKey = isLeftsTurn ? "leftMarks" : "rightMarks";

        ["20", "19", "18", "17", "16", "15", "B"].forEach(n => {
            const originalMarksScored = turnHistory[0][marksKey][n];
            const currentMarksScored = turnHistory[turnHistory.length - 1][marksKey][n];
            const numMarks = currentMarksScored - originalMarksScored;
            numThrows += calcMinThrowsForMarks(numMarks);
        });
    
        return numThrows;
    }

    render() {
        const turnHistory = this.getTurnHistory(this.state);
        const numThrowsThisTurn = this.countThrowsThisTurn(turnHistory, isLeftPlayersTurn(this.state.turnNumber));

        return (
            <ThemeProvider theme={theme}>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Darts With Friends</title>
                    <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                </Helmet>
                <CssBaseline />
                <CricketGame
                    leftPlayer={this.state.leftPlayer}
                    rightPlayer={this.state.rightPlayer}
                    turnState={this.state.history[this.state.actionNumber]}
                    addNewMark={this.addNewMark}
                    endTurn={this.endTurn}
                    undoAction={this.undoAction}
                    turnHistory={turnHistory}
                    numThrowsThisTurn={numThrowsThisTurn}
                />
            </ThemeProvider>
        );
    }
}

export default App;

import React from 'react';
import CricketGame from './CricketGame';
import { calcIsLeftPlayersTurn, getTurnHistory, countThrowsThisTurn, validateState, calculateWinner } from "../../helpers/cricket/Calculations";
import { deepCopy } from "../../helpers/general/Calculations";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    leftMarks: { "20": 0, "19": 0, "18": 0, "17": 0, "16": 0, "15": 0, "B": 0 },
                    rightMarks: { "20": 0, "19": 0, "18": 0, "17": 0, "16": 0, "15": 0, "B": 0 },
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
    }

    addNewMark(number) {
        const newState = deepCopy(this.state);
        newState.history.push(deepCopy(newState.history[newState.actionNumber]));
        newState.actionNumber++;
        const turnNumber = newState.history[newState.actionNumber].turnNumber;
        const isLeftPlayersTurn = calcIsLeftPlayersTurn(turnNumber);

        if (isLeftPlayersTurn) {
            newState.history[newState.actionNumber].leftMarks[number]++;
        } else {
            newState.history[newState.actionNumber].rightMarks[number]++;
        }

        if (validateState(newState)) {
            this.setState(newState)
        }
    }

    endTurn() {
        const newState = deepCopy(this.state);
        newState.history.push(deepCopy(newState.history[newState.actionNumber]));
        newState.actionNumber++;
        newState.history[newState.actionNumber].turnNumber++;

        this.setState(newState);
    }

    undoAction() {
        if (this.state.actionNumber > 0) {
            const newState = deepCopy(this.state);
            newState.history.pop();
            newState.actionNumber--;
            this.setState(newState);
        }
    }

    render() {
        const actionNumber = this.state.actionNumber;
        const turnNumber = this.state.history[actionNumber].turnNumber;
        const turnHistory = getTurnHistory(this.state, turnNumber);
        const isLeftPlayersTurn = calcIsLeftPlayersTurn(turnNumber);
        const numThrowsThisTurn = countThrowsThisTurn(turnHistory, isLeftPlayersTurn);
        const winner = calculateWinner(this.state, actionNumber);

        return (
            <CricketGame
                leftPlayer={this.state.leftPlayer}
                rightPlayer={this.state.rightPlayer}
                turnState={this.state.history[actionNumber]}
                addNewMark={this.addNewMark}
                endTurn={this.endTurn}
                undoAction={this.undoAction}
                turnHistory={turnHistory}
                numThrowsThisTurn={numThrowsThisTurn}
                isLeftPlayersTurn={isLeftPlayersTurn}
                winner={winner}
                actionNumber={actionNumber}
            />
        );
    }
}

export default App;

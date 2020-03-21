import React from 'react';
import './App.css';
import 'typeface-roboto';
import Helmet from "react-helmet";
import CricketGame from './components/cricket/CricketGame';
import { isLeftPlayersTurn } from "./helpers/cricket/Calculations";

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
  }

  deepCopy(obj) {
    // TODO: this does not work if you store functions in the state, use library instead
    return JSON.parse(JSON.stringify(obj));
  }

  addNewMark(number) {
    const newState = this.deepCopy(this.state);
    newState.history.push(this.deepCopy(newState.history[newState.actionNumber]));
    newState.actionNumber += 1;

    if (isLeftPlayersTurn(newState.history[newState.actionNumber].turnNumber)) {
      newState.history[newState.actionNumber].leftMarks[number] += 1;
    } else {
      newState.history[newState.actionNumber].rightMarks[number] += 1;
    }

    this.setState(newState)
  }

  endTurn() {
    const newState = this.deepCopy(this.state);
    newState.history.push(this.deepCopy(newState.history[newState.actionNumber]));
    newState.actionNumber += 1;
    newState.history[newState.actionNumber].turnNumber += 1;

    this.setState(newState);
  }
  
  undoAction() {
    if (this.state.actionNumber > 0) {
      const newState = this.deepCopy(this.state);
      newState.history.pop();
      newState.actionNumber -= 1;
      this.setState(newState);
    }
  }

  render() {
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Darts With Friends</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Helmet>
        <CricketGame 
          leftPlayer={this.state.leftPlayer} 
          rightPlayer={this.state.rightPlayer} 
          turnState={this.state.history[this.state.actionNumber]}
          addNewMark={this.addNewMark}
          endTurn={this.endTurn}
          undoAction={this.undoAction}
        />
      </div>
    );
  }
}

export default App;

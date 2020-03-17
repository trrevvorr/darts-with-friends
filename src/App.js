import React from 'react';
import './App.css';
import 'typeface-roboto';
import Helmet from "react-helmet";
import CricketGame from './components/cricket/CricketGame'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          leftMarks: { "20": 2, "19": 3, "18": 4, "17": 0, "16": 0, "15": 0, "B": 0 },
          leftScore: 18,
          rightMarks: { "20": -1, "19": 0, "18": 1, "17": 0, "16": 0, "15": 0, "B": 0 },
          rightScore: 0,
        }
      ],
      leftPlayer: "Nancy",
      rightPlayer: "Trevor",
      turnNumber: 0,
    };
  }

  deepCopyState() {
    // TODO: this does not work if you store functions in the state, use library instead
    return JSON.parse(JSON.stringify(this.state));
  }
  
  render() {
    const currentState = this.deepCopyState();
    const currentTurnState = currentState.history[currentState.turnNumber];
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Darts With Friends</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Helmet>
        <CricketGame 
          leftPlayer={currentState.leftPlayer} 
          rightPlayer={currentState.rightPlayer} 
          turnState={currentTurnState} 
        />
      </div>
    );
  }
}

export default App;

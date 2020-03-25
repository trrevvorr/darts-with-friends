import React from 'react';
import './App.css';
import 'typeface-roboto';
import Helmet from "react-helmet";
import Cricket from './components/cricket/Cricket';
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline, createMuiTheme } from "@material-ui/core";
import HeaderBar from "./components/general/HeaderBar";
import { v4 as uuidv4 } from 'uuid';
import NewGameForm from './components/general/NewGameForm';
import { deepCopy } from './helpers/general/Calculations';

const theme = createMuiTheme({
    palette: {
        type: "dark"
    }
});

const INITIAL_STATE = {
    id: null,
    gameInProgress: null,
    players: {},
    games: {}
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.initializeState();

        this.startGameWithOptions = this.startGameWithOptions.bind(this);
        this.initializeState = this.initializeState.bind(this);
        this.newGameWithSameOptionsFactory = this.newGameWithSameOptionsFactory.bind(this);
    }

    initializeState() {
        const initialState = INITIAL_STATE;
        return initialState;
    }

    getHeaderBarTitle() {
        if (this.state.gameInProgress === null) {
            return "New Game";
        } else {
            return this.state.games[this.state.gameInProgress].type;
        }
    }

    getPageComponent() {
        if (this.state.gameInProgress === null) {
            return <NewGameForm startGameWithOptions={this.startGameWithOptions} />;
        } else {
            const options = {
                players: this.state.players,
                gameType: this.state.games[this.state.gameInProgress].type,
            };
            const createNewGame = this.newGameWithSameOptionsFactory(options); 
            return (<Cricket 
                leftName={this.state.players[0].name} 
                rightName={this.state.players[1].name} 
                createNewGame={createNewGame} 
                id={this.state.gameInProgress} 
                key={this.state.gameInProgress}
            />);
        }
    }

    startGameWithOptions(options) {
        const newState = deepCopy(this.state);
        const newGameId = uuidv4();

        newState.gameInProgress = newGameId;
        newState.players = options.players;
        newState.games[newGameId] = {
            type: options.gameType,
        };

        this.setState(newState);
    }

    newGameWithSameOptionsFactory(options) {
        return () => {
            this.startGameWithOptions(options);
        }
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Darts With Friends</title>
                    <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                </Helmet>
                <CssBaseline />
                <HeaderBar title={this.getHeaderBarTitle()} />
                {this.getPageComponent()}
            </ThemeProvider>
        );
    }
}

export default App;

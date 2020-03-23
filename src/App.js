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

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeGameType: "",
            players: [
            ],
            cricket: {
                activeGameId: "1"
            }
        };

        this.startGameWithOptions = this.startGameWithOptions.bind(this);
    }

    getHeaderBarTitle() {
        if (this.state.activeGameType === "") {
            return "New Game";
        } else {
            return this.state.activeGameType;
        }
    }

    getPageComponent() {
        if (this.state.activeGameType === "") {
            return <NewGameForm startGameWithOptions={this.startGameWithOptions} />;
        } else {
            return <Cricket leftName={this.state.players[0].name} rightName={this.state.players[1].name} />
        }
    }

    startGameWithOptions(options) {
        const newState = deepCopy(this.state);

        newState.activeGameType = options.gameType;
        newState.players = options.players;

        this.setState(newState);
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

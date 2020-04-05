import React from 'react';
import './App.css';
import 'typeface-roboto';
import Helmet from "react-helmet";
import Cricket from './components/cricket/Cricket';
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline, createMuiTheme } from "@material-ui/core";
import SelectGameForm from './components/general/SelectGameForm';
import { deepCopy, debugLog } from './helpers/general/Calculations';
import LoadingScreen from './components/general/LoadingScreen';
import ErrorScreen from './components/general/ErrorScreen';
import SelectMatchForm from './components/general/SelectMatchForm';
import * as Database from "./helpers/general/DatabaseOperations";
import { blue, orange, } from '@material-ui/core/colors';

const theme = createMuiTheme({
    palette: {
        type: "dark",
        primary: blue,
        secondary: orange,
    }
});

const APP_PAGE_TYPES = {
    ERROR: "error_type",
    NO_ACTIVE_USER: "no_active_user",
    NO_ACTIVE_USER_LOADED: "no_active_user_loaded",
    NO_ACTIVE_MATCH: "no_active_match",
    NO_ACTIVE_MATCH_LOADED: "no_active_match_loaded",
    NO_ACTIVE_GAME: "no_active_game",
    NO_ACTIVE_GAME_LOADED: "no_active_game_loaded",
    ACTIVE_GAME_LOADED: "active_game_loaded",
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.initializeState();

        this.setActiveGame = this.setActiveGame.bind(this);
        this.initializeState = this.initializeState.bind(this);
        this.loadUserStateFromDatabase = this.loadUserStateFromDatabase.bind(this);
        this.loadMatchStateFromDatabase = this.loadActiveMatchStateFromDatabase.bind(this);
        this.loadGameStateFromDatabase = this.loadActiveGameStateFromDatabase.bind(this);
        this.getAppPageType = this.getAppPageType.bind(this);
        this.setErrorState = this.setErrorState.bind(this);
        this.getNameByPlayerId = this.getNameByPlayerId.bind(this);
        this.endActiveGame = this.endActiveGame.bind(this);
        this.getCricketComponent = this.getCricketComponent.bind(this);
        this.exitActiveMatch = this.exitActiveMatch.bind(this);
        this.endActiveMatch = this.endActiveMatch.bind(this);
        this.setActiveMatch = this.setActiveMatch.bind(this);
        this.getErrorComponent = this.getErrorComponent.bind(this);
        this.determineWinnersOfActiveMatch = this.determineWinnersOfActiveMatch.bind(this);
        this.setGamesForMatch = this.setGamesForMatch.bind(this);
    }

    //#region lifecycle methods

    componentDidMount() {
        this.loadUserStateFromDatabase();
    }

    componentDidCatch(error, info) {
        console.log("error", error);
        console.log("info", info);
        this.setErrorState("There was a problem loading the page. Please try ending the game, or match and starting over.");
    }

    //#endregion

    //#region state setters

    initializeState() {
        const initialState = deepCopy(INITIAL_STATE);
        return initialState;
    }

    setErrorState(message) {
        const newState = deepCopy(this.state);
        newState.errorMessage = message;
        this.setState(newState);
    }

    setGamesForMatch(gamesItems) {
        const newState = deepCopy(this.state);
        newState.activeMatch.games = gamesItems.map(game => applyGameDataToGameState(game, INITIAL_GAME_STATE));
        this.setState(newState);
    }

    //#endregion

    //#region load from database

    async loadUserStateFromDatabase() {
        try {
            const userData = await Database.getUserById(this.state.userId);
            const newState = applyUserDataToUserState(userData, this.state);
            this.setState(newState)
        } catch (err) {
            console.error('error fetching user', err);
            this.setErrorState("Failed to Access User Data");
        }
    }

    async loadActiveMatchStateFromDatabase() {
        try {
            const matchData = await Database.getMatchById(this.state.activeMatchId);
            const newState = deepCopy(this.state);
            newState.activeMatch = applyMatchDataToMatchState(matchData, INITIAL_MATCH_STATE);
            this.setState(newState)
        } catch (err) {
            console.error('error fetching match', err);
            this.setErrorState("Failed to Access Match Data");
        }
    }

    async loadActiveGameStateFromDatabase() {
        try {
            if (!this.state.activeMatchId || !this.state.activeMatch) {
                throw new Error(`loadActiveGameStateFromDatabase called without an active match set in state`);
            }

            const getGameData = await Database.getGameById(this.state.activeMatch.activeGameId);
            const newState = deepCopy(this.state);
            newState.activeMatch.activeGame = applyGameDataToGameState(getGameData, INITIAL_GAME_STATE);
            this.setState(newState)
        } catch (err) {
            console.error('error fetching game', err);
            this.setErrorState("Failed to Access Game Data");
        }
    }

    //#endregion

    //#region save to database

    async setActiveMatch(matchData) {
        try {
            if (!matchData.userId || (matchData.userId !== this.state.userId)) {
                throw new Error(`matchData.userId (${matchData.userId}) must match the userId (${this.state.userId})`);
            }

            const newState = deepCopy(this.state);
            newState.activeMatchId = await Database.updateUserSetActiveMatch(newState.userId, matchData.id);
            newState.activeMatch = applyMatchDataToMatchState(matchData, INITIAL_MATCH_STATE);
            this.setState(newState);
        } catch (err) {
            console.error("failed to setActiveMatch", err);
            this.setErrorState("Failed to Set Active Match");
        }
    }

    async endActiveMatch() {
        try {
            if (!this.state.activeMatch) {
                throw new Error(`endActiveMatch called without an active match set in state`);
            }

            const winners = this.determineWinnersOfActiveMatch();
            const newState = deepCopy(this.state);
            await Database.updateMatchSetWinners(newState.activeMatchId, winners);
            this.exitActiveMatch();
        } catch (err) {
            console.error("failed to endActiveMatch", err);
            this.setErrorState("Failed to End Match");
        }
    }

    async exitActiveMatch() {
        try {
            const newState = deepCopy(this.state);
            newState.activeMatchId = await Database.updateUserSetActiveMatch(newState.userId, null);
            newState.activeMatch = null;
            this.setState(newState);
        } catch (err) {
            console.error("failed to exitActiveMatch", err);
            this.setErrorState("Failed to Exit Match");
        }
    }

    async setActiveGame(gameData) {
        try {
            if (!this.state.activeMatchId || !this.state.activeMatch) {
                throw new Error(`setActiveGame called without an active match set in state`);
            }
            if (!gameData.matchId || (gameData.matchId !== this.state.activeMatchId)) {
                throw new Error(`gameData.matchId (${gameData.matchId}) must match the activeMatchId (${this.state.activeMatchId})`);
            }

            const newState = deepCopy(this.state);
            newState.activeMatch.activeGameId = await Database.updateMatchSetActiveGame(newState.activeMatchId, gameData.id);
            newState.activeMatch.activeGame = applyGameDataToGameState(gameData, INITIAL_GAME_STATE);
            this.setState(newState);
        } catch (err) {
            console.error("failed to setActiveGame", err);
            this.setErrorState("Failed to Set Active Game");
        }
    }

    async endActiveGame(doEndMatchAfter = false) {
        try {
            const newState = deepCopy(this.state);
            newState.activeMatch.activeGameId = await Database.updateMatchSetActiveGame(newState.activeMatchId, null);
            newState.activeMatch.activeGame = null;

            if (doEndMatchAfter) {
                this.exitActiveMatch();
            } else {
                this.setState(newState);
            }
        } catch (err) {
            console.error("failed to endActiveGame", err);
            this.setErrorState("Failed to End Game");
        }
    }

    //#endregion

    //#region helper methods

    getNameByPlayerId(id) {
        if (id === this.state.userId) {
            return this.state.name;
        } else {
            const opponents = this.state.activeMatch.opponents;
            for (let i = 0; i < opponents.length; i++) {
                if (id === opponents[i].id) {
                    return opponents[i].name;
                }
            }
        }
        throw new Error("opponent not found for id: " + id);
    }

    determineWinnersOfActiveMatch() {
        if (!this.state.activeMatchId || !this.state.activeMatch) {
            throw new Error(`setActiveGame called without an active match set in state`);
        }
        if (!this.state.activeMatch.games) {
            throw new Error(`setActiveGame called without games loaded`);
        }

        const winsByPlayerId = {};
        winsByPlayerId[this.state.userId] = 0;
        this.state.activeMatch.opponents.forEach(opp => {
            winsByPlayerId[opp.id] = 0;
        });

        let maxWins = 0;
        for (let i = 0; i < this.state.activeMatch.games.length; i++) {
            const game = this.state.activeMatch.games[i];
            if (game.winner) {
                winsByPlayerId[game.winner.id]++;
                if (winsByPlayerId[game.winner.id] > maxWins) {
                    maxWins = winsByPlayerId[game.winner.id];
                }
            } else {
                return null; // if a single game is incomplete, match is incomplete
            }
        };

        const winningPlayerIds = Object.keys(winsByPlayerId).filter(playerId => winsByPlayerId[playerId] === maxWins);
        return winningPlayerIds.map(playerId => { return { id: playerId, isUser: playerId === this.state.userId } });
    }

    //#endregion

    //#region page type handlers

    getAppPageType() {
        if (this.state.errorMessage) {
            return APP_PAGE_TYPES.ERROR;
        } else {
            if (this.state.userId) {
                if (this.state.name) {
                    if (this.state.activeMatchId) {
                        if (this.state.activeMatch) {
                            if (this.state.activeMatch.activeGameId) {
                                if (this.state.activeMatch.activeGame) {
                                    return APP_PAGE_TYPES.ACTIVE_GAME_LOADED;
                                } else {
                                    return APP_PAGE_TYPES.NO_ACTIVE_GAME_LOADED;
                                }
                            } else {
                                return APP_PAGE_TYPES.NO_ACTIVE_GAME;
                            }
                        } else {
                            return APP_PAGE_TYPES.NO_ACTIVE_MATCH_LOADED;
                        }
                    } else {
                        return APP_PAGE_TYPES.NO_ACTIVE_MATCH;
                    }
                } else {
                    return APP_PAGE_TYPES.NO_ACTIVE_USER_LOADED;
                }
            } else {
                return APP_PAGE_TYPES.NO_ACTIVE_USER;
            }
        }
    }

    getPageComponent() {
        let pageComponent;
        try {
            const pageType = this.getAppPageType();
            switch (pageType) {
                case APP_PAGE_TYPES.NO_ACTIVE_USER:
                    pageComponent = this.getErrorComponent("Log In", "User Login Not Yet Supported");
                    break;
                case APP_PAGE_TYPES.NO_ACTIVE_USER_LOADED:
                    pageComponent = <LoadingScreen
                        message="Loading"
                        headerBarTitle="Loading"
                        activityMenuOptions={[]}
                    />;
                    break;
                case APP_PAGE_TYPES.NO_ACTIVE_MATCH:
                    pageComponent = <SelectMatchForm
                        userName={this.state.name}
                        userId={this.state.userId}
                        setActiveMatch={this.setActiveMatch}
                        setErrorState={this.setErrorState}
                        headerBarTitle="Select Match"
                        activityMenuOptions={[]}
                    />;
                    break;
                case APP_PAGE_TYPES.NO_ACTIVE_MATCH_LOADED:
                    this.loadActiveMatchStateFromDatabase();
                    pageComponent = <LoadingScreen
                        message="Loading Match"
                        headerBarTitle="Loading Match"
                        activityMenuOptions={[]}
                    />;
                    break;
                case APP_PAGE_TYPES.NO_ACTIVE_GAME:
                    pageComponent = <SelectGameForm
                        setActiveGame={this.setActiveGame}
                        setErrorState={this.setErrorState}
                        userId={this.state.userId}
                        matchId={this.state.activeMatchId}
                        opponents={this.state.activeMatch.opponents}
                        headerBarTitle="Select Game"
                        activityMenuOptions={[
                            { title: "Exit Match", handleClick: () => this.exitActiveMatch(), },
                            {
                                title: "End Match", handleClick: () => this.endActiveMatch(),
                                requireConfirmation: {
                                    message: "Ending a match permanently declares a winner and cannot be undone. If you plan to continue this match later, use the \"Exit Match\" option. If there are any games still in progress, this match will be exited instead."
                                },
                            },
                        ]}
                        getNameByPlayerId={this.getNameByPlayerId}
                        setGamesForMatch={this.setGamesForMatch}
                        games={this.state.activeMatch.games}
                    />;
                    break;
                case APP_PAGE_TYPES.NO_ACTIVE_GAME_LOADED:
                    this.loadActiveGameStateFromDatabase();
                    pageComponent = <LoadingScreen
                        message="Loading Game"
                        headerBarTitle="Loading Game"
                        activityMenuOptions={[]}
                    />;
                    break;
                case APP_PAGE_TYPES.ACTIVE_GAME_LOADED:
                    const activeGame = this.state.activeMatch.activeGame;
                    pageComponent = this.getCricketComponent(activeGame);
                    break;
                case APP_PAGE_TYPES.ERROR:
                    pageComponent = this.getErrorComponent("Error", this.state.errorMessage);
                    break;
                default:
                    console.error("Unsupported Page Type: " + pageType);
                    this.setErrorState("Unsupported Page Type: " + pageType);
                    break;
            }
        } catch (e) {
            console.error(e);
            pageComponent = this.getErrorComponent("Error", "There was a problem loading the page. Please try ending the game, or match and starting over.");
        }

        return pageComponent;
    }

    //#endregion

    //#region component factories

    getErrorComponent(title, message) {
        const activityMenuOptions = [];
        if (this.state.activeMatchId || this.state.activeMatch) {
            activityMenuOptions.push({ title: "Exit Match", handleClick: () => this.exitActiveMatch() });
        }
        if (this.state.activeMatch && (this.state.activeMatch.activeGameId || this.state.activeMatch.activeGame)) {
            activityMenuOptions.push({ title: "End Game", handleClick: () => this.endActiveGame(false) });
        }

        return <ErrorScreen
            message={message}
            headerBarTitle={title}
            activityMenuOptions={activityMenuOptions}
        />;
    }

    getCricketComponent(activeGame) {
        if (activeGame.playerOrder.length < 2) {
            throw new Error(`activeGame.playerOrder required to be >= 2 but found ${activeGame.playerOrder.length}`);
        }

        const leftPlayer = {
            id: activeGame.playerOrder[0].id,
            name: this.getNameByPlayerId(activeGame.playerOrder[0].id),
            isUser: activeGame.playerOrder[0].isUser,
        }
        const rightPlayer = {
            id: activeGame.playerOrder[1].id,
            name: this.getNameByPlayerId(activeGame.playerOrder[1].id),
            isUser: activeGame.playerOrder[1].isUser,
        }
        return <Cricket
            activeGame={activeGame}
            leftPlayer={leftPlayer}
            rightPlayer={rightPlayer}
            endCurrentGame={this.endActiveGame}
            endCurrentMatch={this.exitActiveMatch}
            id={activeGame.id}
            key={activeGame.id}
            setErrorState={this.setErrorState}
            headerBarTitle="Cricket"
            activityMenuOptions={[]}
        />;
    }

    //#endregion

    render() {
        debugLog("APP STATE", this.state);
        return (
            <ThemeProvider theme={theme}>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Darts With Friends</title>
                    <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                </Helmet>
                <CssBaseline />
                {this.getPageComponent()}
            </ThemeProvider>
        );
    }
}

//#region template states

const INITIAL_STATE = {
    userId: "user_id", // TODO: null, this is used when mocking out graphql database
    name: null,
    matches: null,
    activeMatchId: null,
    activeMatch: null,
    errorMessage: null,
};

const INITIAL_MATCH_STATE = {
    id: null,
    activeGameId: null,
    createdAt: null,
    games: null,
    settings: null,
    opponents: null,
    winners: null,
};

const INITIAL_GAME_STATE = {
    id: null,
    createdAt: null,
    matchId: null,
    type: null,
    actions: null,
    settings: null,
    playerOrder: null,
    winner: null,
}

//#endregion

//#region database object to state mappers

/**
 * given user data from database, apply it to the passed in user state object
 * @param {Object} userData user database graphQL object
 * @param {Object} state  user state object (reference `INITIAL_STATE`)
 */
function applyUserDataToUserState(userData, state) {
    const newState = deepCopy(state)
    newState.name = userData.name;
    newState.activeMatchId = userData.activeMatchId;
    newState.name = userData.name;
    return newState;
}

/**
 * given match data from database, apply it to the passed in match state object
 * @param {Object} matchData match database graphQL object
 * @param {Object} matchState match state object (reference `INITIAL_MATCH_STATE`)
 */
function applyMatchDataToMatchState(matchData, matchState) {
    const newMatchState = deepCopy(matchState);
    newMatchState.id = matchData.id;
    newMatchState.activeGameId = matchData.activeGameId;
    newMatchState.createdAt = matchData.createdAt;
    newMatchState.opponents = matchData.opponents.items;
    newMatchState.settings = matchData.settings;
    newMatchState.winners = matchData.winners ? matchData.winners.items : null;
    return newMatchState;
}

/**
 * given game data from database, apply it to the passed in game state object
 * @param {Object} gameData game database graphQL object
 * @param {Object} gameState game state object (reference `INITIAL_GAME_STATE`)
 */
function applyGameDataToGameState(gameData, gameState) {
    const newGameState = deepCopy(gameState);
    newGameState.id = gameData.id;
    newGameState.matchId = gameData.matchId;
    newGameState.createdAt = gameData.createdAt;
    newGameState.type = gameData.type;
    newGameState.settings = gameData.settings;
    newGameState.playerOrder = gameData.playerOrder;
    newGameState.actions = gameData.actions;
    newGameState.winner = gameData.winner;
    return newGameState;
}

//#endregion

export default App;

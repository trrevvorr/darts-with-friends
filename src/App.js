import React from 'react';
import './App.css';
import 'typeface-roboto';
import Helmet from "react-helmet";
import Cricket from './components/cricket/Cricket';
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline, createMuiTheme } from "@material-ui/core";
import { v4 as uuidv4 } from 'uuid';
import NewGameForm from './components/general/NewGameForm';
import { deepCopy } from './helpers/general/Calculations';
import { API, graphqlOperation } from 'aws-amplify'
import { updateUser, updateMatch } from './graphql/mutations'
import { getUser, getMatch, getGame } from './graphql/queries'
import LoadingScreen from './components/general/LoadingScreen';
import ErrorScreen from './components/general/ErrorScreen';
import NewMatchForm from './components/general/NewMatchForm';

const theme = createMuiTheme({
    palette: {
        type: "dark"
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
        this.loadMatchStateFromDatabase = this.loadMatchStateFromDatabase.bind(this);
        this.loadGameStateFromDatabase = this.loadGameStateFromDatabase.bind(this);
        this.getAppPageType = this.getAppPageType.bind(this);
        this.setErrorState = this.setErrorState.bind(this);
        this.getNameByPlayerId = this.getNameByPlayerId.bind(this);
        this.endActiveGame = this.endActiveGame.bind(this);
        this.getCricketComponent = this.getCricketComponent.bind(this);
        this.endActiveMatch = this.endActiveMatch.bind(this);
        this.setActiveMatch = this.setActiveMatch.bind(this);
        this.getErrorComponent = this.getErrorComponent.bind(this);
    }

    initializeState() {
        const initialState = deepCopy(INITIAL_STATE);
        return initialState;
    }

    componentDidMount() {
        this.loadUserStateFromDatabase();
    }

    componentDidCatch(error, info) {
        console.log("error", error);
        console.log("info", info);
        this.setErrorState("componentDidCatch");
    }

    async loadUserStateFromDatabase() {
        try {
            const user = await API.graphql(graphqlOperation(getUser, { id: this.state.userId }));
            console.log("USER DATA", user);
            const newState = applyUserDataToUserState(user.data.getUser, this.state);
            this.setState(newState)
        } catch (err) {
            console.error('error fetching user', err);
            this.setErrorState("Failed to Access User Data");
        }
    }

    async loadMatchStateFromDatabase(matchId) {
        try {
            const match = await API.graphql(graphqlOperation(getMatch, { id: matchId }));
            console.log("MATCH DATA", match);

            const newState = deepCopy(this.state);
            const newMatchState = applyMatchDataToMatchState(match.data.getMatch, INITIAL_MATCH_STATE);
            newState.activeMatch = newMatchState;
            this.setState(newState)
        } catch (err) {
            console.error('error fetching match', err);
            this.setErrorState("Failed to Access Match Data");
        }
    }

    async loadGameStateFromDatabase(gameId) {
        try {
            const getGameOutput = await API.graphql(graphqlOperation(getGame, { id: gameId }));
            console.log("GAME DATA", getGameOutput);
            const getGameData = getGameOutput.data.getGame;

            const newState = deepCopy(this.state);
            const newGameState = applyGameDataToGameState(getGameData, INITIAL_GAME_STATE);
            newState.activeMatch.activeGame = newGameState;
            this.setState(newState)
        } catch (err) {
            console.error('error fetching game', err);
            this.setErrorState("Failed to Access Game Data");
        }
    }

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
        throw new Error("ame not found for id: " + id);
    }

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
                    pageComponent = <NewMatchForm
                        userName={this.state.name}
                        userId={this.state.userId}
                        setActiveMatch={this.setActiveMatch}
                        setErrorState={this.setErrorState}
                        headerBarTitle="Select Match"
                        activityMenuOptions={[]}
                    />;
                    break;
                case APP_PAGE_TYPES.NO_ACTIVE_MATCH_LOADED:
                    this.loadMatchStateFromDatabase(this.state.activeMatchId);
                    pageComponent = <LoadingScreen
                        message="Loading Match"
                        headerBarTitle="Loading Match"
                        activityMenuOptions={[]}
                    />;
                    break;
                case APP_PAGE_TYPES.NO_ACTIVE_GAME:
                    pageComponent = <NewGameForm
                        setActiveGame={this.setActiveGame}
                        setErrorState={this.setErrorState}
                        userId={this.state.userId}
                        matchId={this.state.activeMatchId}
                        opponents={this.state.activeMatch.opponents}
                        headerBarTitle="Select Game"
                        activityMenuOptions={[
                            { title: "End Match", handleClick: () => this.endActiveMatch() },
                        ]}
                    />;
                    break;
                case APP_PAGE_TYPES.NO_ACTIVE_GAME_LOADED:
                    this.loadGameStateFromDatabase(this.state.activeMatch.activeGameId);
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

    getErrorComponent(title, message) {
        const activityMenuOptions = [];
        if (this.state.activeMatchId || this.state.activeMatch) {
            activityMenuOptions.push({ title: "End Match", handleClick: () => this.endActiveMatch() });
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
            id={activeGame.id}
            key={activeGame.id}
            setErrorState={this.setErrorState}
            headerBarTitle="Cricket"
            activityMenuOptions={[]}
        />;
    }

    async onCreateNewMatch(newMatchData) {
        const newState = deepCopy(this.state);
        newState.matches.push(newMatchData);

        const modifiedUserInput = {
            id: newState.userId,
            activeMatchId: newMatchData,
        }

        try {
            const modifiedUserOutput = await API.graphql(graphqlOperation(updateUser, { input: modifiedUserInput }));
            console.log("modifiedUserOutput", modifiedUserOutput);
            newState.activeMatchId = modifiedUserOutput.data.updateUser.id;
            newState.activeMatch = newMatchData;
        } catch (err) {
            console.error("failed to update User", err);
            this.setErrorState("Failed to Update User");
        }
        this.state.activeMatchId = newMatchData.id;
    }

    setErrorState(message) {
        const newState = deepCopy(this.state);
        newState.errorMessage = message;
        this.setState(newState);
    }

    async setActiveGame(gameData) {
        try {
            if (!gameData.matchId || (gameData.matchId !== this.state.activeMatchId)) {
                throw new Error(`gameData.matchId (${gameData.matchId}) must match the activeMatchId (${this.state.activeMatchId})`);
            }
            const newGameState = applyGameDataToGameState(gameData, INITIAL_GAME_STATE);
            const newState = deepCopy(this.state);
            const modifiedMatchInput = {
                id: gameData.matchId,
                activeGameId: gameData.id,
            }

            const modifiedMatchOutput = await API.graphql(graphqlOperation(updateMatch, { input: modifiedMatchInput }));
            const modifiedMatchData = modifiedMatchOutput.data.updateMatch;
            newState.activeMatch.activeGameId = modifiedMatchData.activeGameId;
            newState.activeMatch.activeGame = newGameState;
            this.setState(newState);
        } catch (err) {
            console.error("failed to update set active game", err);
            this.setErrorState("Failed to Set Active Game");
        }
    }

    async setActiveMatch(matchData) {
        try {
            if (!matchData.userId || (matchData.userId !== this.state.userId)) {
                throw new Error(`matchData.userId (${matchData.userId}) must match the userId (${this.state.userId})`);
            }
            const newMatchState = applyMatchDataToMatchState(matchData, INITIAL_MATCH_STATE);
            const newState = deepCopy(this.state);
            const modifiedUserInput = {
                id: matchData.userId,
                activeMatchId: matchData.id,
            }

            const modifiedUserOutput = await API.graphql(graphqlOperation(updateUser, { input: modifiedUserInput }));
            const modifiedUserData = modifiedUserOutput.data.updateUser;
            newState.activeMatchId = modifiedUserData.activeMatchId;
            newState.activeMatch = newMatchState;
            this.setState(newState);
        } catch (err) {
            console.error("failed to set active match", err);
            this.setErrorState("Failed to Set Active Match");
        }
    }

    async endActiveGame(endMatch) {
        try {
            const newState = deepCopy(this.state);
            const modifiedMatchInput = {
                id: this.state.activeMatch.id,
                activeGameId: null,
            }

            const modifiedMatchOutput = await API.graphql(graphqlOperation(updateMatch, { input: modifiedMatchInput }));
            const modifiedMatchData = modifiedMatchOutput.data.updateMatch;
            newState.activeMatch.activeGameId = modifiedMatchData.activeGameId;
            if (newState.activeMatch.activeGameId === null) {
                newState.activeMatch.activeGame = null;
            } else {
                throw Error("Failed to End Active Game");
            }

            if (endMatch) {
                this.endActiveMatch();
            } else {
                this.setState(newState);
            }
        } catch (err) {
            console.error("failed to end active game on match", err);
            this.setErrorState("Failed to End Game");
        }
    }

    async endActiveMatch() {
        try {
            const newState = deepCopy(this.state);
            const modifiedUserInput = {
                id: newState.userId,
                activeMatchId: null,
            }

            const modifiedUserOutput = await API.graphql(graphqlOperation(updateUser, { input: modifiedUserInput }));
            const modifiedUserData = modifiedUserOutput.data.updateUser;
            newState.activeMatchId = modifiedUserData.activeMatchId;
            if (newState.activeMatchId === null) {
                newState.activeMatch = null;
            } else {
                throw Error("Failed to End Active Match");
            }
            this.setState(newState);
        } catch (err) {
            console.error("failed to end active match on user", err);
            this.setErrorState("Failed to End Match");
        }
    }

    render() {
        console.log("STATE", this.state);
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

const INITIAL_STATE = {
    userId: "user_id", // TODO: null, this is used when mocking out graphql database
    name: null,
    matches: null,
    activeMatchId: null,
    activeMatch: null,
    errorMessage: null,
};

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

const INITIAL_MATCH_STATE = {
    id: null,
    activeGameId: null,
    createdAt: null,
    games: null,
    settings: null,
    opponents: null,
};

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
    return newMatchState;
}

const INITIAL_GAME_STATE = {
    id: null,
    createdAt: null,
    matchId: null,
    type: null,
    actions: null,
    settings: null,
    playerOrder: null
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
    return newGameState;
}

const INITIAL_OPPONENT_STATE = {
    id: null,
    name: null,
    matchId: null,
};


export default App;

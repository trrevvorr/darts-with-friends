import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { deepCopy } from '../../helpers/general/Calculations';
import { v4 as uuidv4 } from 'uuid';
import HeaderBar from './HeaderBar';
import * as Database from "../../helpers/general/DatabaseOperations";
import NewGameForm from './NewGameForm';
import PastGamesForm from './PastGamesForm';

const useStyles = makeStyles(theme => ({
    wrapper: {
        textAlign: "center",
        margin: "2rem",
    },
    newGameForm: {
        marginBottom: "3rem",
    }
}));

function withMyHook(Component) {
    return function WrappedComponent(props) {
        const classes = useStyles();
        return <Component {...props} classes={classes} />;
    }
}

class SelectGameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: uuidv4(),
            gameType: "cricket",
            players: [
                { name: "Player 1" },
                { name: "Player 2" },
            ],
            pastGames: null,
        };

        this.handleGameTypeChange = this.handleGameTypeChange.bind(this);
        this.handleNewGameSubmit = this.handleNewGameSubmit.bind(this);
        this.loadGamesInMatchFromDatabase = this.loadGamesInMatchFromDatabase.bind(this);
    }

    componentDidMount() {
        this.loadGamesInMatchFromDatabase();
    }

    async loadGamesInMatchFromDatabase() {
        try {
            const pastGames = await Database.getGamesByMatchId(this.props.matchId);
            const newState = deepCopy(this.state);
            newState.pastGames = pastGames;
            this.setState(newState);
        } catch (err) {
            console.error("failed to get games for match", err);
            this.props.setErrorState("Failed to Get Past Games")
        }
    }

    handleGameTypeChange(event) {
        const newState = deepCopy(this.state);
        newState.gameType = event.target.value;

        this.setState(newState);
    }

    async handleNewGameSubmit() {
        const otherPlayers = this.props.opponents.map(opp => { return { id: opp.id, isUser: false }; });
        const userPlayer = { id: this.props.userId, isUser: true };
        const playerOrder = [userPlayer, ...otherPlayers];
        const settings = {
            doubleIn: null,
            doubleOut: null,
        };

        try {
            const createGameData = await Database.createGame(this.state.id, this.props.matchId, "cricket", playerOrder, settings);
            this.props.setActiveGame(createGameData);
        } catch (err) {
            console.error("error creating game", err);
            this.props.setErrorState("Failed to Create New Game")
        }
    }

    render() {
        const classes = this.props.classes;
        return (
            <>
                <HeaderBar title={this.props.headerBarTitle} activityMenuOptions={this.props.activityMenuOptions} />
                <div className={classes.wrapper}>
                    <div className={classes.newGameForm}>
                        <NewGameForm
                            selectedGameType={this.state.gameType}
                            handleGameTypeChange={this.handleGameTypeChange}
                            handleSubmit={this.handleNewGameSubmit}
                        />
                    </div>
                    <PastGamesForm
                        pastGames={this.state.pastGames}
                        getNameByPlayerId={this.props.getNameByPlayerId}
                        handleGameSelect={this.props.setActiveGame}
                    />
                </div>
            </>
        );
    }
}

SelectGameForm = withMyHook(SelectGameForm);

export default SelectGameForm;
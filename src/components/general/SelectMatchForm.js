import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { deepCopy, debugLog } from '../../helpers/general/Calculations';
import { v4 as uuidv4 } from 'uuid';
import HeaderBar from './HeaderBar';
import * as Database from "../../helpers/general/DatabaseOperations";
import NewMatchForm from './NewMatchForm';
import PastMatchesForm from './PastMatchesForm';

const MAX_NAME_LENGTH = 8;

const useStyles = makeStyles(theme => ({
    wrapper: {
        textAlign: "center",
        margin: "2rem",
    },
    title: {
        marginBottom: "2rem",
    },
    form: {
        textAlign: "left",
        width: "70%",
    },
    select: {
        width: "100%",
        marginTop: theme.spacing(2),
    },
    field: {
        marginBottom: "1rem",
    },
    newMatchForm: {
        marginBottom: "3rem",
    }
}));

function withMyHook(Component) {
    return function WrappedComponent(props) {
        const classes = useStyles();
        return <Component {...props} classes={classes} />;
    }
}

const INITIAL_STATE = {
    matchId: null,
    gameCount: null,
    bestOf: false,
    opponents: [],
    pastMatches: null,
};

class SelectMatchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.initializeState();

        this.initializeState = this.initializeState.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createNewOpponent = this.createNewOpponent.bind(this);
        this.validateOpponentName = this.validateOpponentName.bind(this);
    }

    componentDidMount() {
        this.loadMatchesForUserFromDatabase();
    }

    initializeState() {
        const initialState = deepCopy(INITIAL_STATE);
        initialState.matchId = uuidv4();
        initialState.opponents.push(this.createNewOpponent("", [], initialState.matchId))
        return initialState;
    }

    async loadMatchesForUserFromDatabase() {
        try {
            const pastMatches = await Database.getMatchesByUserId(this.props.userId);
            const newState = deepCopy(this.state);
            newState.pastMatches = pastMatches;
            this.setState(newState);
        } catch (err) {
            console.error("failed to get matches for user", err);
            this.props.setErrorState("Failed to Get Past Matches")
        }
    }

    handleNameChange(event) {
        const newState = deepCopy(this.state);
        const opponentId = event.target.id;
        let name = this.validateOpponentName(event.target.value);

        for (let i = 0; i < newState.opponents.length; i++) {
            if (newState.opponents[i].id === opponentId) {
                newState.opponents[i].name = name;
                break;
            }
        }

        this.setState(newState);
    }

    async handleSubmit() {
        const matchId = this.state.matchId;
        const createOpponentOutputs = await Promise.all(
            this.state.opponents.map(opp => Database.createOpponent(opp.id, matchId, opp.name))
        );
        const allWereCreated = createOpponentOutputs.every(opp => Boolean(opp));
        if (allWereCreated) {
            const createMatchData = await Database.createMatch(matchId, this.props.userId, this.state.gameCount, this.state.bestOf);
            if (createMatchData) {
                this.props.setActiveMatch(createMatchData);
            } else {
                console.error("match was not created", createMatchData);
                throw new Error("match was not created");
            }
        } else {
            console.error("not all opponents were created", createOpponentOutputs);
            throw new Error("not all opponents were created");
        }
    }

    createNewOpponent(name, otherOpponents, matchId) {
        matchId = matchId ? matchId : this.state.matchId;
        return {
            id: uuidv4(),
            name: this.validateOpponentName(name, otherOpponents),
            email: null,
            matchId: matchId,
        }
    }

    validateOpponentName(name, otherOpponents) {
        let validatedName = name;
        if (validatedName === "") {
            validatedName = "Player " + (otherOpponents.length + 2);
        } else {
            validatedName = validatedName.slice(0, MAX_NAME_LENGTH);
        }
        return validatedName;
    }

    render() {
        debugLog("MATCH STATE", this.state);
        const classes = this.props.classes;
        return (
            <>
                <HeaderBar title={this.props.headerBarTitle} activityMenuOptions={this.props.activityMenuOptions} />
                <div className={classes.wrapper}>
                    <div className={classes.newMatchForm}>
                        <NewMatchForm
                            userId={this.props.userId}
                            userName={this.props.userName}
                            opponents={this.state.opponents}
                            handleNameChange={this.handleNameChange}
                            handleSubmit={this.handleSubmit}
                        />
                    </div>
                    <PastMatchesForm
                        pastMatches={this.state.pastMatches}
                        getNameByPlayerId={this.props.getNameByPlayerId}
                        handleMatchSelect={this.props.setActiveMatch}
                    />
                </div>
            </>
        );
    }
}

SelectMatchForm = withMyHook(SelectMatchForm);

export default SelectMatchForm;
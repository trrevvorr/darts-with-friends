import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, TextField, Button } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import { deepCopy, debugLog } from '../../helpers/general/Calculations';
import { v4 as uuidv4 } from 'uuid';
import HeaderBar from './HeaderBar';
import * as Database from "../../helpers/general/DatabaseOperations";

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
};

class NewMatchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.initializeState();

        this.initializeState = this.initializeState.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createNewOpponent = this.createNewOpponent.bind(this);
        this.renderOpponents = this.renderOpponents.bind(this);
        this.validateOpponentName = this.validateOpponentName.bind(this);
    }

    initializeState() {
        const initialState = deepCopy(INITIAL_STATE);
        initialState.matchId = uuidv4();
        initialState.opponents.push(this.createNewOpponent("", [], initialState.matchId))
        return initialState;
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

    renderOpponents(classes) {
        return this.state.opponents.map((opp, index) => {
            return <TextField
                className={classes.field}
                id={opp.id}
                label={`Opponent ${index + 1}'s Name`}
                onChange={this.handleNameChange}
                inputProps={{ maxLength: 8 }}
                key={opp.id}
                placeholder={opp.name}
            />
        });
    }

    render() {
        debugLog("MATCH STATE", this.state);
        const classes = this.props.classes;
        return (
            <>
                <HeaderBar title={this.props.headerBarTitle} activityMenuOptions={this.props.activityMenuOptions} />
                <div className={classes.wrapper}>
                    <Typography variant="h4" className={classes.title}>New Match</Typography>
                    <FormControl className={classes.form}>
                        <TextField className={classes.field} id={this.props.userId} label="Current Player's Name" disabled value={this.props.userName} />
                        {this.renderOpponents(classes)}
                        <Button className={classes.field} variant="contained" color="primary" onClick={this.handleSubmit}>Start Match</Button>
                    </FormControl>
                </div>
            </>
        );
    }
}

NewMatchForm = withMyHook(NewMatchForm);

export default NewMatchForm;
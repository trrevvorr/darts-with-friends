import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { deepCopy } from '../../helpers/general/Calculations';
import { v4 as uuidv4 } from 'uuid';
import HeaderBar from './HeaderBar';
import * as Database from "../../helpers/general/DatabaseOperations";


const inputIds = {
    gameType: "select-game-type"
}

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

class NewGameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: uuidv4(),
            gameType: "cricket",
            players: [
                { name: "Player 1" },
                { name: "Player 2" },
            ],
        };

        this.handleGameTypeChange = this.handleGameTypeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleGameTypeChange(event) {
        const newState = deepCopy(this.state);
        newState.gameType = event.target.value;

        this.setState(newState);
    }

    async handleSubmit() {
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
                    <Typography variant="h4" className={classes.title}>New Game</Typography>
                    <FormControl className={classes.form}>
                        <div className={classes.field}>
                            <InputLabel id="select-game-type-label">Game</InputLabel>
                            <Select labelId="select-game-type-label"
                                id={inputIds.gameType}
                                value={this.state.gameType}
                                onChange={this.handleGameTypeChange}
                                className={classes.select}
                            >
                                <MenuItem value={"cricket"}>Cricket</MenuItem>
                            </Select>
                        </div>
                        <Button className={classes.field} variant="contained" color="primary" onClick={this.handleSubmit}>Start Game</Button>
                    </FormControl>
                </div>
            </>
        );
    }
}

NewGameForm = withMyHook(NewGameForm);

export default NewGameForm;
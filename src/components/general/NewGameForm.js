import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, TextField, Button } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { deepCopy } from '../../helpers/general/Calculations';

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
            gameType: "cricket",
            players: [
                { name: "Player 1" },
                { name: "Player 2" },
            ]
        };

        this.handleGameTypeChange = this.handleGameTypeChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleGameTypeChange(event) {
        const newState = deepCopy(this.state);
        newState.gameType = event.target.value;

        this.setState(newState);
    }

    handleNameChange(event) {
        const newState = deepCopy(this.state);
        const nameIndex = parseInt(event.target.id.split("-")[2]);

        newState.players[nameIndex].name = event.target.value;

        this.setState(newState);
    }

    handleSubmit() {
        const validatedPlayers = [];

        for (let i = 0; i < this.state.players.length; i++) {
            if (this.state.players[i].name === "") {
                validatedPlayers.push({ name: "Player " + this.state.players[i] + 1 });
            } else {
                validatedPlayers.push({ name: this.state.players[i].name });
            }
        }

        const options = {
            gameType: this.state.gameType,
            players: validatedPlayers
        }
        this.props.startGameWithOptions(options);
    }

    render() {
        const classes = this.props.classes;
        return (
            <div className={classes.wrapper}>
                <Typography variant="h4" className={classes.title}>Darts With Friends</Typography>
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
                        <TextField className={classes.field} id="player-name-0" label="Player 1 Name" onChange={this.handleNameChange} inputProps={{ maxLength: 8 }} />
                        <TextField className={classes.field} id="player-name-1" label="Player 2 Name" onChange={this.handleNameChange} inputProps={{ maxLength: 8 }} />
                        <Button className={classes.field} variant="contained" color="primary" onClick={this.handleSubmit}>Start Game</Button>
                </FormControl>
            </div>
        );
    }
}

NewGameForm = withMyHook(NewGameForm);

export default NewGameForm;
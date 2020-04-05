import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
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

export default function NewGameForm(props) {
    const classes = useStyles();

    return (
        <>
            <Typography variant="h4" className={classes.title}>New Game</Typography>
            <FormControl className={classes.form}>
                <div className={classes.field}>
                    <InputLabel id="select-game-type-label">Game</InputLabel>
                    <Select labelId="select-game-type-label"
                        id="select-game-type"
                        value={props.selectedGameType}
                        onChange={props.handleGameTypeChange}
                        className={classes.select}
                    >
                        <MenuItem value={"cricket"}>Cricket</MenuItem>
                    </Select>
                </div>
                <Button className={classes.field} variant="contained" color="primary" onClick={props.handleSubmit}>Start Game</Button>
            </FormControl>
        </>
    );
}

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
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

export default function NewMatchForm(props) {
    const classes = useStyles();

    return (
        <>
            <Typography variant="h4" className={classes.title}>New Match</Typography>
            <FormControl className={classes.form}>
                <TextField className={classes.field} id={props.userId} label="Current Player's Name" disabled value={props.userName} />
                {renderOpponents(props.opponents, props.handleNameChange, classes)}
                <Button className={classes.field} variant="contained" color="primary" onClick={props.handleSubmit}>Start Match</Button>
            </FormControl>
        </>
    );
}

function renderOpponents(opponents, handleNameChange, classes) {
    return opponents.map((opp, index) => {
        return <TextField
            className={classes.field}
            id={opp.id}
            label={`Opponent ${index + 1}'s Name`}
            onChange={handleNameChange}
            inputProps={{ maxLength: 8 }}
            key={opp.id}
            placeholder={opp.name}
        />
    });
}
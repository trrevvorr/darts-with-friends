import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PastMatch from './PastMatch';
import { CircularProgress } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

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
    },
    noMatchesFound: {
        color: grey[500],
    }
}));

export default function PastMatchesForm(props) {
    const classes = useStyles();

    return (
        <>
            <Typography variant="h4" className={classes.title}>Past Matches</Typography>
            {getPastMatches(props.pastMatches, props.handleMatchSelect, classes)}
        </>
    );
}

function getPastMatches(pastMatches, handleMatchSelect, classes) {
    if (pastMatches) {
        if (pastMatches.length) {
            return pastMatches.map((match, index) => {
                const opponentsNames = match.opponents.items.map(opp => opp.name);

                return <PastMatch
                    matchNumber={index + 1}
                    matchType={match.type}
                    timestamp={match.createdAt}
                    handleMatchSelect={() => handleMatchSelect(match)}
                    opponentsNames={opponentsNames}
                    matchSettings={match.settings}
                    matchWinState={getMatchWinState(match.winners)}
                    key={match.id}
                />
            });
        } else {
            return <Typography variant="subtitle2" className={classes.noMatchesFound}>No Matches Found</Typography>
        }
    } else {
        return <CircularProgress />
    }
}

function getMatchWinState(winners) {
    if (winners && winners.length > 0) {
        if (winners.length === 1) {
            if (winners[0].isUser) {
                return "WIN";
            } else {
                return "LOSS";
            }
        } else {
            return "TIE";
        }
    } else {
        return "INCOMPLETE";
    }
}
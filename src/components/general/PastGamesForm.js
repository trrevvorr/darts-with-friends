import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PastGame from './PastGame';
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
    noGamesFound: {
        color: grey[500],
    }
}));

export default function PastGamesForm(props) {
    const classes = useStyles();

    return (
        <>
            <Typography variant="h4" className={classes.title}>Past Games</Typography>
            {getPastGames(props.pastGames, props.getNameByPlayerId, props.handleGameSelect, classes)}
        </>
    );
}

function getPastGames(pastGames, getNameByPlayerId, handleGameSelect, classes) {
    if (pastGames) {
        if (pastGames.length) {
            return pastGames.map((game, index) => {
                const winnerId = game.winner && game.winner.id;
                const winnerName = winnerId ? getNameByPlayerId(winnerId) : null;
                const userDidWin = winnerId && game.winner.isUser;

                return <PastGame
                    gameNumber={index + 1}
                    gameType={game.type}
                    timestamp={game.createdAt}
                    winnerName={winnerName}
                    handleGameSelect={() => handleGameSelect(game)}
                    userDidWin={userDidWin}
                    key={game.id}
                />
            });
        } else {
            return <Typography variant="subtitle2" className={classes.noGamesFound}>No Games Found</Typography>
        }
    } else {
        return <CircularProgress />
    }
}
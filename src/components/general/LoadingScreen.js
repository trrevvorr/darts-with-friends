import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { LinearProgress } from '@material-ui/core';
import HeaderBar from './HeaderBar';

const useStyles = makeStyles(theme => ({
    page: {
        display: "flex",
        height: "50vh",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    loadingIcon: {
        display: "block",
        width: "100%",
    },
    message: {
        display: "block",
        width: "100%",
        marginBottom: "1rem",
    },
    itemWrapper: {
        textAlign: "center",
    },
}));

export default function LoadingScreen(props) {
    // TODO: display error message if loading screen is displayed for a long time. 
    const classes = useStyles();

    return (
        <>
            <HeaderBar title={props.headerBarTitle} activityMenuOptions={props.activityMenuOptions} />
            <div className={classes.page}>
                <div className={classes.itemWrapper}>
                    <div className={classes.message}>
                        <Typography variant="h4" >{props.message}</Typography>
                    </div>
                    <div className={classes.loadingIcon}>
                        <LinearProgress />
                    </div>
                </div>
            </div>
        </>
    );
}

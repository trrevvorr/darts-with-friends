import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import grey from '@material-ui/core/colors/grey';
import HeaderBar from './HeaderBar';

const useStyles = makeStyles(theme => ({
    page: {
        display: "flex",
        height: "50vh",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
    },
    errorTitleWrapper: {
        display: "flex",
        width: "100%",
        marginBottom: "1rem",
        justifyContent: "center",
    },
    errorTitleText: {
        fontSize: "3rem",
        lineHeight: "3rem",
    },
    errorTitleIcon: {
        fontSize: "3rem",
        lineHeight: "3rem",
        marginLeft: "1rem",
    },
    message: {
        display: "block",
        width: "100%",
        marginBottom: "1rem",
        color: grey[500],
    },
    itemWrapper: {
        textAlign: "center",
    },
}));

export default function ErrorScreen(props) {
    const classes = useStyles();

    return (
        <>
            <HeaderBar title={props.headerBarTitle} activityMenuOptions={props.activityMenuOptions} />
            <div className={classes.page}>
                <div className={classes.itemWrapper}>
                    <div className={classes.errorTitleWrapper}>
                        <Typography className={classes.errorTitleText}>Uh-Oh</Typography>
                        <SentimentVeryDissatisfiedIcon className={classes.errorTitleIcon} />
                    </div>
                    <div className={classes.message}>
                        <Typography variant="subtitle1">{props.message}</Typography>
                    </div>
                </div>
            </div>
        </>
    );
}

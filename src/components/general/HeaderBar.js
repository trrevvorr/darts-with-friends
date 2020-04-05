import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MoreVert from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ConfirmationDialog from './ConfirmationDialog';

const useStyles = makeStyles(theme => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        textTransform: "capitalize",
    },
    appBar: {
        width: "100%",
        height: "8vh",
        marginBottom: "2vh",
    }
}));

export default function HeaderBar(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [confirmMessage, setConfirmMessage] = React.useState(null);
    const [confirmAction, setConfirmAction] = React.useState(null);

    const handleActivityMenuToggle = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleActivityMenuClose = () => {
        setAnchorEl(null);
    };

    const handleConfirmationRequired = (message, action) => {
        setConfirmMessage(message);
        setConfirmAction(() => action);
        setConfirmOpen(true);
    };

    const handleConfirmationCancel = () => {
        setConfirmOpen(false);
        setConfirmMessage(null);
        setConfirmAction(null);
    };
    const handleConfirmationConfirm = () => {
        confirmAction();
        setConfirmOpen(false);
        setConfirmMessage(null);
        setConfirmAction(null);
    };

    const classes = useStyles();
    const enableActivityMenu = props.activityMenuOptions && props.activityMenuOptions.length;

    return (
        <>
            <AppBar position="sticky" className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {props.title}
                    </Typography>
                    <IconButton edge="start" color="inherit" aria-label="more" onClick={handleActivityMenuToggle} disabled={!enableActivityMenu}>
                        <MoreVert />
                    </IconButton>
                    <Menu
                        id="activity-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleActivityMenuClose}
                    >
                        {generateActivityMenuOptions(props.activityMenuOptions, handleConfirmationRequired)}
                    </Menu>
                </Toolbar>
            </AppBar>
            <ConfirmationDialog
                open={confirmOpen}
                message={confirmMessage}
                handleCancel={handleConfirmationCancel}
                handleConfirm={handleConfirmationConfirm}
            />
        </>
    );
}

function generateActivityMenuOptions(options, handleConfirmationRequired) {
    if (options) {
        return options.map((option, index) => {
            let onClick;
            if (option.requireConfirmation) {
                onClick = () => handleConfirmationRequired(option.requireConfirmation.message, option.handleClick);
            } else {
                onClick = option.handleClick
            }

            return <MenuItem onClick={onClick} key={index} >{option.title}</MenuItem>
        });
    }
}


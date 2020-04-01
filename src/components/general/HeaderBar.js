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
    const handleActivityMenuToggle = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleActivityMenuClose = () => {
        setAnchorEl(null);
    };
    const classes = useStyles();
    const enableActivityMenu = props.activityMenuOptions && props.activityMenuOptions.length;

    return (
        <AppBar position="static" className={classes.appBar}>
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
                    {generateActivityMenuOptions(props.activityMenuOptions)}
                </Menu>
            </Toolbar>
        </AppBar>
    );
}

function generateActivityMenuOptions(options) {
    if (options) {
        return options.map((option, index) => <MenuItem onClick={option.handleClick} key={index} >{option.title}</MenuItem>);
    }
}

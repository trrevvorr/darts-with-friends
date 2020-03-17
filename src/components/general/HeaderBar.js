import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MoreVert from '@material-ui/icons/MoreVert';
import Undo from '@material-ui/icons/Undo';

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    width: "100%",
  }
}));

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
      <AppBar position="sticky" className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Cricket
          </Typography>
          <IconButton edge="start" color="inherit" aria-label="undo" className={classes.menuButton} >
            <Undo />
          </IconButton>
          <IconButton edge="start" color="inherit" aria-label="more">
            <MoreVert />
          </IconButton>
        </Toolbar>
      </AppBar>
  );
}

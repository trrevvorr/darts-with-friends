import React from 'react';
import HighlightOff from '@material-ui/icons/HighlightOff';
import Close from "@material-ui/icons/Close";
import Remove from "@material-ui/icons/Remove";
import Error from "@material-ui/icons/Error";
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
  rotate_45: {
    transform: "rotate(-45deg)",
  }
}));

export default function MarkIcon(props) {
  const classes = useStyles();

  if (props.marks === 0) {
    return(<></>);
  } else if (props.marks === 1) {
    return(<Remove className={classes.rotate_45} style={{ fontSize: 50 }}/>);
  } else if (props.marks === 2) {
    return (<Close style={{ fontSize: 50 }}/>);
  } else if (props.marks >= 3) {
    return (<HighlightOff style={{ fontSize: 50 }}/>);
  } else {
    return (<Error style={{ fontSize: 50 }}/>)
  }
}
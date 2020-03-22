import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

export default function GameOverDialog(props) {
    return (
        <Dialog
            open={props.open}
            onClose={props.closeGameOverModal}
            aria-labelledby="alert-dialog-title"
        >
            <DialogTitle id="alert-dialog-title">{props.winnerName + " Won!"}</DialogTitle>
            <DialogActions>
                <Button variant="contained" onClick={props.closeGameOverModal} color="secondary">
                    Go Back
                </Button>
                <Button variant="contained" onClick={props.startNewGame} color="primary" autoFocus>
                    New Game
                </Button>
            </DialogActions>
        </Dialog>
    );
}

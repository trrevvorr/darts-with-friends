import React from 'react';
import CricketGame from './CricketGame';
import { calcIsLeftPlayersTurn, getTurnActions, countThrowsThisTurn, validateState, calculateWinner } from "../../helpers/cricket/Calculations";
import { deepCopy } from "../../helpers/general/Calculations";
import GameOverDialog from './GameOverDialog';
import { API, graphqlOperation } from 'aws-amplify'
import { updateGame } from '../../graphql/mutations'
import HeaderBar from '../general/HeaderBar';
 
class Cricket extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.initializeState();

        this.addNewMark = this.addNewMark.bind(this);
        this.endTurn = this.endTurn.bind(this);
        this.undoAction = this.undoAction.bind(this);
        this.closeGameOverModal = this.closeGameOverModal.bind(this);
        this.initializeState = this.initializeState.bind(this);
        this.endGame = this.endGame.bind(this);
        this.saveActionsToDatabase = this.saveActionsToDatabase.bind(this);
        this.saveWinnerToDatabase = this.saveWinnerToDatabase.bind(this);
    }

    async endGame(endMatch) {
        const newState = deepCopy(this.state);
        const winnerSide = calculateWinner(newState, newState.actions.length - 1);

        if (winnerSide) {
            newState.winner = newState[winnerSide + "Player"];
            // TODO add server-side validation
            newState.winner = await this.saveWinnerToDatabase(newState.winner);
        }

        this.setState(newState);
        this.props.endCurrentGame(endMatch);
    }

    initializeState() {
        const initialState = applyGameDataToGameState(this.props.activeGame, INITIAL_STATE);
        initialState.leftPlayer = this.props.leftPlayer;
        initialState.rightPlayer = this.props.rightPlayer;
        const winnerSide = calculateWinner(initialState, initialState.actions.length-1);
        initialState.openGameOverDialog = Boolean(winnerSide);

        return initialState;
    }

    async addNewMark(number) {
        const newState = deepCopy(this.state);
        const oldActionIndex = newState.actions.length - 1;
        const newAction = deepCopy(newState.actions[oldActionIndex]);
        const turnNumber = newAction.turnNumber;
        const isLeftPlayersTurn = calcIsLeftPlayersTurn(turnNumber);
        
        if (isLeftPlayersTurn) {
            newAction.leftMarks[number]++;
        } else {
            newAction.rightMarks[number]++;
        }
        
        newState.actions.push(newAction);
        if (validateState(newState)) {
            if (calculateWinner(newState, newState.actions.length - 1)) {
                newState.openGameOverDialog = true;
            }
            newState.actions = await this.saveActionsToDatabase(newState.actions);
            this.setState(newState)
        }
    }

    async saveActionsToDatabase(actions) {
        const gameInput = {
            id: this.state.id,
            actions: actions.map(action => JSON.stringify(action)),
        }

        try {
            const updateGameOutput = await API.graphql(graphqlOperation(updateGame, {input: gameInput}));
            const updateGameData = updateGameOutput.data.updateGame;
            return updateGameData.actions.map(action => JSON.parse(action));
        } catch (err) {
            console.error("error updating game", err);
            this.props.setErrorState("Failed to Save Player Action")
        }
    }

    async saveWinnerToDatabase(winner) {
        const gameInput = {
            id: this.state.id,
            winner: {id: winner.id, isUser: winner.isUser},
        }

        try {
            const updateGameOutput = await API.graphql(graphqlOperation(updateGame, {input: gameInput}));
            const updateGameData = updateGameOutput.data.updateGame;
            return updateGameData.winner;
        } catch (err) {
            console.error("error updating game winner", err);
            this.props.setErrorState("Failed to Save Winner")
        }
    }

    async endTurn() {
        const newState = deepCopy(this.state);
        newState.actions.push(deepCopy(newState.actions[newState.actions.length - 1]));
        newState.actions[newState.actions.length - 1].turnNumber++;
        newState.actions = await this.saveActionsToDatabase(newState.actions);

        this.setState(newState);
    }

    async undoAction() {
        if (this.state.actions.length > 1) {
            const newState = deepCopy(this.state);
            newState.actions.pop();
            newState.actions = await this.saveActionsToDatabase(newState.actions);
            newState.openGameOverDialog = false;
            this.setState(newState);
        }
    }

    closeGameOverModal() {
        const newState = deepCopy(this.state);
        newState.openGameOverDialog = false;
        this.setState(newState);
    }
    
    render() {
        const currActionIndex = this.state.actions.length - 1;
        const turnNumber = this.state.actions[currActionIndex].turnNumber;
        const turnActions = getTurnActions(this.state, turnNumber);
        const isLeftPlayersTurn = calcIsLeftPlayersTurn(turnNumber);
        const numThrowsThisTurn = countThrowsThisTurn(turnActions, isLeftPlayersTurn);
        const winnerSide = calculateWinner(this.state, currActionIndex);
        const gameIsWon = Boolean(winnerSide);
        const winnerPlayer = gameIsWon ? this.state[winnerSide + "Player"] : null;
        const propsActivityMenuOptions = this.props.activityMenuOptions || [];
        const activityMenuOptions = [
            {title: "End Game", handleClick: () => this.endGame(false)},
            {title: "End Match", handleClick: () => this.endGame(true)},
            ...propsActivityMenuOptions
        ];

        return (
            <>
                <HeaderBar title={this.props.headerBarTitle} activityMenuOptions={activityMenuOptions} />
                <CricketGame
                    leftPlayer={this.state.leftPlayer}
                    rightPlayer={this.state.rightPlayer}
                    turnState={this.state.actions[currActionIndex]}
                    addNewMark={this.addNewMark}
                    endTurn={this.endTurn}
                    undoAction={this.undoAction}
                    turnActions={turnActions}
                    numThrowsThisTurn={numThrowsThisTurn}
                    isLeftPlayersTurn={isLeftPlayersTurn}
                    gameIsWon={gameIsWon}
                    actionIndex={currActionIndex}
                    endGame={() => this.endGame(false)}
                />
                <GameOverDialog open={this.state.openGameOverDialog} winnerPlayer={winnerPlayer} closeGameOverModal={this.closeGameOverModal} endGame={() => this.endGame(false)} />
            </>
        );
    }
}

const INITIAL_ACTION = {
    leftMarks: { "20": 0, "19": 0, "18": 0, "17": 0, "16": 0, "15": 0, "B": 0 },
    rightMarks: { "20": 0, "19": 0, "18": 0, "17": 0, "16": 0, "15": 0, "B": 0 },
    turnNumber: 0,
}

const INITIAL_STATE = {
    id: null,
    actions: null,
    leftPlayer: null,
    rightPlayer: null,
    settings: null,
    openGameOverDialog: null,
    winner: null,
};
/**
 * given game data from database, apply it to the passed in game state object
 * @param {Object} gameData game database graphQL object
 * @param {Object} gameState game state object (reference `INITIAL_GAME_STATE`)
 */
function applyGameDataToGameState(gameData, gameState) {
    const newGameState = deepCopy(gameState);
    newGameState.id = gameData.id;
    newGameState.matchId = gameData.matchId;
    newGameState.createdAt = gameData.createdAt;
    newGameState.settings = gameData.settings;
    if (gameData.actions && gameData.actions.length > 0) {
        newGameState.actions = gameData.actions.map(action => JSON.parse(action));
    } else {
        newGameState.actions = [deepCopy(INITIAL_ACTION)];
    }

    return newGameState;
}

export default Cricket;

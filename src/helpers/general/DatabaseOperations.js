import { API, graphqlOperation } from 'aws-amplify';
import * as DatabaseMutations from '../../graphql/mutations';
import * as DatabaseQueries from '../../graphql/queries';
import { debugLog } from './Calculations';

//#region User Operations

/**
 * given a user ID, get the user object from the database
 * @param {string} userId ID of user to get from database
 * @returns {object} user database object
 */
export async function getUserById(userId) {
    try {
        if (!userId) {
            throw new Error("at least one required parameter was not set");
        }

        const getUserOutput = await API.graphql(graphqlOperation(DatabaseQueries.getUser, { id: userId }));
        debugLog("getUserByIdOutput", getUserOutput);
        const getUserData = getUserOutput.data.getUser;
        return getUserData
    } catch (err) {
        console.error(err);
        throw new Error(`failed to get user (ID ${userId}) from database`);
    }
}

/**
 * given a user ID and match ID, set the match ID as the active match for the user
 * @param {string} userId ID of user to update
 * @param {string} matchId ID of match to set as active match for user, null if removing active match
 * @returns {string} activeMatchId as set in database, if successful, will be same as passed in matchId
 */
export async function updateUserSetActiveMatch(userId, matchId) {
    try {
        if (!userId || matchId === "" || matchId === undefined) {
            throw new Error("at least one required parameter was not set");
        }

        const modifiedUserInput = {
            id: userId,
            activeMatchId: matchId,
        }

        const updateUserOutput = await API.graphql(graphqlOperation(DatabaseMutations.updateUser, { input: modifiedUserInput }));
        debugLog("updateUserSetActiveMatchOutput", updateUserOutput);
        const updateUserData = updateUserOutput.data.updateUser;
        return updateUserData.activeMatchId;
    } catch (err) {
        console.error(err);
        throw new Error(`failed to update User (ID ${userId}) with new new match ID (${matchId})`);
    }
}

//#endregion

//#region Match Operations

/**
 * given a match ID, get the match object from the database 
 * @param {string} matchId ID of match to get from database
 * @return {string} match database object
 */
export async function getMatchById(matchId) {
    try {
        if (!matchId) {
            throw new Error("at least one required parameter was not set");
        }

        const getMatchOutput = await API.graphql(graphqlOperation(DatabaseQueries.getMatch, { id: matchId }));
        debugLog("getMatchByIdOutput", getMatchOutput);
        const getMatchData = getMatchOutput.data.getMatch;
        return getMatchData;
    } catch (err) {
        console.error(err);
        throw new Error(`failed to get match (ID ${matchId}) from database`);
    }
}

/**
 * given a match ID and game ID, set the game ID as teh active game for the match
 * @param {string} matchId ID of match to update
 * @param {string} gameId ID of game to set as active game for match, null if removing active game
 * @returns {string} activeGameId as set in database, if successful, will be same as passed in gameId
 */
export async function updateMatchSetActiveGame(matchId, gameId) {
    try {
        if (!matchId || gameId === "" || gameId === undefined) {
            throw new Error("at least one required parameter was not set");
        }

        const updateMatchInput = {
            id: matchId,
            activeGameId: gameId,
        }

        const updateMatchOutput = await API.graphql(graphqlOperation(DatabaseMutations.updateMatch, { input: updateMatchInput }));
        debugLog("updateMatchSetActiveGameOutput", updateMatchOutput);
        const updateMatchData = updateMatchOutput.data.updateMatch;
        return updateMatchData.activeGameId;
    } catch (err) {
        console.error(err);
        throw new Error(`failed to update match (ID ${matchId}) with active game ID (${gameId})`);
    }
}

/**
 * given a match ID and user ID, create a new match for a user
 * @param {string} matchId ID of match to create (must not be globally unique)
 * @param {string} userId ID of user who created match
 * @param {int} gameCount number of games in match, if null play unlimited matches
 * @param {boolean} bestOf if true, gameCount is "best of", if false, gameCount is "total games to play"
 * @returns {object} match database object that was created
 */
export async function createMatch(matchId, userId, gameCount = null, bestOf = false) {
    try {
        if (!matchId || !userId) {
            throw new Error("at least one required parameter was not set");
        }

        const createMatchInput = {
            id: matchId,
            createdAt: (new Date()).toISOString(),
            userId: userId,
            activeGameId: null,
            settings: {
                gameCount: gameCount,
                bestOf: bestOf,
            }
        }
        debugLog("createMatchInput", createMatchInput);
        const createMatchOutput = await API.graphql(graphqlOperation(DatabaseMutations.createMatch, { input: createMatchInput }));
        debugLog("createMatchOutput", createMatchOutput);
        const createMatchData = createMatchOutput.data.createMatch;
        return createMatchData;
    } catch (err) {
        console.error(err);
        throw new Error(`Failed to create match (ID ${matchId}) for user (ID ${userId})`);
    }
}

//#endregion

//#region Game Operations

/**
 * given a game ID, get the game object from the database 
 * @param {string} gameId ID of game to get from database
 * @return {string} game database object
 */
export async function getGameById(gameId) {
    try {
        if (!gameId) {
            throw new Error("at least one required parameter was not set");
        }

        const getGameOutput = await API.graphql(graphqlOperation(DatabaseQueries.getGame, { id: gameId }));
        debugLog("getGameByIdOutput", getGameOutput);
        const getGameData = getGameOutput.data.getGame;
        return getGameData;
    } catch (err) {
        console.error(err);
        throw new Error(`failed to get game (ID ${gameId}) from database`);
    }
}

/**
 * given a game ID and match ID, create a new game for a match
 * @param {string} gameId ID of game to create (must not be globally unique)
 * @param {string} matchId ID of match who created game
 * @param {string} gameType type of game (cricket, threeHundredOne, fiveHundredOne, sevenHundredOne, killer)
 * @param {array} playerOrder list of player objects in the order of their turn
 * @param {object} gameSettings object containing settings for current game type
 * @returns {object} game database object that was created
 */
export async function createGame(gameId, matchId, gameType, playerOrder, gameSettings) {
    try {
        if (!gameId || !matchId || !gameType || !playerOrder || !gameSettings) {
            throw new Error("at least one required parameter was not set");
        }

        const createGameInput = {
            id: gameId,
            createdAt: (new Date()).toISOString(),
            matchId: matchId,
            type: gameType,
            actions: [],
            playerOrder: playerOrder,
            settings: gameSettings
        }
        debugLog("createGameInput", createGameInput);
        const createGameOutput = await API.graphql(graphqlOperation(DatabaseMutations.createGame, { input: createGameInput }));
        debugLog("createGameOutput", createGameOutput);
        const createGameData = createGameOutput.data.createGame;
        return createGameData;
    } catch (err) {
        console.error(err);
        throw new Error(`Failed to create game (ID ${gameId}, Type ${gameType}) for match (ID ${matchId})`);
    }
}

/**
 * given a match ID, get all the game object from the database that are part of that match
 * @param {string} matchId ID of match to get games for
 * @return {array} list of game database objects
 */
export async function getGamesByMatchId(matchId) {
    try {
        if (!matchId) {
            throw new Error("at least one required parameter was not set");
        }

        const getGamesByMatchIdOutput = await API.graphql(graphqlOperation(DatabaseQueries.getGamesByMatchId, { matchId: matchId }));
        debugLog("getGamesByMatchIdOutput", getGamesByMatchIdOutput);
        const getGamesByMatchIdData = getGamesByMatchIdOutput.data.getGamesByMatchId;
        return getGamesByMatchIdData.items;
    } catch (err) {
        console.error(err);
        throw new Error(`failed to get game by match ID (${matchId}) from database`);
    }
}

//#endregion

//#region Opponent Operations

/**
 * Create a new opponent to play in a given match   
 * @param {string} opponentId ID of opponent to create
 * @param {string} matchId ID of match in which the opponent is to play
 * @param {string} opponentName Name of opponent
 * @returns {object} opponent database object that was created
 */
export async function createOpponent(opponentId, matchId, opponentName) {
    try {
        if (!opponentId || !matchId || !opponentName) {
            throw new Error("at least one required parameter was not set");
        }

        const createOpponentInput = {
            id: opponentId,
            matchId: matchId,
            name: opponentName,
            createdAt: (new Date()).toISOString(),
        }
        debugLog("createOpponentInput", createOpponentInput);
        const createOpponentOutput = await API.graphql(graphqlOperation(DatabaseMutations.createOpponent, { input: createOpponentInput }));
        debugLog("createOpponentOutput", createOpponentOutput);
        const createOpponentData = createOpponentOutput.data.createOpponent;
        return createOpponentData
    } catch (err) {
        console.error(err);
        throw new Error(`Failed to create opponent (ID ${opponentId}, Name ${opponentName}) for match (ID ${matchId})`);
    }
}

//#endregion
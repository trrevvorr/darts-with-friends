/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      email
      name
      activeMatchId
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      email
      name
      activeMatchId
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      email
      name
      activeMatchId
    }
  }
`;
export const createMatch = /* GraphQL */ `
  mutation CreateMatch(
    $input: CreateMatchInput!
    $condition: ModelMatchConditionInput
  ) {
    createMatch(input: $input, condition: $condition) {
      id
      createdAt
      userId
      activeGameId
      opponents {
        items {
          id
          name
          matchId
          createdAt
          email
        }
        nextToken
      }
      settings {
        gameCount
        bestOf
      }
    }
  }
`;
export const updateMatch = /* GraphQL */ `
  mutation UpdateMatch(
    $input: UpdateMatchInput!
    $condition: ModelMatchConditionInput
  ) {
    updateMatch(input: $input, condition: $condition) {
      id
      createdAt
      userId
      activeGameId
      opponents {
        items {
          id
          name
          matchId
          createdAt
          email
        }
        nextToken
      }
      settings {
        gameCount
        bestOf
      }
    }
  }
`;
export const deleteMatch = /* GraphQL */ `
  mutation DeleteMatch(
    $input: DeleteMatchInput!
    $condition: ModelMatchConditionInput
  ) {
    deleteMatch(input: $input, condition: $condition) {
      id
      createdAt
      userId
      activeGameId
      opponents {
        items {
          id
          name
          matchId
          createdAt
          email
        }
        nextToken
      }
      settings {
        gameCount
        bestOf
      }
    }
  }
`;
export const createGame = /* GraphQL */ `
  mutation CreateGame(
    $input: CreateGameInput!
    $condition: ModelGameConditionInput
  ) {
    createGame(input: $input, condition: $condition) {
      id
      createdAt
      matchId
      type
      actions
      settings {
        doubleIn
        doubleOut
      }
      playerOrder {
        id
        isUser
      }
      winner {
        id
        isUser
      }
    }
  }
`;
export const updateGame = /* GraphQL */ `
  mutation UpdateGame(
    $input: UpdateGameInput!
    $condition: ModelGameConditionInput
  ) {
    updateGame(input: $input, condition: $condition) {
      id
      createdAt
      matchId
      type
      actions
      settings {
        doubleIn
        doubleOut
      }
      playerOrder {
        id
        isUser
      }
      winner {
        id
        isUser
      }
    }
  }
`;
export const deleteGame = /* GraphQL */ `
  mutation DeleteGame(
    $input: DeleteGameInput!
    $condition: ModelGameConditionInput
  ) {
    deleteGame(input: $input, condition: $condition) {
      id
      createdAt
      matchId
      type
      actions
      settings {
        doubleIn
        doubleOut
      }
      playerOrder {
        id
        isUser
      }
      winner {
        id
        isUser
      }
    }
  }
`;
export const createOpponent = /* GraphQL */ `
  mutation CreateOpponent(
    $input: CreateOpponentInput!
    $condition: ModelOpponentConditionInput
  ) {
    createOpponent(input: $input, condition: $condition) {
      id
      name
      matchId
      createdAt
      email
    }
  }
`;
export const updateOpponent = /* GraphQL */ `
  mutation UpdateOpponent(
    $input: UpdateOpponentInput!
    $condition: ModelOpponentConditionInput
  ) {
    updateOpponent(input: $input, condition: $condition) {
      id
      name
      matchId
      createdAt
      email
    }
  }
`;
export const deleteOpponent = /* GraphQL */ `
  mutation DeleteOpponent(
    $input: DeleteOpponentInput!
    $condition: ModelOpponentConditionInput
  ) {
    deleteOpponent(input: $input, condition: $condition) {
      id
      name
      matchId
      createdAt
      email
    }
  }
`;

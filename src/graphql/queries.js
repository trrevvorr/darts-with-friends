/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      email
      name
      activeMatchId
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $id: ID
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUsers(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        email
        name
        activeMatchId
      }
      nextToken
    }
  }
`;
export const getMatch = /* GraphQL */ `
  query GetMatch($id: ID!) {
    getMatch(id: $id) {
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
export const listMatchs = /* GraphQL */ `
  query ListMatchs(
    $id: ID
    $filter: ModelMatchFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listMatchs(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        createdAt
        userId
        activeGameId
        opponents {
          nextToken
        }
        settings {
          gameCount
          bestOf
        }
      }
      nextToken
    }
  }
`;
export const getGame = /* GraphQL */ `
  query GetGame($id: ID!) {
    getGame(id: $id) {
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
export const listGames = /* GraphQL */ `
  query ListGames(
    $id: ID
    $filter: ModelGameFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listGames(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getOpponent = /* GraphQL */ `
  query GetOpponent($id: ID!) {
    getOpponent(id: $id) {
      id
      name
      matchId
      createdAt
      email
    }
  }
`;
export const listOpponents = /* GraphQL */ `
  query ListOpponents(
    $id: ID
    $filter: ModelOpponentFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listOpponents(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        name
        matchId
        createdAt
        email
      }
      nextToken
    }
  }
`;
export const getMatchesByUserId = /* GraphQL */ `
  query GetMatchesByUserId(
    $userId: ID
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getMatchesByUserId(
      userId: $userId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        createdAt
        userId
        activeGameId
        opponents {
          nextToken
        }
        settings {
          gameCount
          bestOf
        }
      }
      nextToken
    }
  }
`;
export const getGamesByMatchId = /* GraphQL */ `
  query GetGamesByMatchId(
    $matchId: ID
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelGameFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getGamesByMatchId(
      matchId: $matchId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;

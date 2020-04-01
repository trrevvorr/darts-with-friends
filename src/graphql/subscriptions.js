/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
      id
      email
      name
      activeMatchId
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
      id
      email
      name
      activeMatchId
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
      id
      email
      name
      activeMatchId
    }
  }
`;
export const onCreateMatch = /* GraphQL */ `
  subscription OnCreateMatch {
    onCreateMatch {
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
export const onUpdateMatch = /* GraphQL */ `
  subscription OnUpdateMatch {
    onUpdateMatch {
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
export const onDeleteMatch = /* GraphQL */ `
  subscription OnDeleteMatch {
    onDeleteMatch {
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
export const onCreateGame = /* GraphQL */ `
  subscription OnCreateGame {
    onCreateGame {
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
export const onUpdateGame = /* GraphQL */ `
  subscription OnUpdateGame {
    onUpdateGame {
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
export const onDeleteGame = /* GraphQL */ `
  subscription OnDeleteGame {
    onDeleteGame {
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
export const onCreateOpponent = /* GraphQL */ `
  subscription OnCreateOpponent {
    onCreateOpponent {
      id
      name
      matchId
      createdAt
      email
    }
  }
`;
export const onUpdateOpponent = /* GraphQL */ `
  subscription OnUpdateOpponent {
    onUpdateOpponent {
      id
      name
      matchId
      createdAt
      email
    }
  }
`;
export const onDeleteOpponent = /* GraphQL */ `
  subscription OnDeleteOpponent {
    onDeleteOpponent {
      id
      name
      matchId
      createdAt
      email
    }
  }
`;

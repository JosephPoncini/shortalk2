export interface GameModel {
    id: number;
    roomName?: string;
    gamePhase?: string;
    host?: string;
    round: number;
    numberOfRounds: number;
    timeLimit: number;
    time: number;
    teamAScore: number;
    teamBScore: number;
    speaker?: string;
    turnNumber: number;
    onePointWord: string;
    threePointWord: string;
    playerA1?: string;
    playerA2?: string;
    playerA3?: string;
    playerA4?: string;
    playerA5?: string;
    playerB1?: string;
    playerB2?: string;
    playerB3?: string;
    playerB4?: string;
    playerB5?: string;
    readyStatusA1: boolean;
    readyStatusA2: boolean;
    readyStatusA3: boolean;
    readyStatusA4: boolean;
    readyStatusA5: boolean;
    readyStatusB1: boolean;
    readyStatusB2: boolean;
    readyStatusB3: boolean;
    readyStatusB4: boolean;
    readyStatusB5: boolean;
    onePointWordHasBeenSaid: boolean;
    threePointWordHasBeenSaid: boolean;
    buzzWords: string;
    skippedWords: string;
    onePointWords: string;
    threePointWords: string;
}

export interface ITeamsInfo {
    playerA1?: string;
    playerA2?: string;
    playerA3?: string;
    playerA4?: string;
    playerA5?: string;
    playerB1?: string;
    playerB2?: string;
    playerB3?: string;
    playerB4?: string;
    playerB5?: string;
    readyStatusA1: boolean;
    readyStatusA2: boolean;
    readyStatusA3: boolean;
    readyStatusA4: boolean;
    readyStatusA5: boolean;
    readyStatusB1: boolean;
    readyStatusB2: boolean;
    readyStatusB3: boolean;
    readyStatusB4: boolean;
    readyStatusB5: boolean;
}


export interface ILobbyRequest {
    userName: string
    roomName: string
}

export interface IRemovePlayerRequest {
    playerName: string
    roomName: string
}

export interface members {
    name: string
    readyStatus: boolean
}

export interface IReadyStatusRequest {
    userName: string
    roomName: string
    isReady: boolean
}

export interface IChangeTimeLimitRequest {
    roomName: string
    timeLimit: number
}

export interface IChangeNumOfRoundsRequest {
    roomName: string
    numberOfRounds: number
}
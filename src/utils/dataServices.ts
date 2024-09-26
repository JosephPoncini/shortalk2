import { request } from "http";
import { GameModel, IChangeGamePhaseRequest, IChangeNumOfRoundsRequest, IChangeTimeLimitRequest, ILobbyRequest, IReadyStatusRequest, IRemovePlayerRequest } from "./interefaces";

const url = 'http://localhost:5051/Game/';

export const createRoom = async (requestBody: ILobbyRequest) => {
    const promise = await fetch(url + 'createGame', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });
    const result = await promise.text();
    return result;
};

export const joinRoom = async (requestBody: ILobbyRequest) => {
    const promise = await fetch(url + 'joinRoom', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });
    const result = await promise.text();
    return result;
};

export const getGamebyRoomName = async (roomName: string) => {
    const promise = await fetch(url + `getRoomByName/${roomName}`)
    const result = await promise.json();

    return result
}

export const getTeamMembersByRoom = async (roomName: string) => {
    const promise = await fetch(url + `getTeamMembersByRoom/${roomName}`)
    const result = await promise.json();

    return result
}

export const getTimeLimitByRoom = async (roomName: string) => {
    const promise = await fetch(url + `getTimeLimitByRoom/${roomName}`)
    const result = await promise.json();

    return result
}

export const getNumOfRoundsByRoom = async (roomName: string) => {
    const promise = await fetch(url + `getNumOfRoundsByRoom/${roomName}`)
    const result = await promise.json();

    return result
}

export const getHostByRoom = async (roomName: string) => {
    const promise = await fetch(url + `getHostByRoom/${roomName}`)
    const result = await promise.text();

    return result
}

export const getGamePhaseByRoom = async (roomName: string) => {
    const promise = await fetch(url + `getGamePhaseByRoom/${roomName}`)
    const result = await promise.text();

    return result
}

export const toggleTeamFetch = async (requestBody: ILobbyRequest) => {
    const promise = await fetch(url + 'toggleTeam', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });
    const result = await promise.text();
    return result;
};

export const shuffleTeams = async (requestBody: ILobbyRequest) => {
    const promise = await fetch(url + 'shuffleTeams', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });
    const result = await promise.text();
    return result;
};

export const setReadyStatus = async (requestBody: IReadyStatusRequest) => {
    const promise = await fetch(url + 'setReadyStatus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });
    const result = await promise.text();
    return result;
};

export const changeTimeLimit = async (requestBody: IChangeTimeLimitRequest) => {
    const promise = await fetch(url + 'changeTimeLimit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });
    const result = await promise.text();
    return result;
};

export const changeNumberOfRounds = async (requestBody: IChangeNumOfRoundsRequest) => {
    const promise = await fetch(url + 'changeNumberOfRounds', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });
    const result = await promise.text();
    return result;
};

export const removePlayer = async (requestBody: IRemovePlayerRequest) => {
    const promise = await fetch(url + 'removePlayer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });
    const result = await promise.text();
    return result;
}

export const changeGamePhase = async (requestBody: IChangeGamePhaseRequest) => {
    const promise = await fetch(url + 'changeGamePhase', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });
    const result = await promise.text();
    return result;
};

import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const disconnectFromHub = (conn: HubConnection) => {
    if (conn) {
        conn.stop()
            .then(() => console.log("Disconnected from the hub"))
            .catch(err => console.error("Error while disconnecting:", err));
    }
};

export const sendMessage = async (conn: HubConnection | undefined, username:string | null, lobby:string, msg: string) => {
    console.log(conn)
    try {
        conn && await conn.invoke("SendMessage", { Username: username, RoomName: lobby } , msg);
    } catch (e) {
        console.log(e)
    }
}

const toggleReadiness = async (conn: HubConnection, username: string, lobbyroom: string) => {
    try {
        conn && await conn.invoke("TogglePayerAsReady", { username, lobbyroom });
    } catch (e) {
        console.log(e)
    }
}

const changeRounds = async (conn: HubConnection, username: string, lobbyroom: string, numberOfRounds: string) => {
    try {
        conn && await conn.invoke("ChangeNumberOfRounds", { username, lobbyroom }, numberOfRounds);
    } catch (e) {
        console.log(e)
    }
}


// const startGame = async (conn: HubConnection, username: string, lobbyroom: string) => {
//     const response = await createGameRoom(lobbyroom);
//     if (response) {
//         try {
//             conn && await conn.invoke("StartGame", { username, lobbyroom });
//         } catch (e) {
//             console.log(e)
//         }
//     }

// }

export const RefreshTeams = async (conn: HubConnection, username: string, lobbyroom: string, msg: string) => {
    try {
        conn && await conn.invoke("RefreshTeams", { Username: username, RoomName: lobbyroom }, msg);
    } catch (e) {
        console.log(e)
    }
}

export const RefreshTime = async (conn: HubConnection, username: string, lobbyroom: string, timeLimit: number) => {
    try {
        conn && await conn.invoke("RefreshTime", { Username: username, RoomName: lobbyroom }, timeLimit);
    } catch (e) {
        console.log(e)
    }
}

export const RefreshRounds = async (conn: HubConnection, username: string, lobbyroom: string, numOfRounds: number) => {
    try {
        conn && await conn.invoke("RefreshRounds", { Username: username, RoomName: lobbyroom }, numOfRounds);
    } catch (e) {
        console.log(e)
    }
}

export const RefreshGamePhase = async (conn: HubConnection, username: string, lobbyroom: string, gamePhase: string) => {
    try {
        conn && await conn.invoke("RefreshGamePhase", { Username: username, RoomName: lobbyroom }, gamePhase);
    } catch (e) {
        console.log(e)
    }
}

export const RefreshCard = async (conn: HubConnection, username: string, lobbyroom: string) => {
    try {
        conn && await conn.invoke("RefreshCard", { Username: username, RoomName: lobbyroom });
    } catch (e) {
        console.log(e)
    }
}

export const GoToNextTurn = async (conn: HubConnection, username: string, lobbyroom: string) => {
    try {
        conn && await conn.invoke("GoToNextTurn", { Username: username, RoomName: lobbyroom });
    } catch (e) {
        console.log(e)
    }
}

export const TypeDescription = async (conn: HubConnection, username: string, lobbyroom: string, msg: string) => {
    try {
        conn && await conn.invoke("TypeDescription", { Username: username, RoomName: lobbyroom }, msg);
    } catch (e) {
        console.log(e)
    }
}


const shuffleTeams = async (conn: HubConnection, username: string, lobbyroom: string) => {
    try {
        conn && await conn.invoke("ShuffleTeams", { username, lobbyroom });
    } catch (e) {
        console.log(e)
    }
}

const removePlayer = async (conn: HubConnection, playerName: string, lobbyroom: string) => {
    try {
        conn && await conn.invoke("RemovePlayer", playerName, lobbyroom);
    } catch (e) {
        console.log(e)
    }
}


export const submitGuess = async (conn: HubConnection | undefined, username:string | null, lobby:string, guess: string) => {
    console.log(conn)
    try {
        conn && await conn.invoke("SendGuess", { Username: username, RoomName: lobby } , guess);
    } catch (e) {
        console.log(e)
    }
}
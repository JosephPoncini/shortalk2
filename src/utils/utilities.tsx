import { ITeamsInfo, members } from "./interefaces";


export const renderOptions = (minNum: number, maxNum: number, ifSeconds: boolean) => {
    const renderedOptions = [];
    for (let i = minNum; i <= maxNum; i++) {
        renderedOptions.push(<option key={i} value={i}>{ifSeconds ? String(i).padStart(2, '0') : i}</option>)
    }
    return renderedOptions;
}

export const extractTeam1members = (teamInfo: ITeamsInfo) => {

    const team1members: members[] = [];

    if (teamInfo.playerA1) {
        team1members.push({ name: teamInfo.playerA1, readyStatus: teamInfo.readyStatusA1 });
    }
    if (teamInfo.playerA2) {
        team1members.push({ name: teamInfo.playerA2, readyStatus: teamInfo.readyStatusA2 });
    }
    if (teamInfo.playerA3) {
        team1members.push({ name: teamInfo.playerA3, readyStatus: teamInfo.readyStatusA3 });
    }
    if (teamInfo.playerA4) {
        team1members.push({ name: teamInfo.playerA4, readyStatus: teamInfo.readyStatusA4 });
    }
    if (teamInfo.playerA5) {
        team1members.push({ name: teamInfo.playerA5, readyStatus: teamInfo.readyStatusA5 });
    }

    return team1members;
}

export const extractTeam2members = (teamInfo: ITeamsInfo) => {

    const team2members : members[] = [];

    if (teamInfo.playerB1) {
        team2members.push({ name: teamInfo.playerB1, readyStatus: teamInfo.readyStatusB1 });
    }
    if (teamInfo.playerB2) {
        team2members.push({ name: teamInfo.playerB2, readyStatus: teamInfo.readyStatusB2 });
    }
    if (teamInfo.playerB3) {
        team2members.push({ name: teamInfo.playerB3, readyStatus: teamInfo.readyStatusB3 });
    }
    if (teamInfo.playerB4) {
        team2members.push({ name: teamInfo.playerB4, readyStatus: teamInfo.readyStatusB4 });
    }
    if (teamInfo.playerB5) {
        team2members.push({ name: teamInfo.playerB5, readyStatus: teamInfo.readyStatusB5 });
    }

    return team2members;
}

export const removeSpaces = (str: string) => {
    // Define the characters that are not standard in a URL
    const nonStandardCharacters = /[^a-zA-Z0-9-_.~]/g;
    
    // Replace any non-standard characters with a dash
    return str.replace(nonStandardCharacters, '-');
}

export const checkPlayersReadiness = (teamInfo: ITeamsInfo): boolean => {
    // Gather all the players and their readiness statuses into arrays
    const players = [
        teamInfo.playerA1, teamInfo.playerA2, teamInfo.playerA3, teamInfo.playerA4, teamInfo.playerA5,
        teamInfo.playerB1, teamInfo.playerB2, teamInfo.playerB3, teamInfo.playerB4, teamInfo.playerB5
    ];

    const readyStatuses = [
        teamInfo.readyStatusA1, teamInfo.readyStatusA2, teamInfo.readyStatusA3, teamInfo.readyStatusA4, teamInfo.readyStatusA5,
        teamInfo.readyStatusB1, teamInfo.readyStatusB2, teamInfo.readyStatusB3, teamInfo.readyStatusB4, teamInfo.readyStatusB5
    ];

    const team1 = [
        teamInfo.playerA1, teamInfo.playerA2, teamInfo.playerA3, teamInfo.playerA4, teamInfo.playerA5,
    ]

    const team2 = [
        teamInfo.playerB1, teamInfo.playerB2, teamInfo.playerB3, teamInfo.playerB4, teamInfo.playerB5
    ]

    // Count the number of players that are ready
    const readyPlayersCount = readyStatuses.filter(status => status).length;

    // Count the total number of players in the lobby
    const totalPlayers = players.filter(player => player != undefined).length;

    const totalPlayersOnTeam1 = team1.filter(player => player != undefined).length;

    const totalPlayersOnTeam2 = team2.filter(player => player != undefined).length;

    // Check if there are at least 4 players ready and if all but one player is ready
    const isReadyToStart = totalPlayers >= 4 && readyPlayersCount >= totalPlayers - 1 && Math.abs(totalPlayersOnTeam2 - totalPlayersOnTeam1)  < 2;


    return isReadyToStart;
};
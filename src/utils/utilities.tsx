import { LetterCircleH } from "@phosphor-icons/react/dist/ssr";
import { ICardDto, ICheckPlayersReadiness, IScoresDto, ITeams, ITeamsInfo, members } from "./interefaces";


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
        team1members.push({ name: teamInfo.playerA1, readyStatus: teamInfo.readyStatusA1, role: 'speaker', spot: 1 });
    }
    if (teamInfo.playerA2) {
        team1members.push({ name: teamInfo.playerA2, readyStatus: teamInfo.readyStatusA2, role: 'guesser', spot: 2 });
    }
    if (teamInfo.playerA3) {
        team1members.push({ name: teamInfo.playerA3, readyStatus: teamInfo.readyStatusA3, role: 'guesser', spot: 3 });
    }
    if (teamInfo.playerA4) {
        team1members.push({ name: teamInfo.playerA4, readyStatus: teamInfo.readyStatusA4, role: 'guesser', spot: 4 });
    }
    if (teamInfo.playerA5) {
        team1members.push({ name: teamInfo.playerA5, readyStatus: teamInfo.readyStatusA5, role: 'guesser', spot: 5 });
    }

    // console.log(team1members)

    return team1members;
}

export const extractTeam2members = (teamInfo: ITeamsInfo) => {

    const team2members: members[] = [];

    if (teamInfo.playerB1) {
        team2members.push({ name: teamInfo.playerB1, readyStatus: teamInfo.readyStatusB1, role: 'defense', spot: 1 });
    }
    if (teamInfo.playerB2) {
        team2members.push({ name: teamInfo.playerB2, readyStatus: teamInfo.readyStatusB2, role: 'defense', spot: 2 });
    }
    if (teamInfo.playerB3) {
        team2members.push({ name: teamInfo.playerB3, readyStatus: teamInfo.readyStatusB3, role: 'defense', spot: 3 });
    }
    if (teamInfo.playerB4) {
        team2members.push({ name: teamInfo.playerB4, readyStatus: teamInfo.readyStatusB4, role: 'defense', spot: 4 });
    }
    if (teamInfo.playerB5) {
        team2members.push({ name: teamInfo.playerB5, readyStatus: teamInfo.readyStatusB5, role: 'defense', spot: 5 });
    }

    // console.log(team2members)

    return team2members;
}

export const removeSpaces = (str: string) => {
    // Define the characters that are not standard in a URL
    const nonStandardCharacters = /[^a-zA-Z0-9-_.~]/g;

    // Replace any non-standard characters with a dash
    return str.replace(nonStandardCharacters, '-');
}

export const checkPlayersReadiness = (teamInfo: ITeamsInfo): ICheckPlayersReadiness => {
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
    const isReadyToStart = totalPlayers >= 4 && readyPlayersCount >= totalPlayers - 1 && Math.abs(totalPlayersOnTeam2 - totalPlayersOnTeam1) < 2;

    const result: ICheckPlayersReadiness = {
        isReadyToStart: isReadyToStart,
        numOfPlayersReady: readyPlayersCount,
        numOfPlayers: totalPlayers
    }

    return result;
};

export const assignRoles = (teams: ITeams, turnNumber: number, username: string | null) => {
    const teamAcount = teams.teamA.length;
    const teamBcount = teams.teamB.length;


    // // console.log("teams:")
    // // console.log(teams);
    // // console.log("Team A count " + teamAcount );
    // // console.log("Team B count " + teamBcount );

    teams.teamA.map((player) => {
        if (turnNumber % 2 == 0) {
            player.role = 'defense'
        } else if ((Math.floor(turnNumber / 2) % teamAcount) + 1 == player.spot) {
            player.role = 'speaker'
        } else {
            player.role = 'guesser'
        }

        if (player.name == username) {
            teams.myRole = player.role;
        }
    })

    // console.log(teams.teamA);

    teams.teamB.map((player) => {
        if (turnNumber % 2 == 1) {
            player.role = 'defense'
        } else if ((((turnNumber / 2) + 1) % teamBcount) + 1 == player.spot) {
            player.role = 'speaker'
        } else {
            player.role = 'guesser'
        }

        if (player.name == username) {
            teams.myRole = player.role;
        }
    })

    let round = 0;
    if (teamAcount > teamBcount) {
        round = Math.ceil((turnNumber) / (2 * teamAcount))
    } else {
        round = Math.ceil((turnNumber) / (2 * teamBcount))
    }

    teams.round = round;
    // console.log(teams.teamB)

    return teams;

}

export const parseString = (input: string) => {
    if (input) {
        const pairs = input.slice(0, -1).split('-');
        console.log("pairs: ")
        console.log(pairs)
        const result = pairs.map(pair => {
            const [first, second] = pair.split('_');
            const card: ICardDto = {
                firstWord: first,
                secondWord: second
            }
            return card;
        });
        console.log(result)
        return result;
    }
    return [];
}

export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const checkWin = (username: string, teamA: members[], scores: IScoresDto) => {
    if (scores.teamAScore == scores.teamBScore) {
        return 0;
    }

    if (scores.teamAScore > scores.teamBScore) {
        for (const player of teamA) {
            console.log("team A won");
            if (player.name === username) {
                console.log("found him");
                console.log(player.name);
                console.log(username);
                return 1;
            }
        }
        return -1; 
    } else {
        console.log("team B won");
        for (const player of teamA) {
            if (player.name === username) {
                console.log("found him");
                console.log(player.name);
                console.log(username);
                return -1; 
            }
        }
        return 1; 
    }

}
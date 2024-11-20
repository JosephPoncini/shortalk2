'use client'

import BuzzBtn from '@/components/BuzzBtn'
import Card from '@/components/Card'
import DiceBtn from '@/components/DiceBtn'
import NavBar from '@/components/NavBar'
import OnePointBtn from '@/components/OnePointBtn'
import OnlineTeamName from '@/components/OnlineTeamName'
import PlayAgainBtn from '@/components/PlayAgainBtn'
import ReadyBtn from '@/components/ReadyBtn'
import ScoreTable from '@/components/ScoreTable'
import ShuffleBtn from '@/components/Shufflebtn'
import SkipBtn from '@/components/SkipBtn'
import StartBtn from '@/components/StartBtn'
import StatusBar from '@/components/StatusBar'
import ThreePointBtn from '@/components/ThreePointBtn'
import { addBuzzedWord, addOnePointWord, addSkippedWord, addThreePointWord, changeGamePhase, changeNumberOfRounds, changeTimeLimit, checkIfNameExistsInGame, cleanLobby, cleanScore, cleanSlate, getAllWords, getCard, getGamebyRoomName, getGamePhaseByRoom, getHostByRoom, getNumOfRoundsByRoom, getScores, getTeamMembersByRoom, getTimeLimitByRoom, getTurnNumber, getWordsBeenSaid, joinRoom, removePlayer, setReadyStatus, setStartTimeForRound, shuffleTeams, toggleTeamFetch } from '@/utils/dataServices'
import { BanPlayer, GoToNextTurn, RefreshCard, RefreshGamePhase, RefreshRounds, RefreshTeams, RefreshTime, sendMessage, submitGuess, TypeDescription } from '@/utils/hubServices'
import { IAllWords, ICardDto, IScoresDto, ITeams, ITeamsInfo, IWordsHaveBeenSaidDto, members } from '@/utils/interefaces'
import { assignRoles, checkPlayersReadiness, checkWin, delay, extractTeam1members, extractTeam2members, parseString, renderOptions } from '@/utils/utilities'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { time } from 'console'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import { QuestionMark, Shield, UserSound } from '@phosphor-icons/react'
import NextBtn from '@/components/NextBtn'


const page = ({ params }: { params: { 'lobby-name': string } }) => {

  const url = 'http://localhost:5051/Game';
  const username = sessionStorage.getItem("Username");
  const isHost = sessionStorage.getItem("isHost");
  const lobby = params['lobby-name'];
  const router = useRouter();
  const maxRounds: number = 10;
  const maxMinutes: number = 5;
  const maxSeconds: number = 59;

  const [gamePhase, setGamePhase] = useState<string>("")

  //lobby UseStates


  const [conn, setConnection] = useState<HubConnection>()
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isLobbyReady, setIsLobbyReady] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<{ username: string; msg: string; }[]>([]);

  const [selectedRounds, setSelectedRounds] = useState('1');
  const [selectedMinutes, setSelectedMinutes] = useState(1);
  const [selectedSeconds, setSelectedSeconds] = useState(30);

  const [warningText, setWarningText] = useState(' ');
  const [isTimeOk, setIsTimeOk] = useState(true);

  const [team1members, setTeam1members] = useState<members[]>([]);
  const [team2members, setTeam2members] = useState<members[]>([]);
  const [theHost, setTheHost] = useState<string>('')


  //game UseStates
  const [guessBoxClicked, setGuessBoxClicked] = useState<boolean>(false);
  const [speakerBoxClicked, setSpeakerBoxClicked] = useState<boolean>(false);
  const inputRefGuesserBox = useRef<HTMLInputElement | null>(null);
  const inputRefSpeakerBox = useRef<HTMLTextAreaElement | null>(null);

  const [timeLimit, setTimeLimit] = useState<number>(90)
  const [round, setRound] = useState<number>(0);
  const [turnNumber, setTurnNumber] = useState<number>(0);
  const [roundTotal, setRoundTotal] = useState<number>(0);
  const [role, setRole] = useState<string | undefined>('defense');
  const [onePointWord, setOnePointWord] = useState<string>('');
  const [threePointWord, setThreePointWord] = useState<string>('');
  const [speaker, setSpeaker] = useState<string>('');

  const [onePointWordHasBeenSaid, setOnePointWordHasBeenSaid] = useState<boolean>(true);
  const [threePointWordHasBeenSaid, setThreePointWordHasBeenSaid] = useState<boolean>();

  const [buzzWords, setBuzzWords] = useState<ICardDto[]>([])
  const [onePointWords, setOnePointWords] = useState<ICardDto[]>([])
  const [threePointWords, setThreePointWords] = useState<ICardDto[]>([])
  const [skipWords, setSkipWords] = useState<ICardDto[]>([])

  const [guess, setGuess] = useState<string>('')
  const [guesses, setGuesses] = useState<{ username: string; guess: string; color: string }[]>([]);
  const [description, setDescription] = useState<string>('');

  const [numbOfPlayersReady, setNumOfPlayersReady] = useState<number>(0);
  const [totalNumberOfPlayers, setTotalNumberOfPlayers] = useState<number>(0);

  const [gettingScores, setGettingScores] = useState<boolean>(false);

  const [teamAScore, setTeamAScore] = useState<number>(0);
  const [teamBScore, setTeamBScore] = useState<number>(0);

  const [isWinning, setIsWinning] = useState<number>(0);

  //animations
  const [doBarrelRoll, setDoBarrelRoll] = useState<boolean>(false);

  //router push

  const redirectToHomeWithRoom = () => {
    router.push(`/?room=${lobby}`);
  };

  // UseEffects

  useEffect(() => {
    const getGameInfo = async () => {
      let mode = await getGamePhaseByRoom(lobby);
      setGamePhase(mode);
      join();
      refreshTime();
      let myHost = await getHostByRoom(lobby);
      setTheHost(myHost);
    }

    if (sessionStorage.getItem("Username") == null) {
      redirectToHomeWithRoom();
    } else if (!conn) {
      getGameInfo();

    }
  }, [])

  useEffect(() => {

    const renderScores = async () => {
      const scores: IScoresDto = await getScores(lobby)
      setTeamAScore(scores.teamAScore);
      setTeamBScore(scores.teamBScore);
    }

    if (gamePhase == "endOfGame") {
      renderScores();
    }


  }, [gamePhase])

  useEffect(() => {
    const changeBackEndStatus = async () => {
      console.log(isReady);
      let msg = username && await setReadyStatus({ userName: username, roomName: lobby, isReady: isReady });
      console.log(msg);
      conn && username && RefreshTeams(conn, username, lobby, isReady ? "*is ready*" : "*is not ready*");
    }

    changeBackEndStatus();
  }, [isReady])

  useEffect(() => {
    setSpeakerBoxClicked(false);
    setGuessBoxClicked(false);
  }, [gamePhase])

  // useEffect(()=>{
  //   if(round > Number(selectedRounds)){
  //     setGamePhase("endOfGame");
  //   }
  // },[round])


  // Handle Functions Lobby Room 
  const handleRemove = async (playerName: string) => {
    let msg = await removePlayer({ playerName: playerName, roomName: lobby });
    console.log(msg)
    conn && username && BanPlayer(conn, "admin", lobby, playerName);
    conn && username && RefreshTeams(conn, "admin", lobby, `removed ${playerName}`);
  }

  const handleShuffle = async () => {
    if (!isReady) {
      let msg = username && await shuffleTeams({ userName: username, roomName: lobby });
      console.log(msg);
      conn && username && RefreshTeams(conn, username, lobby, "shuffled");
    }

  }

  const handleToggleTeam = async () => {
    if (!isReady) {
      let msg = username && await toggleTeamFetch({ userName: username, roomName: lobby });
      console.log(msg);
      conn && username && RefreshTeams(conn, username, lobby, "swapped teams");
    }
  }

  const handleChangeRounds = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRounds(e.target.value)
    const numOfRounds = parseInt(e.target.value);
    let msg = await changeNumberOfRounds({ roomName: lobby, numberOfRounds: numOfRounds })
    console.log(msg);
    conn && username && await RefreshRounds(conn, username, lobby, numOfRounds);
  }

  const handleChangeTimeLimitSeconds = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeconds(parseInt(e.target.value))
    const time = selectedMinutes * 60 + parseInt(e.target.value);
    let msg = await changeTimeLimit({ roomName: lobby, timeLimit: time })
    console.log(msg);
    conn && username && await RefreshTime(conn, username, lobby, time);
  }

  const handleChangeTimeLimitMinutes = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMinutes(parseInt(e.target.value))
    const time = parseInt(e.target.value) * 60 + selectedSeconds;
    let msg = await changeTimeLimit({ roomName: lobby, timeLimit: time })
    console.log(msg);
    conn && username && await RefreshTime(conn, username, lobby, time);
  }

  const handleStartClick = async () => {

    if (isLobbyReady) {
      let msg = await changeGamePhase({ roomName: lobby, gamePhase: "game" })
      let msg2 = await cleanSlate(lobby);
      let msg3 = await cleanScore(lobby);

      console.log(msg);
      console.log(msg2);
      console.log(msg3);

      // conn && username && await RefreshCard(conn, username, lobby)
      conn && username && await RefreshCard(conn, username, lobby, "")
      conn && username && await GoToNextTurn(conn, username, lobby)
      conn && username && await RefreshGamePhase(conn, username, lobby, "game")

    }
  }

  const handleNextTurn = async () => {
    // turnNumber increases by 1 ==> service
    // players fetch new turnNumber
    // players figure out new roles
    // refresh Card
    const turn = await getTurnNumber(lobby)
    console.log(isReady)

    if (gamePhase == "finalScoreBoard") {
      // let msg = username && await removePlayer({ playerName: username, roomName: lobby });
      setGamePhase("endOfGame")
    } else if (isLobbyReady) {
      let msg = await changeGamePhase({ roomName: lobby, gamePhase: "game" })
      console.log(msg);

      let msg2 = await cleanSlate(lobby);
      console.log(msg2)

      // conn && username && await RefreshCard(conn, username, lobby)
      conn && username && await RefreshCard(conn, username, lobby, "")
      conn && username && await GoToNextTurn(conn, username, lobby)
      conn && username && await RefreshGamePhase(conn, username, lobby, "game")

    } else {
      setIsReady(true);
      setGamePhase("intermission")
    }

  }

  const handleReadyClick = async () => {
    setIsReady(!isReady);
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter if statement that checks game phase
    if (event.key === 'Enter') {
      if (message !== '') {
        sendMessage(conn, username, lobby, message);
        setMessage('');
      } else {

      }
    }
  };

  // Handle Functions Game Room

  const handleKeyDownGuesserBox = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (inputRefGuesserBox.current) {
        submitGuess(conn, username, lobby, inputRefGuesserBox.current.value)
        inputRefGuesserBox.current.value = "";
      }
    }
  };

  const handleTimeOut = async () => {
    if (isHost == 'true') {
      if (gamePhase == 'lastTurn') {
        let msg = await changeGamePhase({ roomName: lobby, gamePhase: "lobby" })
        let msg2 = await cleanLobby(lobby)
        console.log(msg);
        console.log(msg2);
      } else {
        let msg = await changeGamePhase({ roomName: lobby, gamePhase: "scoreBoard" })
        console.log(msg);
      }

      // conn && username && await RefreshGamePhase(conn, username, lobby, "game")
    }
    // setIsReady(false);
    setGuesses([]);
    let words: IAllWords = await getAllWords(lobby);

    setSkipWords(parseString(words.skippedWords));
    setBuzzWords(parseString(words.buzzWords));
    setOnePointWords(parseString(words.onePointWords));
    setThreePointWords(parseString(words.threePointWords));
    if (gamePhase == 'lastTurn') {
      const scores: IScoresDto = await getScores(lobby)
      console.log(scores)
      console.log(username)
      console.log(team1members)
      let winMode = username && checkWin(username,team1members,scores)
      console.log(winMode)
      winMode && setIsWinning(winMode)
      setGamePhase("finalScoreBoard")
    } else {
      setGamePhase("scoreBoard")
    }

  }

  // const TypeDescription = async (description: string) => {
  //   // try {
  //   //   conn && await conn.invoke("TypeDescription", description);
  //   // } catch (e) {
  //   //   console.log(e)
  //   // }

  // }

  const handleOnChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // if (description != event.target.value) {
    //   TypeDescription(event.target.value)
    // } else {
    //   TypeDescription(event.target.value)
    // }
    conn && username && await TypeDescription(conn, username, lobby, event.target.value)
  }

  const handleSkip = async () => {
    let msg = await addSkippedWord({ roomName: lobby, card: { firstWord: onePointWord, secondWord: threePointWord } })
    console.log(msg);

    conn && username && await RefreshCard(conn, username, lobby, "skipped")

  }
  const handleBuzz = async () => {
    let msg = await addBuzzedWord({ roomName: lobby, card: { firstWord: onePointWord, secondWord: threePointWord } })
    console.log(msg);

    conn && username && await RefreshCard(conn, username, lobby, "buzzed")
  }
  const handleOnePoint = async () => {
    let msg = await addOnePointWord({ roomName: lobby, card: { firstWord: onePointWord, secondWord: threePointWord } })
    console.log(msg);

    conn && username && await RefreshCard(conn, username, lobby, "claimed 1 point")
  }
  const handleThreePoint = async () => {
    let msg = await addThreePointWord({ roomName: lobby, card: { firstWord: onePointWord, secondWord: threePointWord } })
    console.log(msg);

    conn && username && await RefreshCard(conn, username, lobby, "claimed 3 points")
  }

  const handlePlayAgain = async () => {
    let msg = username && await joinRoom({ userName: username, roomName: lobby });
    conn && username && await conn.invoke("JoinSpecificGame", { Username: username, RoomName: lobby });
    setGamePhase("lobby");
  }


  // SignalR functions (what we want the pages to do on signalR commands)
  const refreshTeams = async () => {
    let teamInfo = await getTeamMembersByRoom(lobby);
    let turn = await getTurnNumber(lobby)
    // console.log(teamInfo)

    const team1 = extractTeam1members(teamInfo);
    const team2 = extractTeam2members(teamInfo)

    if (turn > 0) {

      const teams: ITeams = assignRoles({ teamA: team1, teamB: team2 }, turn, username);
      setTeam1members(teams.teamA);
      setTeam2members(teams.teamB);
      setRole(teams.myRole)
      teams.round && setRound(teams.round);
    } else {
      setTeam1members(team1);
      setTeam2members(team2);
    }

    let playerReadiness = checkPlayersReadiness(teamInfo)

    setIsLobbyReady(playerReadiness.isReadyToStart)
    setNumOfPlayersReady(playerReadiness.numOfPlayersReady)
    setTotalNumberOfPlayers(playerReadiness.numOfPlayers);
  }

  const refreshTime = async () => {
    let timeLimit = await getTimeLimitByRoom(lobby)
    console.log(timeLimit)
    setSelectedMinutes(Math.floor(timeLimit / 60));
    setSelectedSeconds(timeLimit % 60);
  }

  const banPlayer = async (player: string) => {
    console.log("This is the username: " + username)
    console.log("This is the player being banned: " + player)
    if (username == player) {
      sessionStorage.setItem("BannedRoom", lobby);
      sessionStorage.setItem("Username", "");
      sessionStorage.setItem("isHost", "false");
      router.push(`../`);
    }

  }

  const refreshRounds = async () => {
    let numOfRounds = await getNumOfRoundsByRoom(lobby)
    setSelectedRounds(numOfRounds);
  }

  const refreshGamePhase = async () => {
    let gameMode = await getGamePhaseByRoom(lobby);
    let time = await getTimeLimitByRoom(lobby);
    setTimeLimit(time);
    setGamePhase(gameMode);
    if (gameMode != "lobby") {
      setIsReady(false);
    }

  }

  const refreshCard = async () => {
    if (!doBarrelRoll) {
      setDoBarrelRoll(true)
      let card: ICardDto = await getCard(lobby);
      console.log(card.firstWord);
      console.log(card.secondWord);
      setOnePointWord(card.firstWord);
      setThreePointWord(card.secondWord);
      setOnePointWordHasBeenSaid(false);
      setThreePointWordHasBeenSaid(false);
    }
  }

  useEffect(() => {
    const resetBarrelRoll = async () => {
      await delay(500);
      setDoBarrelRoll(false);
    }
    if (doBarrelRoll) {
      resetBarrelRoll();
    }
  }, [doBarrelRoll])

  const refreshWordsSaidTracker = async () => {
    let wordsSaid: IWordsHaveBeenSaidDto = await getWordsBeenSaid(lobby);
    setOnePointWordHasBeenSaid(wordsSaid.onePointWordHasBeenSaid);
    setThreePointWordHasBeenSaid(wordsSaid.threePointWordHasBeenSaid);
  }
  // Join Room ( Initialize SignalR connection )
  const join = async () => {
    console.log("We are joining room")
    try {
      const conn = new HubConnectionBuilder()
        .withUrl(url)
        .configureLogging(LogLevel.Information)
        .build();

      conn.on("JoinSpecificGame", (username: string, msg: string, json: string) => { // Specify the types for parameters

        setMessages(messages => [...messages, { username, msg }])
        refreshTeams();

        // if (gamePhase != "finalScoreBoard" && gamePhase != "endOfGame") {
        //   refreshGamePhase();
        // }
      });

      conn.on("SendMessage", (username: string, msg: string) => {
        setMessages(messages => [...messages, { username, msg }])
        console.log("My messages");
        console.log(messages);
      })

      conn.on("RefreshTeams", (username: string, msg: string) => {
        setMessages(messages => [...messages, { username, msg }])
        refreshTeams();
      })

      conn.on("RefreshTime", (username: string, msg: string) => {
        refreshTime();
        setMessages(messages => [...messages, { username, msg }])
      })

      conn.on("BanPlayer", (username: string, player: string) => {
        console.log("We are banning a player")
        banPlayer(player);
        // setMessages(messages => [...messages, { username, msg }])
      })

      conn.on("RefreshRounds", (username: string, msg: string) => {
        refreshRounds();
        setMessages(messages => [...messages, { username, msg }])
      })

      conn.on("RefreshGamePhase", (username: string, msg: string) => {
        refreshGamePhase();
        setMessages(messages => [...messages, { username, msg }])
      })

      conn.on("RefreshCard", (username: string, msg: string) => {
        let color = ""
        let location = "/sounds/";
        if (msg == "buzzed") {
          color = "dred"
          location += "buzzSound.wav"
        } else if (msg == "skipped") {
          location += "skipSound.wav"
          color = "mgray"
        } else if (msg == "claimed 1 point") {
          location += "onePointSound.wav"
        } else if (msg == "claimed 3 points") {
          location += "threePointSound.wav"
        }
        console.log(location);
        const audio = new Audio(location);
        audio.play();
        refreshCard();
        if (inputRefSpeakerBox.current) {
          inputRefSpeakerBox.current.value = "";
        }
        setDescription("");
        if (msg) {
          setGuesses(guesses => [...guesses, { username, guess: msg, color }])
        }
        setGettingScores(true);
        // setMessages(messages => [...messages, { username, msg }])
      })

      conn.on("GoToNextTurn", (username: string, msg: string) => {
        refreshTeams();
        console.log(msg)
        // setMessages(messages => [...messages, { username, msg }])
      })

      conn.on("TypeDescription", (username: string, msg: string) => {
        setDescription(msg);
      })


      conn.on("SendGuess", (username: string, guess: string, color: string) => {
        //retrieve if OnePointWordHasBeenSaid and if ThreePointWordHasBeenSaid
        refreshWordsSaidTracker();
        setGuesses(guesses => [...guesses, { username, guess, color }])
      })

      await conn.start();
      await conn.invoke("JoinSpecificGame", { Username: username, RoomName: lobby });

      console.log(conn)
      setConnection(conn);
      console.log('success')
    } catch (e) {
      console.log(e);
    }
  }

  if (gamePhase == "lobby") {
    return (
      <div className=' flex flex-col justify-between pb-2 h-screen items-center'>

        <div className='relative w-full'>
          <NavBar title={"Room ID: " + params['lobby-name']} />
        </div>

        {/* Body */}


        <div className='flex flex-col sm:flex-row justify-between mb-2'>

          <OnlineTeamName teamName={"Team 1"} host={theHost} members={team1members} handleRemove={handleRemove} />

          <div className='flex-col items-center sm:space-y-5 order-3 sm:order-1'>
            <div className={`flex justify-center`}>
              <button onClick={handleToggleTeam} className={`w-[100px] sm:w-[230px] h-[25px] sm:h-[50px] bg-dblue ${isReady ? 'opacity-[0.5] cursor-default' : ' hover:bg-hblue active:text-dblue'}  font-LuckiestGuy text-white text-[12px] sm:text-lg text-center tracking-wider rounded-md border border-black`}>
                Toggle Team
              </button>
            </div>
            <div className={`flex justify-center`}>
              <DiceBtn isReady={isReady} onClick={handleShuffle} />
            </div>
            {
              isHost == 'true' ?
                <div className='flex justify-center'>
                  <StartBtn isLobbyReady={isLobbyReady} isHost={isHost == 'true'} onClick={handleStartClick} />
                </div>
                :
                <div className='flex justify-center'>
                  <ReadyBtn isReady={isReady} isHost={isHost == 'true'} onClick={handleReadyClick} />
                </div>
            }

          </div>
          <OnlineTeamName teamName={"Team 2"} host={theHost} members={team2members} handleRemove={handleRemove} />


        </div>

        {/* <div className='lg:hidden flex justify-center gap-4'>
          <button className='w-[180px] h-[50px] bg-dblue lg:mt-5 mt-0 font-LuckiestGuy flex justify-center'>
            <p className=' text-white text-center tracking-wider flex items-center'>Toggle Team</p>
          </button>
          <ShuffleBtn onClick={() => { }} />
        </div> */}

        <div className=' flex flex-col items-center space-y-2'>
          <div className='flex flex-row justify-between whitespace-nowrap items-center lg:w-[400px] w-[100%]'>
            <div className=' font-LuckiestGuy text-dblue text-[20px] sm:text-3xl sm:text-start text-center'>Number of Rounds:</div>
            <div className='flex justify-end'>
              <div className=' text-lblue font-LuckiestGuy text-lg sm:text-3xl'>:</div>
              {
                (isHost == 'true') ?
                  <select value={selectedRounds} onChange={(e) => handleChangeRounds(e)} className=' h-auto sm:h-10 rounded-md text-[12px] sm:text-lg' name='Rounds' id='Rounds'>
                    {renderOptions(1, maxRounds, false)}
                  </select>
                  :
                  <div className=' text-dblue font-LuckiestGuy text-[20px] sm:text-3xl'>{selectedRounds} </div>

              }
            </div>
          </div>
          <div className='flex flex-row justify-between whitespace-nowrap items-center lg:w-[400px] w-[100%]'>
            <div className=' font-LuckiestGuy text-dblue text-[20px] sm:text-3xl lg:text-start text-center'>Time Limit:</div>
            <div className='lg:w-[30%] w-[100%] flex justify-end space-x-3' >
              {
                (isHost == 'true') ?
                  <select className=' h-auto sm:h-10 rounded-md text-[12px] sm:text-lg' value={selectedMinutes} onChange={(e) => handleChangeTimeLimitMinutes(e)}>
                    {renderOptions(0, maxMinutes, false)}
                  </select>
                  :
                  <div className=' text-dblue font-LuckiestGuy text-[20px] sm:text-3xl'>{selectedMinutes}</div>
              }
              <div className=' text-dblue font-LuckiestGuy text-lg sm:text-3xl'>:</div>
              {
                (isHost == 'true') ?
                  <select className=' h-auto sm:h-10 rounded-md text-[12px] sm:text-lg' value={selectedSeconds} onChange={(e) => handleChangeTimeLimitSeconds(e)}>
                    {renderOptions(0, maxSeconds, true)}
                  </select>
                  :
                  <div className=' text-dblue font-LuckiestGuy text-[20px] sm:text-3xl'>{selectedSeconds < 10 ? '0'+selectedSeconds:selectedSeconds}</div>
              }
            </div>
          </div>
          <p className=' text-dred'>{warningText}</p>
          <div className='flex flex-row justify-between whitespace-nowrap items-center lg:w-[400px] w-[300px]'>
            {/* <div className=' font-LuckiestGuy text-dblue text-3xl mr-5'>ScoreKeeper</div>
                <select name="" id=""></select> */}
          </div>
        </div>

        {/* <div className='lg:hidden flex justify-center' onClick={handleStartClick}>
          <StartBtn isReady={isReady} isHost={isHost == 'true'} onClick={() => { }} />
        </div> */}

        <div className=' w-[95%] sm:w-[88%] h-[100px] sm:h-[224px] bg-lgray border-[#52576F] border-[10px] sm:border-[20px] md:p-4 p-2 '>
          <div className='h-[70%] overflow-y-auto flex flex-col-reverse'>
            <div>
              {
                messages.map((msg, ix) => {
                  return (
                    <p key={ix} className=' font-Roboto'> <span className=' font-RobotoBold'>{msg.username}</span> {" - "} <span>{msg.msg}</span> </p>
                  )
                })

              }
            </div>
          </div>
          <input onChange={(e) => { setMessage(e.target.value) }} onKeyDown={handleKeyDown} value={message} type="text" placeholder='Type to Chat' className='w-[99%] h-[38] border border-black' />
        </div>
      </div>
    )
  }
  else if (gamePhase == "game" || gamePhase == "lastTurn") {
    return (

      <div className='flex flex-col h-[100vh] items-center'>

        <div className='relative w-full'>
          <NavBar title={"Shortalk: " + params['lobby-name']} />
        </div>

        <div className=' p-2 pt-3 sm:p-5 sm:pt-10 w-full'>
          <StatusBar
            timeLimit={timeLimit}
            lobby={lobby}
            user={username}
            role={role}
            onTimeOut={handleTimeOut}
            gettingScores={gettingScores}
            setGettingScores={setGettingScores}
          />
        </div>
        <div className='grid grid-cols-2 grid-rows-2 gap-2 sm:flex sm:justify-evenly sm:space-x-5 px-5 pb-5 w-full h-[600px] sm:h-[70vh]'>

          {/* This is the Guesser box */}
          <div className='bg-white rounded-lg flex flex-col justify-between h-[250px] sm:h-full w-full row-start-2'>

            {/* Text from the guessers goes here */}
            <div className=' pt-2 sm:pt-4 pb-2 sm:px-4 px-2 text-[12px] sm:text-[20px] w-full sm:max-h-[60vh]'>
              <p className='border-black border-b'>Guesser Box</p>
              {/* <hr className='bg-black me-3' /> */}
              <div className=' text-green font-bold hidden'></div>
              <div className=' text-yellow font-bold hidden'></div>
              <div className=' text-purple font-bold hidden'></div>
              <div className=' text-mgray font-bold hidden'></div>
              <div className=' overflow-y-auto flex flex-col-reverse h-full pb-4 mt-[-6px] sm:mt-0'>
                {/* <div> */}
                {
                  guesses.slice().reverse().map((guess, ix) => {
                    console.log(guess.color);
                    return (
                      <p key={ix} className={`font-Roboto ${guess.color == 'dred' || guess.color == 'mgray' || guess.color == '' ? 'border-b-2' : 'border-none'}`}> <span className=' font-RobotoBold'>{guess.username}</span> {" - "} <span className={`${'text-' + guess.color}`}>{guess.guess}</span> </p>
                    )
                  })

                }
                {/* </div> */}
              </div>


            </div>
            {
              role == 'guesser' &&
              <div className={` h-[6%] mb-2 w-full sm:px-2 mt-4`}>
                <input id='guesserBox' ref={inputRefGuesserBox} onChange={(e) => { setGuess(e.target.value) }} onKeyDown={handleKeyDownGuesserBox} type="text" placeholder='Type Your Guesses Here...' className={`rounded-md w-full text-[10px] sm:text-[20px] border sm:px-4 ${!guessBoxClicked && 'glow-effect'}`} onClick={() => setGuessBoxClicked(true)} />
              </div>
            }

          </div>

          {/* This is the Card box */}
          <div className=' sm:h-full sm:w-full space-y-4 row-start-2'>
            <div className='flex justify-center sm:h-[85%]'>
              <Card top={onePointWord} bottom={threePointWord} isGuessing={role == 'guesser'} isAnimated={doBarrelRoll} />
            </div>
            {
              role == 'speaker' ?
                <div className={`flex justify-center`}>
                  {
                    threePointWordHasBeenSaid ?
                      <ThreePointBtn onClick={handleThreePoint} />
                      :
                      onePointWordHasBeenSaid ?
                        <OnePointBtn onClick={handleOnePoint} />
                        :
                        <SkipBtn onClick={handleSkip} />
                  }

                </div>
                : role == 'defense' ?
                  <div className={`flex justify-center`}>
                    <BuzzBtn onClick={handleBuzz} />
                  </div>
                  :
                  <div>

                  </div>
            }


          </div>

          {/* This is the speaker box */}
          <div className=' flex flex-col-reverse sm:flex-col justify-between h-full w-full row-start-1 col-span-2'>
            <div className={`bg-white rounded-lg flex flex-col justify-normal h-[180px] sm:h-[48%]  ${(!speakerBoxClicked && role == 'speaker') && 'glow-effect'} ${(role == 'speaker') && 'h-[180px]'}`}>
              <div className='pt-4 pb-2 ps-4 text-[12px] sm:text-[20px]'>
                Speaker Box
              </div>
              <hr className='bg-black mx-3' />

              {/* Text from the Speaker goes here */}
              {

                <div className={`text-[12px] sm:text-[20px] h-full`}>
                  {
                    role == 'speaker' ?
                      < textarea ref={inputRefSpeakerBox} onChange={handleOnChange} style={{ resize: 'none' }} placeholder='Start Typing Description Here...' className={`border-0 w-[100%] h-full px-5 text-[12px] sm:text-[20px] rounded-b-lg`} onClick={() => setSpeakerBoxClicked(true)} />
                      :
                      < textarea readOnly disabled style={{ resize: 'none' }} className={`border-0 w-[100%] h-full px-5 text-[12px] sm:text-[20px] rounded-b-lg`} value={description} />
                    // {/* <div className={`border-0 w-[100%] h-full px-5 text-[20px] rounded-b-lg break-all whitespace-pre-line`}>{description}</div> */}


                  }

                </div>
              }
            </div>
            <div className=' bg-dblue rounded-lg flex items-center h-[100px] sm:h-[48%] sm:h-max-[300px] overflow-y-scroll'>
              <div className=' bg-white w-full flex flex-col h-[90%]'>
                <div className=' flex justify-center text-[12px] sm:text-[20px]'>Round {round}/{selectedRounds} </div>
                <div className=' flex justify-between'>
                  <div className=' w-full text-center text-[12px] sm:text-[18px]'>
                    <div className=' underline border-b-2 border-gray-50'>Team 1</div>
                    {
                      team1members.map(player => {
                        return (
                          <div key={player.name} className='border-b-2 border-r-2 border-l-2 border-gray-50 grid grid-cols-3 items-center'>
                            <div className='  col-start-2 items-center'><div>{player.name}</div></div>
                            {
                              player.role == "speaker" ?
                                <div className=" w-4 sm:w-8"><UserSound size={32} /></div>
                                : player.role == "guesser" ?
                                  <div className=" w-4 sm:w-8"><QuestionMark size={32} /></div>
                                  : <div className=" w-4 sm:w-8"><Shield size={32} color="#fa0505" weight="duotone" /></div>
                            }

                          </div>

                        )
                      })
                    }
                  </div>
                  <div className=' w-full text-center text-[12px] sm:text-[18px]'>
                    <div className=' underline border-b-2 border-gray-50'>Team 2</div>
                    {
                      team2members.map(player => {
                        return (
                          <div key={player.name} className='border-b-2 border-r-2 border-gray-50 grid grid-cols-3 items-center'>
                            <div className='  col-start-2 items-center'><div>{player.name}</div></div>
                            {
                              player.role == "speaker" ?
                                <div className=" w-4 sm:w-8"><UserSound size={32} /></div>
                                : player.role == "guesser" ?
                                  <div className=" w-4 sm:w-8"><QuestionMark size={32} /></div>
                                  : <div className=" w-4 sm:w-8"><Shield size={32} color="#fa0505" weight="duotone" /></div>
                            }

                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
  else if (gamePhase == "scoreBoard" || gamePhase == "finalScoreBoard") {
    return (
      <div className=' flex flex-col items-center justify-center space-y-3 sm:space-y-5 px-4'>
        <div className='text-center text-dblue text-[25px] sm:text-[50px] font-LuckiestGuy tracking-widest'>
          <p>Times Up!!!</p>
          <p className=''>Turn results</p>
        </div>
        <ScoreTable
          skipWords={skipWords}
          buzzWords={buzzWords}
          onePointWords={onePointWords}
          threePointWords={threePointWords}
        />
        <NextBtn onClick={handleNextTurn} />
      </div>
    )
  }
  else if (gamePhase == "intermission") {
    return (
      <div className='flex flex-col justify-center h-screen items-center'>
        <div className=' text-center text-dblue text-[50px] font-LuckiestGuy tracking-widest'>Waiting on other players...</div>
        <div className=' text-center text-dblue text-[50px] font-LuckiestGuy tracking-widest'>{"(" + numbOfPlayersReady + "/" + totalNumberOfPlayers + ")"}</div>
      </div>
    )
  }
  else if (gamePhase == "endOfGame") {
    return (
      <div className='font-LuckiestGuy tracking-widest px-4 h-screen flex flex-col justify-center items-center space-y-5'>
        <div className='text-center pt-4 text-[25px] sm:text-[50px] text-dblue flex flex-col'>
          {isWinning == 0 ? <div> It's A Tie</div>: isWinning == 1 ? <div> You Win !!!</div> : <div> You Lose !!!</div> }
          <p>Final Score</p>
        </div>
        <div className=' w-full'>

          <div className='flex justify-center'>
            <div className='flex justify-center bg-white border-[1px] border-black text-[20px] sm:text-[48px] sm:w-[60%] w-full'>
              <div className='py-4 sm:py-10 w-[100%] px-4 sm:px-16 '>
                <div className='text-center whitespace-nowrap'>
                  Team 1: &nbsp;&nbsp; {teamAScore}
                </div>
              </div>
            </div>
          </div>

          <div className='flex justify-center'>
            <div className='flex justify-center bg-white border-[1px] border-black text-[20px] sm:text-[48px] sm:w-[60%] w-full'>
              <div className='py-4 sm:py-10 w-[100%] px-4 sm:px-16 '>
                <div className='text-center whitespace-nowrap'>
                Team 2: &nbsp;&nbsp; {teamBScore}
                </div>
              </div>
            </div>
          </div>

          {/* <div className={`pt-10 ${showText ? 'block' : 'hidden'}`}>
            <p className='text-center text-green text-[25px]'>
              Taking you back for another game...
            </p>
          </div> */}

          {/* push to whatever page is next */}

        </div>
        <div onClick={handlePlayAgain} className='flex justify-center pt-4 cursor-pointer'>
          <PlayAgainBtn />
        </div>
      </div>
    )
  }
  else {
    return (
      <div>Ummmm... Something went wrong</div>
    )
  }

}

export default page
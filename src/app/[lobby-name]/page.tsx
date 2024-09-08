'use client'

import BuzzBtn from '@/components/BuzzBtn'
import Card from '@/components/Card'
import DiceBtn from '@/components/DiceBtn'
import NavBar from '@/components/NavBar'
import OnePointBtn from '@/components/OnePointBtn'
import OnlineTeamName from '@/components/OnlineTeamName'
import ShuffleBtn from '@/components/Shufflebtn'
import SkipBtn from '@/components/SkipBtn'
import StartBtn from '@/components/StartBtn'
import StatusBar from '@/components/StatusBar'
import ThreePointBtn from '@/components/ThreePointBtn'
import { changeNumberOfRounds, changeTimeLimit, getGamebyRoomName, getHostByRoom, getNumOfRoundsByRoom, getTeamMembersByRoom, getTimeLimitByRoom, removePlayer, setReadyStatus, shuffleTeams, toggleTeamFetch } from '@/utils/dataServices'
import { RefreshRounds, RefreshTeams, RefreshTime, sendMessage } from '@/utils/hubServices'
import { ITeamsInfo, members } from '@/utils/interefaces'
import { checkPlayersReadiness, extractTeam1members, extractTeam2members, renderOptions } from '@/utils/utilities'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = ({ params }: { params: { 'lobby-name': string } }) => {

  const url = 'http://localhost:5051/Game';
  const username = sessionStorage.getItem("Username");
  const isHost = sessionStorage.getItem("isHost");
  const lobby = params['lobby-name'];
  const router = useRouter();
  const maxRounds: number = 10;
  const maxMinutes: number = 5;
  const maxSeconds: number = 59;

  const [gamePhase, setGamePhase] = useState<string>("game")

  //lobby UseStates

  const [conn, setConnection] = useState<HubConnection>()
  const [isReady, setIsReady] = useState<boolean>(false);
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

  const [round, setRound] = useState<number>(0);
  const [roundTotal, setRoundTotal] = useState<number>(0);
  const [role, setRole] = useState<string>('');
  const [onePointWord, setOnePointWord] = useState<string>('');
  const [threePointWord, setThreePointWord] = useState<string>('');
  const [speaker, setSpeaker] = useState<string>('');

  const [onePointWordHasBeenSaid, setOnePointWordHasBeenSaid] = useState<boolean>();
  const [threePointWordHasBeenSaid, setThreePointWordHasBeenSaid] = useState<boolean>();

  const [buzzWords, setBuzzWords] = useState<string>('')
  const [onePointWords, setOnePointWords] = useState<string>('')
  const [threePointWords, setThreePointWords] = useState<string>('')
  const [skipWords, setSkipWords] = useState<string>('')

  const [guess, setGuess] = useState<string>('')
  const [guesses, setGuesses] = useState<{ username: string; msg: string; color: string }[]>([]);
  const [description, setDescription] = useState<string>('');

  //router push

  const redirectToHomeWithRoom = () => {
    router.push(`/?room=${lobby}`);
  };

  // UseEffects

  useEffect(() => {
    const getGameInfo = async () => {
      joinRoom();
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
    const changeBackEndStatus = async () => {
      let msg = username && await setReadyStatus({ userName: username, roomName: lobby, isReady: isReady });
      console.log(msg);
      conn && username && RefreshTeams(conn, username, lobby, isReady ? "*is ready*" : "*is not ready*");
    }

    changeBackEndStatus();
  }, [isReady])


  // Handle Functions Lobby Room 
  const handleRemove = async (playerName: string) => {
    let msg = await removePlayer({ playerName: playerName, roomName: lobby });
    console.log(msg)
    conn && username && RefreshTeams(conn, "admin", lobby, `removed ${playerName}`);
  }

  const handleShuffle = async () => {
    let msg = username && await shuffleTeams({ userName: username, roomName: lobby });
    console.log(msg);
    conn && username && RefreshTeams(conn, username, lobby, "shuffled");
  }

  const handleToggleTeam = async () => {

    let msg = username && await toggleTeamFetch({ userName: username, roomName: lobby });
    console.log(msg);
    conn && username && RefreshTeams(conn, username, lobby, "swapped teams");
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

  // const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   // if (event.key === 'Enter') {
  //   //   if (guess !== '') {
  //   //     SubmitGuess(onePointWord, threePointWord, guess);
  //   //     setGuess('');
  //   //   } else {

  //   //   }
  //   // }
  // };

  const TypeDescription = async (description: string) => {
    // try {
    //   conn && await conn.invoke("TypeDescription", description);
    // } catch (e) {
    //   console.log(e)
    // }
  }

  const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // if (description != event.target.value) {
    //   TypeDescription(event.target.value)
    // } else {
    //   TypeDescription(event.target.value)
    // }
  }

  const handleSkip = async () => {
    // await AppendSkipPointWords(lobbyRoomName, onePointWord, threePointWord)
    // await getNewCard(userData.username, lobbyRoomName)
  }
  const handleBuzz = async () => {
    // Buzz();
    // await AppendBuzzWords(lobbyRoomName, onePointWord, threePointWord)
    // await getNewCard(userData.username, lobbyRoomName)
  }
  const handleOnePoint = async () => {
    // await AppendOnePointWords(lobbyRoomName, onePointWord, threePointWord)
    // await getNewCard(userData.username, lobbyRoomName)
  }
  const handleThreePoint = async () => {
    // await AppendThreePointWords(lobbyRoomName, onePointWord, threePointWord)
    // await getNewCard(userData.username, lobbyRoomName)
  }

  const handlePlayAgain = () => {

    // router.push('/pages/lobbyRoom')
  }


  // SignalR functions (what we want the pages to do on signalR commands)
  const refreshTeams = async () => {
    let teamInfo = await getTeamMembersByRoom(lobby);
    setTeam1members(extractTeam1members(teamInfo));
    setTeam2members(extractTeam2members(teamInfo));
    let host = await getHostByRoom(lobby);

    if (username == host) {
      console.log("I am the host")
      console.log(checkPlayersReadiness(teamInfo))
      setIsReady(checkPlayersReadiness(teamInfo))
    }
  }

  const refreshTime = async () => {
    let timeLimit = await getTimeLimitByRoom(lobby)
    console.log(timeLimit)
    setSelectedMinutes(Math.floor(timeLimit / 60));
    setSelectedSeconds(timeLimit % 60);
  }

  const refreshRounds = async () => {
    let numOfRounds = await getNumOfRoundsByRoom(lobby)
    setSelectedRounds(numOfRounds);
  }


  // Join Room ( Initialize SignalR connection )
  const joinRoom = async () => {
    console.log("We are joing room")
    try {
      const conn = new HubConnectionBuilder()
        .withUrl(url)
        .configureLogging(LogLevel.Information)
        .build();

      conn.on("JoinSpecificGame", (username: string, msg: string, json: string) => { // Specify the types for parameters

        setMessages(messages => [...messages, { username, msg }])
        refreshTeams();
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

      conn.on("RefreshRounds", (username: string, msg: string) => {
        refreshRounds();
        setMessages(messages => [...messages, { username, msg }])
      })

      await conn.start();
      await conn.invoke("JoinSpecificGame", { Username: username, RoomName: lobby });

      setConnection(conn);
      console.log('success')
    } catch (e) {
      console.log(e);
    }
  }

  if (gamePhase == "lobby") {
    return (
      <div className=' flex flex-col justify-between h-screen items-center'>

        <div className='relative w-full'>
          <NavBar title={"Room ID: " + params['lobby-name']} />
        </div>

        {/* Body */}


        <div className='md:flex flex-row justify-between'>

          <OnlineTeamName teamName={"Team 1"} host={theHost} members={team1members} handleRemove={handleRemove} />

          <div className='lg:block hidden flex-col items-center space-y-5'>
            <button onClick={handleToggleTeam} className='w-[230px] h-[50px] bg-dblue hover:bg-hblue active:text-dblue font-LuckiestGuy text-white text-center tracking-wider flex justify-center items-center rounded-md border border-black'>
              Toggle Team
            </button>
            <div className='flex justify-center'>
              <DiceBtn onClick={handleShuffle} />
            </div>
            <div className='flex justify-center' onClick={handleStartClick}>
              <StartBtn isReady={isReady} isHost={isHost == 'true'} onClick={() => { }} />
            </div>
          </div>

          <OnlineTeamName teamName={"Team 2"} host={theHost} members={team2members} handleRemove={handleRemove} />
        </div>

        <div className='lg:hidden flex justify-center gap-4'>
          <button className='w-[180px] h-[50px] bg-dblue lg:mt-5 mt-0 font-LuckiestGuy flex justify-center'>
            <p className=' text-white text-center tracking-wider flex items-center'>Toggle Team</p>
          </button>
          <ShuffleBtn onClick={() => { }} />
        </div>

        <div className=' flex flex-col items-center space-y-4'>
          <div className='lg:flex flex-row justify-between whitespace-nowrap items-center lg:w-[400px] w-[100%]'>
            <div className=' font-LuckiestGuy text-dblue text-3xl lg:text-start text-center'>Number of Rounds:</div>
            <div className='flex lg:justify-end justify-center'>
              {
                (isHost == 'true') ?
                  <select value={selectedRounds} onChange={(e) => handleChangeRounds(e)} className=' h-10  rounded-md' name='Rounds' id='Rounds'>
                    {renderOptions(1, maxRounds, false)}
                  </select>
                  :
                  <div className=' text-dblue font-LuckiestGuy text-3xl'>{selectedRounds} </div>
              }
            </div>
          </div>
          <div className='lg:flex flex-row justify-between whitespace-nowrap items-center lg:w-[400px] w-[300px]'>
            <div className=' font-LuckiestGuy text-dblue text-3xl lg:text-start text-center'>Time Limit:</div>
            <div className='lg:w-[30%] w-[100%] flex lg:justify-end justify-center space-x-3' >
              {
                (isHost == 'true') ?
                  <select className='h-10 rounded-md' value={selectedMinutes} onChange={(e) => handleChangeTimeLimitMinutes(e)}>
                    {renderOptions(0, maxMinutes, false)}
                  </select>
                  :
                  <div className=' text-dblue font-LuckiestGuy text-3xl'>{selectedMinutes}</div>
              }
              <div className=' text-dblue font-LuckiestGuy text-3xl'>:</div>
              {
                (isHost == 'true') ?
                  <select className='h-10 rounded-md' value={selectedSeconds} onChange={(e) => handleChangeTimeLimitSeconds(e)}>
                    {renderOptions(0, maxSeconds, true)}
                  </select>
                  :
                  <div className=' text-dblue font-LuckiestGuy text-3xl'>{selectedSeconds}</div>
              }
            </div>
          </div>
          <p className=' text-dred'>{warningText}</p>
          <div className='flex flex-row justify-between whitespace-nowrap items-center lg:w-[400px] w-[300px]'>
            {/* <div className=' font-LuckiestGuy text-dblue text-3xl mr-5'>ScoreKeeper</div>
                <select name="" id=""></select> */}
          </div>
        </div>

        <div className='lg:hidden flex justify-center' onClick={handleStartClick}>
          <StartBtn isReady={isReady} isHost={isHost == 'true'} onClick={() => { }} />
        </div>

        <div className='w-[88%] h-[224px] bg-lgray border-[#52576F] border-[20px] md:p-4 p-2 '>
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
  else {
    return (
      <div className='h-[90.75%]'>
        <div className='p-5 pt-10'>
          {Object.keys(gameInfo).length > 0 && (
            <StatusBar
              time={0}
              teamName=''
              user={username}
              roundNumber={round}
              roundTotal={roundTotal}
              role={role}
              OnePointWord={onePointWordHasBeenSaid ? onePointWord : '???'}
              ThreePointWord={threePointWordHasBeenSaid ? threePointWord : '???'}
              // OnePointWord={""}
              // ThreePointWord={""}
              Speaker={speaker}
            />
          )}
        </div>
        <div className='grid md:grid-cols-3 gap-5 px-5 pb-5 '>

          {/* This is the Guesser box */}
          <div className='bg-white rounded-lg flex flex-col justify-between'>

            {/* Text from the guessers goes here */}
            <div className='pt-4 pb-2 ps-4 text-[20px] h-full'>
              <p>Guesser Box</p>
              <hr className='bg-black me-3' />
              <div className=' text-green font-bold'></div>
              <div className=' text-yellow font-bold'></div>
              <div className=' text-purple font-bold'></div>
              {
                guesses.map((guess, ix) => {
                  return (
                    <p key={ix} className={'overflow-auto font-Roboto' + guess.color}> <span className=' font-RobotoBold'>{guess.username}</span> {" - "} <span className={'text-' + guess.color}>{guess.msg}</span> </p>
                  )
                })

              }
            </div>

            {
              role == 'Guesser' &&
              <div className={` h-[50px] mb-2 w-full px-2`}>
                <input onChange={(e) => { setGuess(e.target.value) }} onKeyDown={handleKeyDown} value={guess} type="text" placeholder='Type Your Guesses Here...' className='rounded-md w-full text-[20px]' />
              </div>
            }

          </div>

          {/* This is the Card box */}
          <div>
            <div className='flex justify-center'>
              <Card top={onePointWord} bottom={threePointWord} isGuessing={role == 'Guesser'} />
            </div>
            {
              role == 'Speaker' ?
                <div className={`flex justify-center py-5`}>
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
                : role == 'Defense' ?
                  <div className={`flex justify-center py-5`}>
                    <BuzzBtn onClick={() => { setBuzzed(true); setOpenBuzzModal(true); handleBuzz() }} />
                  </div>
                  :
                  <div className=' my-5 h-[75px]'>

                  </div>
            }


          </div>

          {/* This is the speaker box */}
          <div className='bg-white rounded-lg flex flex-col justify-normal'>
            <div className='pt-4 pb-2 ps-4 text-[20px]'>
              Speaker Box
            </div>
            <hr className='bg-black mx-3' />

            {/* Text from the Speaker goes here */}
            {

              <div className='text-[20px] h-full'>
                {
                  role == 'Speaker' ?
                    < textarea value={description} onChange={handleOnChange} style={{ resize: 'none' }} placeholder='Start Typing Description Here...' className={`border-0 w-[100%] h-full px-5 text-[20px] rounded-b-lg`} />
                    :

                    <div className={` overflow-auto border-0 w-[100%] h-[573px] px-5 text-[20px] rounded-b-lg break-all whitespace-pre-line`}>{description}</div>
                }

              </div>
            }
          </div>

        </div>
      </div>
    )
  }

}

export default page
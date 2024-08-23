'use client'

import DiceBtn from '@/components/DiceBtn'
import NavBar from '@/components/NavBar'
import OnlineTeamName from '@/components/OnlineTeamName'
import ShuffleBtn from '@/components/Shufflebtn'
import StartBtn from '@/components/StartBtn'
import { renderOptions } from '@/utils/utilities'
import { HubConnection } from '@microsoft/signalr'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface ITeamInfo {
  teamName: string;
  host: string;
  members: {
    name: string
    readyStatus: boolean
  }[];
}

const page = ({ params }: { params: { 'lobby-name': string } }) => {

  const username = sessionStorage.getItem("Username");
  const isHost = sessionStorage.getItem("isHost");
  const lobby = params['lobby-name'];
  const router = useRouter();
  
  const redirectToHomeWithRoom = () => {
    router.push(`/?room=${lobby}`);
  };

  useEffect(()=>{
    if(sessionStorage.getItem("Username") == null){
      redirectToHomeWithRoom();      
    }
  },[])

  const maxRounds: number = 10;
  const maxMinutes: number = 5;
  const maxSeconds: number = 59;

  const [host, setHost] = useState<string>('')

  const [conn, setConnection] = useState<HubConnection>()
  const [isReady, setIsReady] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<{ username: string; msg: string; }[]>([]);

  const [Team1Info, setTeam1Info] = useState<ITeamInfo>({} as ITeamInfo);

  const [Team2Info, setTeam2Info] = useState<ITeamInfo>({} as ITeamInfo);

  const [selectedRounds, setSelectedRounds] = useState('1');
  const [selectedMinutes, setSelectedMinutes] = useState('1');
  const [selectedSeconds, setSelectedSeconds] = useState('30');

  const [warningText, setWarningText] = useState(' ');
  const [isTimeOk, setIsTimeOk] = useState(true);

  const handleRemove = async (playerName: string) => {
    // removePlayer(playerName, lobbyRoomName);
  }

  const handleShuffle = async () => {
    // shuffleTeams(userData.username, lobbyRoomName)
  }

  const handleToggleTeam = async () => {
    // await toggleTeam(userData.username, lobbyRoomName);
  }


  const handleChangeRounds = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRounds(e.target.value)
    // changeRounds(userData.username, lobbyRoomName, e.target.value)
  }

  const handleChangeTimeLimitMinutes = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMinutes(e.target.value)
    // const time = parseInt(e.target.value) * 60 + parseInt(selectedSeconds);
    // if(time < 30)
    //   {
    //     setWarningText("Time Must at least be 30 seconds")
    //     setIsTimeOk(false);
    //   }else{
    //     setWarningText(" ")
    //     setIsTimeOk(true);
    //   }
    // changeTimeLimit(userData.username, lobbyRoomName, time.toString())
  }

  const handleChangeTimeLimitSeconds = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeconds(e.target.value)
    // const time = parseInt(selectedMinutes) * 60 + parseInt(e.target.value);
    // if(time < 30)
    //   {
    //     setWarningText("Time Must at least be 30 seconds")
    //     setIsTimeOk(false);
    //   }else{
    //     setWarningText(" ")
    //     setIsTimeOk(true);
    //   }
    // changeTimeLimit(userData.username, lobbyRoomName, time.toString())
  }

  const handleStartClick = async () => {
    // if (userData.username != host) {
    //   // console.log("This guy is not the host")
    //   setIsReady(!isReady)
    //   toggleReadiness(userData.username, lobbyRoomName);
    // } else {
    //   if (isAllReady && isTimeOk) {
    //     let res = await checkIfGameExists(lobbyRoomName)
    //     if(res){
    //       await DeleteGame(lobbyRoomName);
    //       startGame(userData.username, lobbyRoomName);  
    //     }else{
    //     startGame(userData.username, lobbyRoomName);          
    //     }
    //   } else {
    //     console.log("Not all players are ready")
    //   }
    //   // console.log("This guy is our host!")
    // }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // if (event.key === 'Enter') {

    //   // Check if user input something if so send otherwise nothing
    //   if (message !== '') {
    //     sendMessage(message);
    //     setMessage('');
    //   } else {

    //   }
    // }
  };

  return (
    <div className=' flex flex-col justify-between h-screen items-center'>

      <div className='relative w-full'>
        <NavBar title={"Room ID: " + params['lobby-name']} />
      </div>

      {/* Body */}


      <div className='md:flex flex-row justify-between'>

        <OnlineTeamName teamName={Team1Info.teamName} host={Team1Info.host} members={Team1Info.members} handleRemove={handleRemove} />

        <div className='lg:block hidden flex-col items-center space-y-5'>
          <button onClick={handleToggleTeam} className='w-[230px] h-[50px] bg-dblue hover:bg-hblue active:text-dblue font-LuckiestGuy text-white text-center tracking-wider flex justify-center items-center rounded-md border border-black'>
            Toggle Team
          </button>
          <div className='flex justify-center'>
            <DiceBtn onClick={handleShuffle} />
          </div>
          <div className='flex justify-center' onClick={handleStartClick}>
            <StartBtn isReady={isReady} isHost={isHost=='true'} onClick={() => { }} />
          </div>
        </div>

        <OnlineTeamName teamName={Team2Info.teamName} host={Team2Info.host} members={Team2Info.members} handleRemove={handleRemove} />
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
        <StartBtn isReady={isReady} isHost={isHost=='true'} onClick={() => { }} />
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

export default page
'use client'
import GoHomeBtn from "@/components/GoHomeBtn";
import { checkIfNameExistsInGame, checkIfRoomExists, createRoom, joinRoom } from "@/utils/dataServices";
import { removeSpaces } from "@/utils/utilities";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Info from '../assets/Info.png'

export default function Home({ searchParams }: { searchParams: { room?: string } }) {

  const room = searchParams.room;;

  const [name, setName] = useState('')
  const [roomName, setRoomName] = useState('')
  const [warnText, setWarnText] = useState('')
  const [successColor, setSuccessColor] = useState<boolean>(false)
  const [disableBtn, setDisableBtn] = useState(false)
  const [createRoomWaiting, setCreateRoomWaiting] = useState<boolean>(false);
  const [joinRoomWaiting, setJoinRoomWaiting] = useState<boolean>(false);
  const router = useRouter()
  

  const handleInfoButton = () => {
    router.push('/rules');
  }

  useEffect(() => {
    if (room) {
      setRoomName(room);
      // Perform any additional setup or data fetching based on the lobby name
    }
  }, [room]);

  const handleClickName = (nameInput: string) => {
    if (nameInput == '') {

    } else {
      setName(nameInput)
    }
  }

  const handleOnClickJoin = async (LobbyName: string, userName: string) => {
    if (!disableBtn) {
      setDisableBtn(true)
      if (userName === '') {
        setWarnText('Please enter in your name.')
        setSuccessColor(false)
      }
      else if (LobbyName === '') {
        setWarnText('Please enter a room name.')
        setSuccessColor(false)
      }
      else if (!await checkIfRoomExists(LobbyName)) {
        setWarnText('This room does not exist.')
        setSuccessColor(false)
      }
      else if (sessionStorage.getItem("BannedRoom") == LobbyName) {
        setWarnText('You cannot go into this room')
        setSuccessColor(false)
      }
      else if (await checkIfNameExistsInGame(LobbyName, userName)) {
        setWarnText('The name you chose is already taken in this room.')
        setSuccessColor(false)
      } else {
        setJoinRoomWaiting(true);
        sessionStorage.setItem("Username", userName)
        sessionStorage.setItem("isHost", 'false')
        let msg = await joinRoom({ userName: userName, roomName: LobbyName });
        console.log(msg);
        router.push(`/${LobbyName}`);
      }
      setDisableBtn(false);
    }

  };

  const handleOnClickCreate = async (LobbyName: string, userName: string) => {
    if (!disableBtn) {
      setDisableBtn(true);
      if (userName === '') {
        setWarnText('Please enter in your name.')
        setSuccessColor(false)
      }
      else if (LobbyName === '') {
        setWarnText('Please enter a room name.')
        setSuccessColor(false)
      }
      else if (LobbyName === 'rules'){
        setWarnText('Sorry you cannot use that lobby name');
        setSuccessColor(false)
      }
      else if (await checkIfRoomExists(LobbyName)) {
        setWarnText('Room name is already taken.')
        setSuccessColor(false)
      }
      else {
        setCreateRoomWaiting(true);
        sessionStorage.setItem("Username", userName)
        sessionStorage.setItem("isHost", 'true')
        let msg = await createRoom({ userName: userName, roomName: LobbyName })
        console.log(msg);
        router.push(`/${LobbyName}`);
      }
      setDisableBtn(false);
    }

  };


  useEffect(() => {
    setWarnText('');
  }, [roomName, name])

  if (joinRoomWaiting) {
    return (
      <div className='h-screen flex flex-col justify-center align-middle mx-4 md:mx-16 space-y-10 '>
        <div className='flex justify-center'>
          <p className='text-dblue font-LuckiestGuy text-[48px] tracking-widest text-center cursor-default'>Waiting to Join...</p>
        </div>
      </div>
    )
  } else if (createRoomWaiting) {
    return (
      <div className='h-screen flex flex-col justify-center align-middle mx-4 md:mx-16 space-y-10 '>
        <div className='flex justify-center'>
          <p className='text-dblue font-LuckiestGuy text-[48px] tracking-widest text-center cursor-default'>Creating Room...</p>
        </div>
      </div>
    )
  } else {
    return (
      <div className='h-screen flex flex-col justify-center align-middle mx-4 md:mx-16 space-y-6 '>
        <div className='flex justify-center items-center flex-col sm:space-y-[-15px]'>
          <p className='text-dblue font-LuckiestGuy text-[30px] sm:text-[48px] tracking-widest text-center cursor-default'>ShorTalk</p>
          <p className='flex justify-center font-Roboto text-[12px] sm:text-[24px] text-center tracking-widest text-dgray cursor-default'>
              version 2.0
            </p>
        </div>

        <div className='flex justify-center'>

          <div className='cardBorder bg-white w-[500px] sm:h-[410px] rounded-lg flex flex-col justify-center space-y-3 pt-[24px] relative'>
            <p className='flex justify-center font-LuckiestGuy text-[22px] sm:text-[32px] text-center tracking-widest text-dgray cursor-default'>
              Join or Create a Room!
            </p>
            <div className='flex flex-col space-y-5 items-center'>
              <input
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder='Your Name'
                className='w-[75%] h-10 border border-black px-2 rounded text-center'
              />
              <input
                onChange={(e) => setRoomName(e.target.value)}
                type="text"
                placeholder='Room Name'
                className='w-[75%] h-10 border border-black px-2 rounded text-center'
                value={roomName}
              />
            </div>
            <div className='flex flex-col  justify-center items-center space-y-5'>

              {/* On click create room */}
              <button onClick={() => handleOnClickJoin(removeSpaces(roomName), name)} className='font-LuckiestGuy text-white active:text-dblue bg-dblue hover:bg-hblue w-[50%] h-[50px] p-0 m-0 rounded-md'>
                <p className='sm:text-[36px] text-[24px] tracking-widest'>
                  JOIN
                </p>
              </button>
              <button onClick={() => handleOnClickCreate(removeSpaces(roomName), name)} className='font-LuckiestGuy text-white active:text-dblue bg-dblue hover:bg-hblue w-[50%] h-[50px] p-0 m-0 rounded-md'>
                <p className='sm:text-[36px] text-[24px] tracking-widest'>
                  CREATE
                </p>
              </button>

            </div>
            <div className='text-center p-0 cursor-default h-[24px]'>
              <p className={`${successColor ? 'text-green' : 'text-red-500'}`}>
                {warnText}
              </p>
            </div>

            <div className=" absolute bottom-1 right-2 whitespace-nowrap text-dblue font-Roboto flex cursor-pointer" onClick={handleInfoButton}>
              <div className=" relative top-[2px] mr-2">RULES</div> <Image src={Info}  alt='info icon' width={25} height={25}></Image>
            </div>

          </div>

        </div>
      </div>
    )
  }


}

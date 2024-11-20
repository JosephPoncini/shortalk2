'use client'


import React, { useEffect, useState } from 'react'

interface IStartButton {
  isLobbyReady: boolean
  isHost: boolean
  onClick: ()=>void
}

const StartBtn = (props: IStartButton) => {

  const classNameBase = '';


 
  // const [className, setClassName] = useState<string>(classNameBase);



  // useEffect(() => {

  //     if (props.isLobbyReady) {
  //       setClassName(classNameBase + '  cursor-pointer ')
  //     } else {
  //       setClassName(classNameBase + ' opacity border-2 border-black ')
  //     }
  // }, [props.isLobbyReady])


  return (
    <div onClick={props.onClick} className={`font-LuckiestGuy text-[20px] sm:text-[30px] text-white rounded-lg sm:rounded-2xl w-[150px] h-[50px] sm:w-[200px] sm:h-[100px] flex justify-center items-center px-4 bg-dblue border-2 border-black ${ props.isLobbyReady ? 'cursor-pointer hover:bg-hblue active:text-dblue':'cursor-default opacity-[.5]'}`}>
      <div className='bg-lblue bg-lgray bg-dblue'></div>
      Start
    </div>
  )
}

export default StartBtn
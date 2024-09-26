'use client'


import React, { useEffect, useState } from 'react'

interface IStartButton {
  isLobbyReady: boolean
  isHost: boolean
  onClick: ()=>void
}

const StartBtn = (props: IStartButton) => {

  const classNameBase = ' rounded-2xl w-[200px] h-[100px] flex justify-center items-center px-4 ';


 
  const [className, setClassName] = useState<string>(classNameBase);



  useEffect(() => {

      if (props.isLobbyReady) {
        setClassName(classNameBase + ' bg-dblue hover:bg-hblue active:text-dblue border-2 border-black cursor-pointer ')
      } else {
        setClassName(classNameBase + ' bg-lgray border-2 border-black ')
      }
  }, [props.isLobbyReady])


  return (
    <div onClick={props.onClick} className={className + 'font-LuckiestGuy text-[30px]  text-white border cursor-pointer'}>
      <div className='bg-lblue bg-lgray bg-dblue'></div>
      Start
    </div>
  )
}

export default StartBtn
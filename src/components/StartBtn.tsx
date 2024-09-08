'use client'


import React, { useEffect, useState } from 'react'

interface IStartButton {
  isReady: boolean
  isHost: boolean
  onClick: ()=>void
}

const StartBtn = (props: IStartButton) => {

  const classNameBase = ' rounded-2xl w-[200px] h-[100px] flex justify-center items-center px-4 ';


  const [btnText, setBtnText] = useState<string>('')
  const [className, setClassName] = useState<string>(classNameBase);



  useEffect(() => {
    if (props.isHost) {
      setBtnText('Start');
      if (props.isReady) {
        setClassName(classNameBase + ' bg-dblue hover:bg-hblue active:text-dblue border-2 border-black cursor-pointer ')
      } else {
        setClassName(classNameBase + ' bg-lgray border border-black ')
      }
    } else {
      if (props.isReady) {
        setClassName(classNameBase + ' bg-dred cursor-pointer ')
        setBtnText('Not Ready');
      } else {
        setClassName(classNameBase + ' bg-dblue hover:bg-hblue active:text-dblue border-2 border-black cursor-pointer ')
        setBtnText('Ready');
      }
    }
  }, [props.isHost, props.isReady])


  return (
    <div className={className + 'font-LuckiestGuy text-[30px]  text-white border cursor-pointer'}>
      <div className='bg-lblue bg-lgray bg-dblue'></div>
      {btnText}
    </div>
  )
}

export default StartBtn
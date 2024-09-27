'use client'

import { getStartTime } from '@/utils/dataServices'
import React, { useEffect, useState } from 'react'
// import Timer from './Timer'

interface IStatusBar {
  timeLimit: number
  lobby: string
  teamName: string | null
  roundNumber: number | null
  roundTotal: number | null
  role: string | null
  OnePointWord: string | null
  ThreePointWord: string | null
  Speaker: string | null
  user: string | null
  onTimeOut: () => void
}

const StatusBar = (props: IStatusBar) => {

  const [startTime, setStartTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(props.timeLimit);


  const getSecondsSinceEpoch = (): number => {
    const currentTimeUTC = Date.now(); // Current time in UTC milliseconds
    const secondsSinceEpoch = currentTimeUTC / 1000; // Convert milliseconds to seconds
    return Math.floor(secondsSinceEpoch);
  };

  useEffect(()=>{
    const startRound = async () => {
      const time = await getStartTime(props.lobby)
      setStartTime(time);
    }

    startRound();

  },[])

  useEffect(()=>{

    const intervalId = setInterval(() => {
      const now = getSecondsSinceEpoch(); // Get time in seconds since epoch
      let time = props.timeLimit - (now - startTime)
      console.log("TimeLime " + props.timeLimit)
      console.log("now " + now);
      console.log("startTime " + startTime);
      console.log("time " + time)
      if(time < 0){
        setCurrentTime(0);
        // props.onTimeOut();  
      }else
      {
        setCurrentTime(time);        
      }

    }, 1000); // Update every second

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  },[startTime])



  return (
    <div className=' bg-status rounded-[20px] lg:px-10 px-5 py-[10px] font-Roboto text-textGray w-full h-[75px] flex justify-between items-center text-2xl cursor-default'>
        {<div>{currentTime}</div>}
        {props.teamName && <div className=''>{"Team: " + props.teamName}</div>}
        {props.user && <div className=' hidden md:block'>{"Player: " + props.user}</div>}        
        {props.Speaker && <div className=' '>{"Speaker: " + props.Speaker}</div>}
        {props.roundNumber && <div className=' hidden md:block'>{"Round: " +props.roundNumber + " of " + props.roundTotal}</div>}
        {props.role && <div className=' hidden md:block'>{"Role: " + props.role}</div>}
        {props.OnePointWord && <div className=' hidden lg:blockhidden lg:block'>{"1-Point-Word: " + props.OnePointWord}</div>}
        {props.ThreePointWord && <div className=' hidden lg:block'>{ "3-Point-Word: " + props.ThreePointWord}</div>}
    </div>
  )
}

export default StatusBar
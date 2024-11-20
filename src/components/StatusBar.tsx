'use client'

import { getScores, getStartTime } from '@/utils/dataServices'
import { IScoresDto } from '@/utils/interefaces'
import React, { useEffect, useState } from 'react'
// import Timer from './Timer'

interface IStatusBar {
  timeLimit: number
  lobby: string
  role: string | undefined
  user: string | null
  gettingScores: boolean
  setGettingScores: (gettingScores:boolean)=>void
  onTimeOut: () => void
}

const StatusBar = (props: IStatusBar) => {

  const [startTime, setStartTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(props.timeLimit);
  const [teamAScore, setTeamAScore] = useState<number>(0);
  const [teamBScore, setTeamBScore] = useState<number>(0);


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
      // console.log("TimeLime " + props.timeLimit)
      // console.log("now " + now);
      // console.log("startTime " + startTime);
      // console.log("time " + time)
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

  useEffect(()=>{
    const newCard = async () => {
      const scores:IScoresDto = await getScores(props.lobby)
      setTeamAScore(scores.teamAScore);
      setTeamBScore(scores.teamBScore);
      props.setGettingScores(false);
    }

    if(props.gettingScores){
      newCard();      
    }

  },[props.gettingScores])



  return (
    <div className=' bg-status rounded-[20px] lg:px-10 px-5 py-[10px] font-Roboto text-textGray w-full sm:h-[75px] flex justify-between items-center text-[14px] sm:text-2xl cursor-default'>
        {<div>{ currentTime}</div>}
        {props.user && <div className=' hidden md:block'>{"Player: " + props.user}</div>}        
        {props.role && <div className=' hidden md:block'>{"Role: " + props.role}</div>}
        <div>Team 1: {teamAScore} </div>
        <div>Team 2: {teamBScore} </div>
    </div>
  )
}

export default StatusBar
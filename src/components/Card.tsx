import React from 'react'
import Image from 'next/image'
import cardBack from '../assets/CardBack.png'

interface ICard {
  top: string
  bottom: string
}

const Card = (props: { top: string, bottom: string, isGuessing: boolean, isAnimated: boolean }) => {
  return (
    <div className={` ${props.isAnimated && 'barrelRoll'} w-[100px] h-[175px] sm:h-[400px] sm:w-[275px] flex flex-col justify-center rounded-xl border-2 border-black bg-dblue text-center py-2 sm:py-12 relative sm:top-10`}>
      {props.isGuessing ?
        <div className='w-full'>
          <Image src={cardBack} alt='the back of the card'/>
        </div>
        : 
        <div className=' sm:w-full h-full'>
          <div className=' sm:w-full h-1/2 font-Roboto text-[12px] sm:text-[38px] border-b-2 border-black bg-white flex justify-center items-center'>{props.top}</div>
          <div className=' sm:w-full h-1/2 font-Roboto text-[12px] sm:text-[38px] bg-white flex justify-center items-center'>{props.bottom}</div>
        </div>
      }
    </div>
  )
}

export default Card
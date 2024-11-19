import React from 'react'
import Image from 'next/image'
import cardBack from '../assets/CardBack.png'

interface ICard {
  top: string
  bottom: string
}

const Card = (props: { top: string, bottom: string, isGuessing: boolean, isAnimated: boolean }) => {
  return (
    <div className={` ${props.isAnimated && 'barrelRoll'} md:w-[350px] w-[275px] flex flex-col justify-center rounded-xl border-2 border-black bg-dblue text-center py-12`}>
      {props.isGuessing ?
        <div className='w-full'>
          <Image src={cardBack} alt='the back of the card'/>
        </div>
        : 
        <div className=' w-full h-full'>
          <div className=' w-full h-1/2 font-Roboto text-[38px] border-b-2 border-black bg-white flex justify-center items-center'>{props.top}</div>
          <div className=' w-full h-1/2 font-Roboto text-[38px] bg-white flex justify-center items-center'>{props.bottom}</div>
        </div>
      }
    </div>
  )
}

export default Card
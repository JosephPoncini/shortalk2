'use client'

import React from 'react'
import Image from 'next/image';
import GreenArrow from '../assets/GreenArrow.png'

const OnePointBtn = ({onClick} : {onClick:()=>void}) => {
  return (
    <div onClick={onClick} className=' rounded-2xl border-2 border-black w-[100px] sm:w-[200px] sm:h-[75px] bg-lgreen flex justify-center sm:justify-between items-center px-4 space-x-4 cursor-pointer'>
        <div className=' font-LuckiestGuy text-[25px] sm:text-[40px] text-dgreen whitespace-nowrap'>1PT</div>
        <Image src={GreenArrow} alt='green arrow' className='hidden sm:block' width={50} height={40}/>
    </div>
  )
}

export default OnePointBtn
'use client'

import React from 'react'
import Image from 'next/image';
import PinkArrow from '../assets/PinkArrow.png'

const ThreePointBtn = ({onClick} : {onClick:()=>void}) => {
  return (
    <div onClick={onClick} className=' rounded-2xl border-2 border-black w-[100px] sm:w-[200px] sm:h-[75px] bg-lmagenta flex justify-center sm:justify-between items-center px-4 space-x-4 cursor-pointer'>
        <div className=' font-LuckiestGuy text-[25px] sm:text-[40px] text-dmagenta whitespace-nowrap'>3PTS</div>
        <Image src={PinkArrow} className='hidden sm:block' alt='pink arrow w-[40px] h-[30px] sm:w-[50px] sm:h-[40px]'/>
    </div>
  )
}

export default ThreePointBtn
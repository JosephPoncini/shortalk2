'use client'

import React from 'react'
import Image from 'next/image';
import GrayArrow from '../assets/GrayArrow.png'


const SkipBtn = ( {onClick} : {onClick:()=>void}) => {
  return (
    <div onClick={onClick} className=' rounded-lg sm:rounded-2xl border-2 border-black w-[100px] sm:w-[200px] sm:h-[75px] bg-lgray flex justify-center sm:justify-between items-center px-4 cursor-pointer'>
        <div className=' font-LuckiestGuy text-[25px] sm:text-[40px] text-dgray'>Skip</div>
        <Image className=' hidden sm:block' src={GrayArrow} alt='gray arrow' width={50} height={40}/>
    </div>
  )
}

export default SkipBtn
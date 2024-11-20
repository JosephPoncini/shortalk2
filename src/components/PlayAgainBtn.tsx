'use client'

import React from 'react'
import Image from 'next/image';
import BlueArrow from '../assets/BlueArrow.png'

const PlayAgainBtn = () => {
  return (
    <div className='text-center rounded-2xl border-2 border-black w-[100] sm:w-[325px] sm:h-[75px] bg-dgreen pt-2 px-4'>
        <div className=' font-LuckiestGuy text-[20px] sm:text-[40px] text-white tracking-wide'>Play Again?</div>
    </div>
  )
}

export default PlayAgainBtn
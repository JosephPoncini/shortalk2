'use client'

import React from 'react'

interface INavBar {
  title: string
}

const NavBar = (props:INavBar) => {
  return (
    <div className=' bg-dblue font-LuckiestGuy text-white lg:px-10 pt-2 sm:ps-5 md:h-[90px] h-[50px] sm:h-[75px] lg:text-4xl text-2xl w-full flex items-center tracking-widest z-40 relative'>
      <div className='cursor-default sm:w-auto w-full text-center sm:text-left'>{props.title} </div>

    </div>
  )
}

export default NavBar
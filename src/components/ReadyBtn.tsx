'use client'

import React, { useEffect, useState } from 'react'

interface IReadyButton {
    isReady: boolean
    isHost: boolean
    onClick: ()=>void
  }

const ReadyBtn = ( props: IReadyButton) => {

    const classNameBase = 'rounded-lg sm:rounded-2xl w-[150px] h-[50px] sm:w-[200px] sm:h-[100px] flex justify-center items-center px-4 ';


    const [btnText, setBtnText] = useState<string>('')
    const [className, setClassName] = useState<string>(classNameBase);

    useEffect(() => {
        if (props.isReady) {
            setClassName(classNameBase + ' bg-dred cursor-pointer border-2 border-black ')
            setBtnText('Not Ready');
        } else {
            setClassName(classNameBase + ' bg-dblue hover:bg-hblue active:text-dblue border-2 border-black cursor-pointer ')
            setBtnText('Ready');
        }
    },[props.isReady])



    return (
        <div onClick={props.onClick} className={className + 'font-LuckiestGuy text-[20px] sm:text-[30px] text-white border cursor-pointer'}>
            <div className='bg-lblue bg-lgray bg-dblue'></div>
            {btnText}
        </div>
    )
}

export default ReadyBtn

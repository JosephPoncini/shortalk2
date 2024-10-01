'use client'
import React, { useEffect, useState } from 'react'

interface INextButton {
    onClick: () => void
}

const NextBtn = (props: INextButton) => {

    return (
        <div onClick={props.onClick} className={'bg-dblue hover:bg-hblue active:text-dblue border-2 border-black font-LuckiestGuy text-[30px] text-center text-white cursor-pointer w-[100px] rounded-lg'}>
            Next
        </div>
    )
}

export default NextBtn

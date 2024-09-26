import React from 'react'
import dice from '../assets/Dice.png'
import Image from 'next/image';

interface IDice {
    isReady: boolean
    onClick: () => void
}

const DiceBtn = ({isReady, onClick} : IDice) => {
    
    return (
        <div onClick={onClick} className={`${isReady ? 'opacity-[0.5] cursor-default':'cursor-pointer'}`}>
            <Image src={dice} alt='red and green dice' width={58} height={40} />
        </div>
    )
}

export default DiceBtn
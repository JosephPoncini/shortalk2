import React from 'react'
import dice from '@/assets/Dice.png'
import Image from 'next/image';

interface IDice {
    onClick: () => void
}

const DiceBtn = ({onClick} : IDice) => {
    
    return (
        <div onClick={onClick} className=' cursor-pointer'>
            <Image src={dice} alt='red and green dice' width={58} height={40} />
        </div>
    )
}

export default DiceBtn
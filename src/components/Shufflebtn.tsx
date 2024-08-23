import React from 'react'

interface IShuffleBtn {
    onClick : () => void
}

const ShuffleBtn = ({onClick}:IShuffleBtn) => {

    return (
        <button onClick={onClick} className='cursor-pointer rounded-xl bg-green text-center text-white p-1 font-LuckiestGuy tracking-widest'>
            Shuffle
        </button>
    )
}

export default ShuffleBtn
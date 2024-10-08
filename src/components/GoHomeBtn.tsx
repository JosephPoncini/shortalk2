'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

const GoHomeBtn = () => {

    const router = useRouter()

    return (
        <div className='cursor-pointer pb-10 font-LuckiestGuy tracking-widest'>
            <button className='md:px-16 py-2 bg-dblue' onClick={() => { router.push('/pages/homePage') }}>
                <p className='text-[36px]'>Back to Home</p>
            </button>
        </div>
    )
}

export default GoHomeBtn
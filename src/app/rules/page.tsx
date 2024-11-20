'use client'

import React from 'react'
import Image from "next/image";
import { QuestionMark, Shield, UserSound } from '@phosphor-icons/react'
import { useRouter, useSearchParams } from "next/navigation";

const page = () => {
    const router = useRouter();

    const handleBack = () => {
        router.push(`../`);
    }

    return (
        <div className='h-screen flex flex-col justify-center align-middle mx-4 md:mx-16 space-y-6 '>
            <div className='flex justify-center items-center flex-col sm:space-y-[-15px]'>
                <p className='text-dblue font-LuckiestGuy text-[30px] sm:text-[48px] tracking-widest text-center cursor-default'>The Rules</p>
            </div>

            <div className='flex justify-center'>

                <div className='cardBorder bg-white w-[500px] sm:h-[410px] rounded-lg flex space-y-3 pt-[24px] px-4 relative whitespace-normal font-RobotoBold text-dblue text-[16px] sm:text-[20px] pb-16 sm:pb-0'>
                    <p>ShorTalk is a word guessing game. On your teams turn, one teammember will have the role as speaker <span className="inline-flex items-center mx-1 relative top-1">
                        <UserSound size={20} color="#000000" /></span>. The speaker has to get his teammates (the guessers <span className="inline-flex items-center mx-1 relative top-1">
                            <QuestionMark size={20} color="#000000" /></span>) to guess the top and/or the bottom word on his card. The speaker may only use one-syllable words to describe the words on his card, otherwise the other team (the defenders <span className="inline-flex items-center mx-1 relative top-1">
                            <Shield size={20} color="#fa0505" weight="duotone" /></span>) may click their Buzz button and subtract points from the other teams score. The speaker may say the word on his card once it has already been guessed (even if it more than one syllable). </p>
                    <div className=' absolute right-2 bottom-2 w-[100px] h-[50px] font-LuckiestGuy bg-lgray border-dgray text-dgray flex justify-center items-center  border-2 rounded-xl cursor-pointer hover:bg-dgray hover:text-lgray hover:border-lgray active:bg-lgray active:text-dgray active:border-dgray ' onClick={handleBack}>
                        Back
                    </div>
                </div>

            </div>
        </div>
    )
}

export default page


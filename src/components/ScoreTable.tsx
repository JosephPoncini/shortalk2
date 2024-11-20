'use client'

import { ICardDto } from '@/utils/interefaces'
import React from 'react'


interface IScoreTableProps {
    skipWords: ICardDto[]
    buzzWords: ICardDto[]
    onePointWords: ICardDto[]
    threePointWords: ICardDto[]
}

const ScoreTable = (props: IScoreTableProps) => {
    return (
        <div className=' grid grid-cols-2 gap-2 w-[300px] sm:w-full h-[500px] grid-rows-2 sm:flex sm:justify-center cursor-default sm:gap-0 '>

                <div className=' row-start-1 col-start-1 sm:mb-4 flex sm:w-[200px] flex-col justify-between bg-white'>
                    <div className='border-[2px] border-black flex justify-center items-center '>
                        <p className='text-gray-600 font-LuckiestGuy text-[24px] sm:text-[40px] tracking-widest text-center'>
                            SKIPPED
                        </p>
                    </div>
                    <div className='border-[2px] border-t-[1px] border-black p-2 text-[12px] h-full sm:h-[430px] overflow-y-auto removeScrollbar'>
                        <div className='flex flex-col'>
                            {/* Fill this with data */}
                            {
                                props.skipWords.map((card, id) => {
                                    return (
                                        <div key={id} className='flex justify-between '>
                                            <p>
                                                {card.firstWord}
                                            </p>
                                            <p>
                                                {card.secondWord}
                                            </p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>

                <div className='row-start-1 col-start-2 sm:mb-4 flex flex-col  sm:w-[200px]  justify-between bg-white'>
                    <div className='border-[2px] border-black flex justify-center items-center'>
                        <p className='text-red-600 font-LuckiestGuy text-[25px] sm:text-[40px] tracking-widest text-center'>
                            -1PT
                        </p>
                    </div>
                    <div className='border-[2px] border-t-[1px] border-b-[1px] border-black p-2 text-[11px] sm:text-[16px] h-full overflow-y-auto removeScrollbar'>
                        {
                            props.buzzWords.map((card, id) => {
                                return (
                                    <div key={id} className='flex justify-between'>
                                        <p>
                                            {card.firstWord}
                                        </p>
                                        <p>
                                            {card.secondWord}
                                        </p>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className='border-[2px] border-black flex justify-center items-CENTER'>
                        <p className='text-red-600 font-LuckiestGuy text-[25px] sm:text-[40px] tracking-widest text-center'>
                            -{props.buzzWords.length}
                        </p>
                    </div>
                </div>

                <div className=' row-start-2 col-start-1  sm:w-[200px] sm:mb-4 flex flex-col justify-between bg-white'>
                    <div className='border-[2px] border-black flex justify-center items-center'>
                        <p className='text-green font-LuckiestGuy text-[25px] sm:text-[40px] tracking-widest text-center'>
                            +1PT
                        </p>
                    </div>
                    <div className='border-[2px] border-t-[1px] border-b-[1px] border-black p-2 text-[11px] sm:text-[16px] h-full overflow-y-auto removeScrollbar'>
                        {
                            props.onePointWords.map((card, id) => {
                                return (
                                    <div key={id} className='flex justify-between'>
                                        <p>
                                            {card.firstWord}
                                        </p>
                                        <p>
                                            {card.secondWord}
                                        </p>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className='border-[2px] border-black flex justify-center items-CENTER'>
                        <p className='text-green font-LuckiestGuy text-[25px] sm:text-[40px] tracking-widest text-center'>
                            +{props.onePointWords.length}
                        </p>
                    </div>
                </div>

                <div className=' row-start-2 col-start-2  sm:w-[200px] sm:mb-4 flex flex-col justify-between bg-white'>
                    <div className='border-[2px] border-black flex justify-center items-cente'>
                        <p className=' text-purple font-LuckiestGuy text-[25px] sm:text-[40px] tracking-widest text-center'>
                            +3PTS
                        </p>
                    </div>
                    <div className='border-[2px] border-t-[1px] border-b-[1px] border-black p-2 text-[11px] sm:text-[16px] h-full overflow-y-auto removeScrollbar'>
                        {
                            props.threePointWords.map((card, id) => {
                                return (
                                    <div key={id} className='flex justify-between'>
                                        <p>
                                            {card.firstWord}
                                        </p>
                                        <p>{" "}</p>
                                        <p>
                                            {card.secondWord}
                                        </p>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className='border-[2px] border-black flex justify-center items-CENTER'>
                        <p className=' text-purple font-LuckiestGuy text-[25px] sm:text-[40px] tracking-widest text-center'>
                            +{props.threePointWords.length * 3}
                        </p>
                    </div>
                </div>

        </div>
    )
}

export default ScoreTable

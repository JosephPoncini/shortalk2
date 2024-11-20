
import React from 'react'
import Image from 'next/image';
import checkMarck from '../assets/ImReadyCheckMark.png'
import topHat from '../assets/ShortalkLogoTopHat.png'
import trash from '../assets/Trash.png'
import buzzable from '../assets/Buzzable.png'
import nonbuzzable from '../assets/Nonbuzzable.png'

interface IOnlineTeam {
  teamName: string;
  host: string;
  members: {
    name: string
    readyStatus: boolean
    role: string
    spot: number
  }[];
  handleRemove: (playerName: string) => void;
}

const OnlineTeamName = (props: IOnlineTeam) => {

  const userName = sessionStorage.getItem("Username");


  return (


    <div className={`justify-between whitespace-nowrap items-center sm:space-y-5 md:w-[400px] w-[300px] lg:px-[25px] text-center lg:gap-0 gap-2 ${props.teamName == 'Team 1' ? 'order-1':'order-2'}`}>
      <h1 className='underline text-dblue font-Roboto sm:text-4xl text-[22px] text-center'>{props.teamName}</h1>
      {
        props.members && props.members.map((member, idx) => {
          return (

            <div key={idx} className=' flex justify-between'>
              <h1 className=' text-dblue font-Roboto text-[22px] sm:text-4xl text-center overflow-x-auto removeScrollbar mr-5'>{member.name}</h1>
              <div className=' flex justify-between'>
                {
                  (member.name == props.host) ? <Image src={topHat} alt='topHat' className=' sm:w-8 sm:h-8 w-5 h-5 pr-1 sm:pr-0' />
                    : member.readyStatus ? <Image src={checkMarck} alt='check mark' className=' sm:w-10 sm:h-10 w-6 h-6' />
                      : <div></div>
                }             
                {
                  (userName == props.host && member.name != props.host && member.name != "") &&
                  <Image onClick={() => props.handleRemove(member.name)} src={trash} className='ml-5 cursor-pointer sm:w-[40px] sm:h-[40px] w-6 h-6' alt='trash' />
                }
              </div>

            </div>
          )
        })
      }
    </div>

  )
}

export default OnlineTeamName


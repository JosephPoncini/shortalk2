
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
  }[];
  handleRemove: (playerName: string) => void;
}

const OnlineTeamName = (props: IOnlineTeam) => {

  const userName = sessionStorage.getItem("Username");


  return (


    <div className='justify-between whitespace-nowrap items-center space-y-5 md:w-[400px] w-[300px] lg:px-[25px] text-center lg:gap-0 gap-2'>
      <h1 className='underline text-dblue font-Roboto lg:text-4xl text-3xl text-center'>{props.teamName}</h1>
      {
        props.members && props.members.map((member, idx) => {
          return (

            <div key={idx} className=' flex justify-between'>
              <h1 className=' text-dblue font-Roboto lg:text-4xl text-2xl text-center overflow-x-auto removeScrollbar mr-5'>{member.name}</h1>
              <div className=' flex justify-between'>
                {
                  (member.name == props.host) ? <Image src={topHat} alt='topHat' className=' w-8 h-8' />
                    : member.readyStatus ? <Image src={checkMarck} alt='check mark' />
                      : <div></div>
                }             
                {
                  (userName == props.host && member.name != props.host && member.name != "") &&
                  <Image onClick={() => props.handleRemove(member.name)} src={trash} className='ml-5 cursor-pointer' alt='trash' width={40} />
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


import { Plus } from 'lucide-react'
import React, { FC } from 'react'

interface GroupAddMembersProps {
    setIsAddingToGroup: React.Dispatch<React.SetStateAction<boolean>>
 }

const GroupAddMembers:FC<GroupAddMembersProps> = ({setIsAddingToGroup}) => {
    return (
        <div className='absolute bottom-4 right-3'>
            <div onClick={() => setIsAddingToGroup(true)} className={`flex items-center bg-[rgb(135,116,225)] cursor-pointer justify-center w-[56px] h-[56px] rounded-full transition shadow-lg`}>
                <Plus stroke="white" />
            </div>
        </div>
    )
}

export default GroupAddMembers
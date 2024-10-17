'use client'
import React, { Dispatch, FC, SetStateAction, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { User } from '@/types/User'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useModal } from '@/hooks/use-modal-hooks'

interface GroupNavbarProps {
    usersToInvite: User[];
    setIsCreatingGroup: Dispatch<SetStateAction<boolean>>
    profile: User
}

const GroupNavbar: FC<GroupNavbarProps> = ({ profile, usersToInvite, setIsCreatingGroup }) => {
    const [selectedMembers, setSelectedMembers] = useState<User[]>([])
    const [searchValue, setSearchValue] = useState<string>('')
    const { onOpen } = useModal()
    const isDisabled = selectedMembers.length === 0;

    const filteredUsers = usersToInvite.filter((user) =>
        user.name.toLowerCase().includes(searchValue.toLowerCase())
    )
    
    const toggleMember = (user: User) => {
        setSelectedMembers((prev: User[]) => {
            const isSelected = prev.some(member => member.id === user.id)
            return isSelected
                ? prev.filter(member => member.id !== user.id)
                : [...prev, user]
        })
    }
    return (
        <motion.div
            className="flex flex-col h-full w-full bg-[rgb(33,33,33)] border-r-[#303030] text-primary relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
        >
            {/* header */}
            <div className="flex items-center pt-1.5 pb-2 px-[0.8125rem] select-none">
                <div onClick={() => setIsCreatingGroup(false)} className='w-10 h-10 rounded-[50%] hover:bg-[#2B2B2B] cursor-pointer flex items-center justify-center transition'>
                    <ArrowLeft stroke={"grey"} />
                </div>
                <h1 className="ml-5 text-lg font-medium text-white">Add Members</h1>
            </div>

            {/* selected member section */}
            <div className="flex w-full flex-col items-center px-5 py-3 border-b border-b-[#303030]">
                <div className='flex w-full flex-start flex-wrap gap-2'>
                    {selectedMembers.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center rounded-full px-3 py-1 bg-[rgb(44,44,44)] text-white transition-colors duration-200 hover:bg-[rgb(229,57,53)] cursor-pointer"
                            onClick={() => toggleMember(member)}
                        >
                            <span className="text-sm">
                                {member.name.length > 12 ? `${member.name.slice(0, 12)}...` : member.name}
                            </span>
                        </div>
                    ))}
                </div>
                <div className='w-full mt-2'>
                    <input
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className='w-full h-[32px] bg-transparent outline-none border-none caret-[rgb(135,116,225)] text-white'
                        type='text'
                        placeholder='Who would you like to add?'
                    />
                </div>
            </div>

            {/* member list */}
            <div className="flex flex-col flex-1 overflow-y-auto p-4">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((member) => {
                        const formattedDate = format(member.lastSeen, 'dd.MM.yyyy в HH:mm', { locale: ru })

                        return (
                            <div key={member.id} className="flex items-center justify-between py-2 p-2 rounded-[0.75rem] cursor-pointer hover:bg-[rgb(44,44,44)]" onClick={() => toggleMember(member)}>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-gray-600 mr-2">
                                        <img
                                            src={member.imageUrl}
                                            alt={member.name}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-white">{member.name}</p>
                                        <p className="text-[rgb(170,170,170)] text-sm">{formattedDate}</p>
                                    </div>
                                </div>
                                <div
                                    className={`w-6 h-6 cursor-pointer border-2 flex items-center justify-center rounded transition duration-300 ${selectedMembers.some(m => m.id === member.id)
                                        ? 'bg-[rgb(135,116,225)] border-[rgb(135,116,225)]'
                                        : 'bg-transparent border-gray-500'
                                        }`}
                                >
                                    {selectedMembers.some(m => m.id === member.id) && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12"><path d="M13.9.8L5.8 8.9 2.1 5.2c-.4-.4-1.1-.4-1.6 0-.4.4-.4 1.1 0 1.6L5 11.2c.4.4 1.1.4 1.6 0l8.9-8.9c.4-.4.4-1.1 0-1.6-.5-.4-1.2-.4-1.6.1z" fill="#FFF" fill-rule="nonzero" /></svg>
                                    )}
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <p className="text-gray-400">No users found</p>
                )}
            </div>

            {/* action button */}
            <div className='absolute bottom-4 right-3'>
                <div
                    onClick={() => {
                        if (!isDisabled) {
                            onOpen("createGroup", { groupMembers: selectedMembers, profile, setIsCreatingGroup });
                        }
                    }}
                    className={`flex items-center justify-center w-[56px] h-[56px] rounded-full 
                ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[rgb(135,116,225)] hover:bg-[rgb(123,113,198)] cursor-pointer'} 
                transition shadow-lg`}
                >
                    <ArrowRight stroke="white" />
                </div>
            </div>
        </motion.div>
    )
}

export default GroupNavbar
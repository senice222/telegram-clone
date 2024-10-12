'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import SearchBacktick from '../search/search-backtick'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const GroupNavbar = () => {
    const [selectedMembers, setSelectedMembers] = useState([])

    const members = [
        { id: 1, name: 'ЙОСЫП К1', lastSeen: 'recently' },
        { id: 2, name: 'denis has fat black penis', lastSeen: 'recently' },
        { id: 3, name: 'Герман', lastSeen: 'recently' },
        { id: 4, name: 'мила', lastSeen: '44 minutes ago' },
    ]

    const toggleMember = (id: number) => {
        setSelectedMembers((prev: any) =>
            prev.includes(id) ? prev.filter((memberId: number) => memberId !== id) : [...prev, id]
        )
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
                <div className='w-10 h-10 rounded-[50%] hover:bg-[#2B2B2B] cursor-pointer flex items-center justify-center transition'>
                    <ArrowLeft stroke={"grey"} />
                </div>
                <h1 className="ml-5 text-lg font-medium text-white">Add Members</h1>
            </div>

            {/* selected member section */}
            <div className="flex w-full flex-col items-center px-5 py-3 border-b border-b-[#303030]">
                <div className='flex w-full flex-start flex-wrap gap-2'>
                    {selectedMembers.map(id => {
                        const member = members.find(m => m.id === id)
                        return (
                            member && (
                                <div
                                    key={member.id}
                                    className="flex items-center rounded-full px-3 py-1 bg-[rgb(44,44,44)] text-white transition-colors duration-200 hover:bg-[rgb(229,57,53)] cursor-pointer"
                                    onClick={() => toggleMember(member.id)}
                                >
                                    <span className="text-sm">
                                        {member.name.length > 12 ? `${member.name.slice(0, 12)}...` : member.name}
                                    </span>
                                </div>
                            )
                        )
                    })}
                </div>
                <div className='w-full mt-2'>
                    <input className='w-full h-[32px] bg-transparent outline-none border-none caret-[rgb(135,116,225)] text-white' type='text' placeholder='Who would you like to add?' />
                </div>
            </div>

            {/* member list */}
            <div className="flex flex-col flex-1 overflow-y-auto p-4">
                {members.map(member => (
                    <div key={member.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-600 mr-4"></div>
                            <div>
                                <p className="text-white">{member.name}</p>
                                <p className="text-gray-500 text-sm">last seen {member.lastSeen}</p>
                            </div>
                        </div>
                        <div
                            onClick={() => toggleMember(member.id)}
                            className={`w-6 h-6 cursor-pointer border-2 flex items-center justify-center rounded transition duration-300 ${selectedMembers.includes(member.id)
                                ? 'bg-[rgb(135,116,225)] border-[rgb(135,116,225)]'
                                : 'bg-transparent border-gray-500'
                                }`}
                        >
                            {selectedMembers.includes(member.id) && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12"><path d="M13.9.8L5.8 8.9 2.1 5.2c-.4-.4-1.1-.4-1.6 0-.4.4-.4 1.1 0 1.6L5 11.2c.4.4 1.1.4 1.6 0l8.9-8.9c.4-.4.4-1.1 0-1.6-.5-.4-1.2-.4-1.6.1z" fill="#FFF" fill-rule="nonzero" /></svg>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* action button */}
            <div className='absolute bottom-4 right-3'>
                <div className="flex items-center justify-center w-[56px] h-[56px] rounded-full bg-[rgb(135,116,225)] hover:bg-[rgb(123,113,198)] transition shadow-lg cursor-pointer">
                    <div>
                        <ArrowRight stroke="white" />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default GroupNavbar
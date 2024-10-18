'use client'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { motion } from "framer-motion";
import ChatItem from '../chats/chat-item';
import debounce from "lodash.debounce";
import { axiosInstance } from '@/core/axios';
import { ChannelType } from '@/types/Channel';
import useDebounce from '@/hooks/useDebouce';
import qs from 'query-string'
import {User} from "@/types/User";

interface SearchNavbarProps {
    searchValue: string;
    setIsSearching: Dispatch<SetStateAction<boolean>>
    profile: User
}

const SearchNavbar = ({ profile, searchValue, setIsSearching }: SearchNavbarProps) => {
    const [filteredResults, setFilteredResults] = useState<ChannelType[]>([]);
    const debouncedValue = useDebounce(searchValue, 500); 

    useEffect(() => {
        const fetchResults = async () => {
            const query = debouncedValue;

            if (query) {
                try {
                    const url = qs.stringifyUrl({
                        url: "/api/search",
                        query: {
                            query: query,
                            currentUserId: profile.id
                        }
                    })
                    const { data } = await axiosInstance.get(url);
                    setFilteredResults(data);
                } catch (error) {
                    console.error("Ошибка поиска:", error);
                }
            } else {
                setFilteredResults([]);
            }
        };

        fetchResults();
    }, [debouncedValue]);
    console.log(filteredResults)
    return (
        <motion.div
            className="flex flex-col h-full text-primary w-full bg-[rgb(33,33,33)] relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
        >
            {filteredResults.length > 0 ? (
                filteredResults.map((item, index) => (
                    <ChatItem key={index} profile={profile} setIsSearching={setIsSearching} data={item} />
                ))
            ) : (
                <div className='flex flex-col gap-3 select-none h-full items-center justify-center'>
                    <p className='text-[#686c72]'>No results</p>
                    <div className='flex flex-col items-center'>
                        <p className="text-[#aaaaaa] text-[.875rem]">There were no results.</p>
                        <p className="text-[#aaaaaa] text-[.875rem]">Try a new search.</p>
                    </div>
                </div>
            )}
        </motion.div>
    )
}

export default SearchNavbar
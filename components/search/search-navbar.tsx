'use client'
import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import ChatItem from '../chats/chat-item';
import debounce from "lodash.debounce";
import { axiosInstance } from '@/core/axios';

interface SearchNavbarProps {
    searchValue: string
}

const SearchNavbar = ({ searchValue }: SearchNavbarProps) => {
    const [filteredResults, setFilteredResults] = useState<any[]>([]);

    const debouncedFilter = debounce(async () => {
        const query = searchValue;

        if (query) {
            try {
                const { data } = await axiosInstance.get(`/api/search?q=${query}`);
                setFilteredResults(data);
            } catch (error) {
                console.error("Ошибка поиска:", error);
            }
        } else {
            setFilteredResults([]);
        }
    }, 400);

    useEffect(() => {
        debouncedFilter();
    }, [searchValue]);

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
                    <ChatItem key={index} data={item} />
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
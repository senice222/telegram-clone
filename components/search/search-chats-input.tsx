'use client'
import { Search } from 'lucide-react'
import React, { Dispatch, FC, RefObject, SetStateAction, useEffect, useRef, useState } from 'react'
import SearchBacktick from './search-backtick'
import SearchInput from '../search-input';

export interface SearchChatsInputProps {
    isSearching: boolean
    setIsSearching: Dispatch<SetStateAction<boolean>>
    setSearchValue: Dispatch<SetStateAction<string>>
    searchValue: string
}

const SearchChatsInput: FC<SearchChatsInputProps> = ({ searchValue, setSearchValue, isSearching, setIsSearching }) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (searchValue) {
            setIsLoading(true);
            const timeoutId = setTimeout(() => {
                setIsLoading(false);
            }, 400);

            return () => clearTimeout(timeoutId);
        } else {
            setIsLoading(false);
        }
    }, [searchValue]);

    const handleFocus = () => {
        setIsSearching(true);
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsSearching(false);
        setIsFocused(false);
    };

    return (
        <div className='flex items-center'>
            <SearchBacktick isSearching={isSearching} handleBackClick={handleBlur} />
            <div
                className='relative w-[85%] ml-1 mx-auto my-0 mr-1 text-[rgb(170,170,170)] h-[44px]'
            >
                <div className='absolute inset-y-0 left-0 flex items-center pl-3'>
                    <Search stroke={isFocused ? "rgb(135,116,225)" : "rgb(170,170,170, 0.8)"} className='transition' />
                </div>
                <SearchInput
                    isLoading={isLoading}
                    isFocused={isFocused}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    handleFocus={handleFocus}
                    placeholder='Search chats'
                    setIsFocused={setIsFocused}
                />
            </div>
        </div>

    )
}

export default SearchChatsInput
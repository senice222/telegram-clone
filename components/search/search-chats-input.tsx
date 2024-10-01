'use client'
import { Search } from 'lucide-react'
import React, { Dispatch, FC, SetStateAction, useRef, useState } from 'react'
import SearchBacktick from './search-backtick'
import SearchInput from '../search-input';

export interface SearchChatsInputProps {
    isSearching: boolean
    setIsSearching: Dispatch<SetStateAction<boolean>>
}

const SearchChatsInput: FC<SearchChatsInputProps> = ({ isSearching, setIsSearching }) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

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
                className='relative w-[85%] mx-auto my-0 mr-1 text-[rgb(170,170,170)] h-[44px]'
            >
                <div className='absolute inset-y-0 left-0 flex items-center pl-3'>
                    <Search stroke={isFocused ? "rgb(135,116,225)" : "rgb(170,170,170, 0.8)"} className='transition' />
                </div>
                <SearchInput
                    isFocused={isFocused}
                    inputRef={inputRef}
                    handleFocus={handleFocus}
                    setIsFocused={setIsFocused}
                />
            </div>
        </div>

    )
}

export default SearchChatsInput
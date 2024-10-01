import { Search, X } from 'lucide-react';
import React, { FC } from 'react'
import { cn } from '@/lib/utils';

interface SearchInputProps {
    inputRef?: React.RefObject<HTMLInputElement>
    handleFocus?: () => void;
    setIsFocused?: React.Dispatch<React.SetStateAction<boolean>>;
    isFocused?: boolean;
    classNames?: string;
    closeSearch?: () => void;
}

const SearchInput: FC<SearchInputProps> = ({ inputRef, handleFocus, setIsFocused, isFocused, classNames, closeSearch }) => {
    return (
        <div className={cn('relative flex items-center justify-between', classNames)}>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3'>
                <Search stroke={isFocused ? "rgb(135,116,225)" : "rgb(170,170,170, 0.8)"} className='transition' />
            </div>
            <input
                ref={inputRef}
                onFocus={handleFocus}
                onBlur={setIsFocused ? () => setIsFocused(false) : undefined}
                className='focus:border-[rgb(135,116,225)] text-white transition bg-[rgb(44,44,44)] rounded-[1.375rem] border-2 border-solid border-[rgb(44,44,44)] outline-none w-full h-[44px] px-10 text-sm'
                type='text'
                placeholder='Search chats'
            />
            {
                closeSearch && <div onClick={closeSearch} className='absolute top-[3px] inset-y-0 right-[10px] flex w-[40px] h-[40px] items-center justify-center rounded-full hover:bg-[#aaaaaa]/[.08]'>
                    <X color='rgb(170,170,170, 0.8)'/>
                </div>
            }
        </div>
    )
}

export default SearchInput
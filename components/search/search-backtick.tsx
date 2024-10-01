import React, { FC } from 'react'
import { ArrowLeft, ArrowRight, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBacktick {
    handleBackClick: () => void;
    isSearching: boolean
}

const SearchBacktick: FC<SearchBacktick> = ({ isSearching, handleBackClick }) => {
    return (
        <motion.div
            className='cursor-pointer ml-1 mr-1'
            onClick={handleBackClick}
            initial={{ rotate: 120, opacity: 1 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 120, opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className='h-[40px] w-[40px] hover:bg-[#2B2B2B] transition flex items-center justify-center rounded-[50%]'>
                <motion.div
                    key={isSearching ? 'arrow' : 'menu'}
                    initial={{ rotate: 0, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: isSearching ? 180 : 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 0, scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {isSearching ? <ArrowRight stroke={"grey"} /> : <Menu stroke={"grey"} />}
                </motion.div>
            </div>
        </motion.div>
    )
}

export default SearchBacktick
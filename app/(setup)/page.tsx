import { initialProfile } from '@/lib/initialProfile';
import React from 'react'

const Page = async () => {
    const profile = await initialProfile()

    return (
        <div className="w-full h-full flex items-center justify-center">
            {/* <div className='w-[13.5%] h-[5%] select-none flex items-center justify-center rounded-[8px] bg-[rgb(97,98,99)] opacity-[50%]'> */}
                {/* <p className='opacity-[50%]'>Select a chat to start messaging</p> */}
            {/* </div> */}
            <h1>asdasdas</h1>
        </div>
    );
};

export default Page

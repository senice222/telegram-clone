import { Loader2 } from 'lucide-react'
import React from 'react'

const Pending = () => {
    return (
        <div className="h-screen flex flex-col flex-1 justify-center items-center">
            <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading messages...</p>
        </div>
    )
}

export default Pending
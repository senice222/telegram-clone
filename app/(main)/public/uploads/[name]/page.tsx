import { currentProfile } from '@/lib/currentProfile'
import { redirectToSignUp } from '@clerk/nextjs'
import Image from 'next/image'

interface ImageProps {
    params: {
        name: string;
    }
}

const ImagePage = async ({params}: ImageProps) => {
    return <Image src={`/uploads/${params.name}`} alt={"/"} width="64" height="64" />

}

export default ImagePage
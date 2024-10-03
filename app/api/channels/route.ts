import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { uploadFile } from "@/lib/uploadFile";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    const profile = await currentProfile();
    const formData = await req.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as File | null;
    
    if (!profile) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!name) {
        return new NextResponse("Name is required", { status: 400 });
    }
    
    let imgUrl: string = ""

    if (image) {
        const url = await uploadFile(image)
        imgUrl = url;
    }

    const channel = await db.channel.create({
        data: {
            name,
            description,
            image: imgUrl, 
            owner: {
                connect: {
                    id: profile.id 
                }
            },
            members: {
                connect: {
                    id: profile.id 
                }
            }
        }
    });

    return NextResponse.json(channel);
}
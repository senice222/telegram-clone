import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') as string;

    const channels = await db.channel.findMany({
        where: {
            name: {
                contains: query,
            },
        },
        take: 10, 
    });

    const users = await db.profile.findMany({
        where: {
            name: {
                contains: query,
            }
        },
        take: 10,
    });

    return NextResponse.json([...channels, ...users]);
};
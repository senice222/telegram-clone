'use server'
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import path from "path"; 


export async function uploadFile(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const projectDir = process.cwd();
    const uploadsDir = path.join(projectDir, "public", "uploads");

    await fs.mkdir(uploadsDir, { recursive: true }); 

    await fs.writeFile(path.join(uploadsDir, file.name), buffer);

    revalidatePath("/"); 

    return `${process.env.NEXT_PUBLIC_SITE_URL}/images/uploads/${file.name}` as string; 
}

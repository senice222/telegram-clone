'use server'
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import path from "path"; // Імпортуємо модуль path


export async function uploadFile(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Отримуємо шлях до поточного проекту
    const projectDir = process.cwd();
    // Визначаємо шлях до папки, куди будемо зберігати файли
    const uploadsDir = path.join(projectDir, "images", "uploads");

    // Переконуємося, що папка існує (можете додати перевірку на існування папки і створення)
    await fs.mkdir(uploadsDir, { recursive: true }); // Створюємо папку, якщо її немає

    // Записуємо файл
    await fs.writeFile(path.join(uploadsDir, file.name), buffer);

    revalidatePath("/"); // Оновлюємо кеш

    return `${process.env.NEXT_PUBLIC_SITE_URL}/images/uploads/${file.name}` as string; // Повертаємо URL
}

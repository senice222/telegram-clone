export const mediaFiles = [
  {
    id: 1,
    type: "image",
    src: "https://picsum.photos/150/150?random=1", // Рандомное изображение
  },
  {
    id: 2,
    type: "image",
    src: "https://picsum.photos/150/150?random=2", // Рандомное изображение
  },
  {
    id: 3,
    type: "video",
    src: "https://picsum.photos/150/150?random=3", // Превью видео
    duration: "0:08",
  },
  {
    id: 4,
    type: "image",
    src: "https://picsum.photos/150/150?random=4", // Рандомное изображение
  },
  {
    id: 5,
    type: "image",
    src: "https://picsum.photos/150/150?random=5", // Рандомное изображение
  },
  {
    id: 6,
    type: "image",
    src: "https://picsum.photos/150/150?random=6", // Рандомное изображение
  },
];
export const fileList: FileType[] = [
  { id: 1, name: "MGI Patreon Build - Halloween[v2].zip", type: "zip", size: "389.9 MB", date: "Sep 7, 21:25" },
  { id: 2, name: "Овощи 04.09г.xlsx", type: "xlsx", size: "17.3 KB", date: "Sep 5, 10:52" },
  { id: 3, name: "Document.pdf", type: "pdf", size: "12.5 MB", date: "Sep 6, 12:30" },
  { id: 4, name: "Notes.docx", type: "docx", size: "23.4 KB", date: "Sep 5, 08:15" },
  { id: 5, name: "Presentation.pptx", type: "pptx", size: "45.7 MB", date: "Sep 4, 15:45" },
  { id: 6, name: "Archive.rar", type: "rar", size: "128.9 MB", date: "Sep 3, 10:00" },
  { id: 7, name: "UnknownFile.abc", type: "abc", size: "0 KB", date: "Sep 2, 09:00" }, // Неизвестный тип
];

export const fileColors: Record<string, string> = {
  zip: "bg-orange-500",
  xlsx: "bg-green-500",
  pdf: "bg-red-500",
  docx: "bg-blue-500",
  pptx: "bg-purple-500",
  rar: "bg-yellow-500",
  jpg: "bg-pink-500", // Цвет для изображений JPG
  jpeg: "bg-pink-500", // Цвет для изображений JPEG
  png: "bg-pink-500", // Цвет для изображений PNG
  gif: "bg-pink-500", // Цвет для GIF
  bmp: "bg-pink-500", // Цвет для BMP
  svg: "bg-pink-500", // Цвет для SVG
  webp: "bg-pink-500", // Цвет для WebP
  unknown: "bg-gray-500", // Цвет для неизвестного типа файла
};

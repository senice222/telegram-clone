"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import SendMessage from "./send-message";
import Header from "./header";
import RightPanel from "./right-panel";

interface Props {}

const Chat: FC<Props> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null); // Добавляем реф для Header

  // Обработчик для клика вне панели
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Проверяем, был ли клик внутри панели или Header
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        headerRef.current &&
        !headerRef.current.contains(target)
      ) {
        setIsMenuOpen(false); // Закрываем панель при клике вне её области и вне Header
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Функция для обработки клика по Header
  const handleHeaderClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Останавливаем всплытие события
    setIsMenuOpen(!isMenuOpen); // Открываем/закрываем панель
  };

  return (
    <div className="w-full h-[100vh] flex">
      {/* Header, который сжимается при открытии панели */}
      <div className="w-full h-[100vh] flex flex-col">
        <div
          ref={headerRef} // Присваиваем реф для Header
          onClick={handleHeaderClick} // Обрабатываем клик по Header
          className={`transition-all duration-300 ${
            isMenuOpen ? "w-[calc(100%-25vw)]" : "w-[100%]"
          }`}
        >
          <Header />
        </div>

        <div className="flex w-full h-full">
          {/* Основной контент страницы, который тоже сжимается при открытии панели */}
          <div
            className={`transition-all flex flex-col h-full items-center duration-300 ${
              isMenuOpen ? "w-[calc(100%-25vw)]" : "w-[100%]"
            }`}
          >
            <div className="w-[728px] h-[calc(100%-20px)]">
              <div className="h-[calc(100%-56px)]"></div>
              <SendMessage />
            </div>
          </div>

          {/* Панель, которая выезжает справа */}
        </div>
      </div>

      <RightPanel menuRef={menuRef} isMenuOpen={isMenuOpen} setMenuOpen={setIsMenuOpen}/>
    </div>
  );
};

export default Chat;

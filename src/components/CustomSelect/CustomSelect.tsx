import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom"; // 1. Імпортуємо портал
import { ChevronDown } from "lucide-react";
import "./CustomSelect.css";

export type SelectOption<T> = {
  value: T;
  label: string;
};

type CustomSelectProps<T> = {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
};

export const CustomSelect = <T extends string>({
  value,
  options,
  onChange,
}: CustomSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  // Стан для збереження координат кнопки
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Функція відкриття/закриття з вирахуванням координат
  const toggle = () => {
    if (!isOpen && containerRef.current) {
      // Отримуємо розміри та позицію кнопки на екрані
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 4, // 4px відступ вниз
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setIsOpen(!isOpen);
  };

  // Закриття при кліку зовні (оновлена логіка для порталу)
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      // Перевіряємо, чи клік був НЕ по кнопці і НЕ по випадаючому списку
      const dropdownElement = document.querySelector(".custom-select-dropdown");
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        dropdownElement &&
        !dropdownElement.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    // Додаємо слухач з { capture: true } для надійнішого перехоплення подій
    document.addEventListener("click", handleClickOutside, { capture: true });
    // Також закриваємо при скролі сторінки, щоб список не "відлітав"
    window.addEventListener("scroll", () => setIsOpen(false), {
      capture: true,
    });

    return () => {
      document.removeEventListener("click", handleClickOutside, {
        capture: true,
      });
      window.removeEventListener("scroll", () => setIsOpen(false), {
        capture: true,
      });
    };
  }, [isOpen]);

  const currentLabel = options.find((opt) => opt.value === value)?.label;

  // JSX випадаючого списку
  const dropdownMenu = (
    <div
      className="custom-select-dropdown"
      // Задаємо позицію динамічно через стилі
      style={{
        position: "fixed", // Тепер він фіксований відносно вікна
        top: coords.top,
        left: coords.left,
        width: coords.width,
      }}
    >
      {options.map((opt) => (
        <div
          key={opt.value}
          className={`custom-select-option ${value === opt.value ? "selected" : ""}`}
          onClick={(e) => {
            e.stopPropagation(); // Зупиняємо спливання події
            onChange(opt.value);
            setIsOpen(false);
          }}
        >
          {opt.label}
        </div>
      ))}
    </div>
  );

  return (
    <div className="custom-select-container" ref={containerRef}>
      <div
        className={`custom-select-trigger ${isOpen ? "focused" : ""}`}
        onClick={toggle}
      >
        <span>{currentLabel}</span>
        <ChevronDown
          size={18}
          className={`select-arrow ${isOpen ? "open" : ""}`}
        />
      </div>

      {/* Рендеримо список через Портал прямо в body */}
      {isOpen && createPortal(dropdownMenu, document.body)}
    </div>
  );
};

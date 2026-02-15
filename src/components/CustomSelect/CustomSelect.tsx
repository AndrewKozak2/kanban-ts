import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
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

    document.addEventListener("click", handleClickOutside, { capture: true });
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

  const dropdownMenu = (
    <div
      className="custom-select-dropdown"
      style={{
        position: "fixed",
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
            e.stopPropagation();
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
      {isOpen && createPortal(dropdownMenu, document.body)}
    </div>
  );
};

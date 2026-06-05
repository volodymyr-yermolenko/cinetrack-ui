import { useClickOutside } from "@/lib/hooks/use-click-outside";
import { ChevronDown, User } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

type DropDownButtonOption =
  | {
      label: string;
      type: "button";
      onClick: () => void;
    }
  | {
      label: string;
      type: "link";
      href: string;
    };

interface DropDownButtonProps {
  name: string;
  options: DropDownButtonOption[];
}

export function DropDownButton({ name, options }: DropDownButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  useClickOutside(panelRef, () => setIsOpen(false));

  const handleButtonClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative w-max">
      <button
        className="py-1 px-4 flex items-center justify-center text-gray-700 hover:text-blue-600 border-gray-300 hover:border-blue-500 border rounded-lg transition-colors cursor-pointer"
        type="button"
        onClick={handleButtonClick}
      >
        <User className="w-4 h-4 mr-2" />
        <span>{name}</span>
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>
      {isOpen && (
        <div
          className="absolute top-9 left-0 min-w-full whitespace-nowrap bg-white z-1000 border border-gray-200 rounded-lg shadow"
          ref={panelRef}
        >
          <ul>
            {options.map((option) => (
              <li key={option.label}>
                {option.type === "button" ? (
                  <button
                    className="block px-4 py-2 hover:bg-gray-100 w-full text-left cursor-pointer"
                    onClick={() => {
                      option.onClick();
                      setIsOpen(false);
                    }}
                    type="button"
                  >
                    {option.label}
                  </button>
                ) : (
                  <Link
                    href={option.href}
                    className="block px-4 py-2 hover:bg-gray-100 w-full text-left cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    {option.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

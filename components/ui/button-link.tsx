"use client";

interface ButtonLinkProps {
  onClick: () => void;
  children: React.ReactNode;
}

export default function ButtonLink({ onClick, children }: ButtonLinkProps) {
  return (
    <button
      className="hover:text-blue-600 transition-colors cursor-pointer"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

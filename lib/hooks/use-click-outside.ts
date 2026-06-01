import { useEffect } from "react";

export function useClickOutside(
  elementRef: React.RefObject<HTMLElement | null>,
  clickOutsideHandler: () => void,
) {
  useEffect(() => {
    const listener = (event: Event) => {
      if (
        !elementRef.current ||
        elementRef.current.contains(event.target as Node)
      ) {
        return;
      }
      clickOutsideHandler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [clickOutsideHandler]);
}

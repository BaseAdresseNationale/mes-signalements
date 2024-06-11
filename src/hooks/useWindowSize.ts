import { useState, useEffect } from "react";

export const MOBILE_BREAKPOINT = 768;

function getSize() {
  return {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth,
  };
}

function useWindowSize() {
  const [windowSize, setWindowSize] = useState(getSize());
  const [isMobile, setIsMobile] = useState(false);

  const onResize = () => {
    const size = getSize();
    setWindowSize(size);
    setIsMobile(size.innerWidth <= MOBILE_BREAKPOINT);
  };

  useEffect(() => {
    onResize();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return { windowSize, isMobile };
}

export default useWindowSize;

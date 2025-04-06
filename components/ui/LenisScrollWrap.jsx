"use client";

import { ReactLenis } from "@studio-freight/react-lenis";

const SmoothScrollWrapper = ({ children }) => {
  return (
    <ReactLenis root options={{ duration: 3, smooth: true }} className="lenisroot">
      {children}
    </ReactLenis>
  );
};

export default SmoothScrollWrapper;

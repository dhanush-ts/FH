"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
// import "lenis/lenis.css";

gsap.registerPlugin(ScrollTrigger);

const SmoothScrollWrapper = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 2, // Increase this for smoother (slower) scrolling
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // EaseOutExpo
      smooth: true,
      smoothTouch: true, // Enable smooth scrolling on touch devices
      touchMultiplier: 2, // Optional: tweak for more/less momentum
      gestureOrientation: 'vertical', // or 'both'
      autoRaf: false, // You're controlling raf manually
    });
    

    lenisRef.current = lenis;

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    // Lenis x GSAP ScrollTrigger sync
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // seconds → ms
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(() => lenis.raf);
      lenis.destroy();
    };
  }, []);

  return <div className="lenis-wrapper">{children}</div>;
};

export default SmoothScrollWrapper;

// "use client";

// import { useRef } from "react";
// import {
//   motion,
//   useScroll,
//   useSpring,
//   useTransform,
//   useMotionValue,
//   useVelocity,
//   useAnimationFrame
// } from "framer-motion";
// import { wrap } from "@motionone/utils";
// import { cn } from "@/lib/utils";

// export default function ParallaxText({ children, className, baseVelocity = 100 }) {
//   const baseX = useMotionValue(0);
//   const { scrollY } = useScroll();
//   const scrollVelocity = useVelocity(scrollY);
//   const smoothVelocity = useSpring(scrollVelocity, {
//     damping: 50,
//     stiffness: 400
//   });
//   const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
//     clamp: false
//   });

//   const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);
//   const directionFactor = useRef(1);

//   useAnimationFrame((t, delta) => {
//     let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
//     if (velocityFactor.get() < 0) {
//       directionFactor.current = -1;
//     } else if (velocityFactor.get() > 0) {
//       directionFactor.current = 1;
//     }
//     moveBy += directionFactor.current * moveBy * velocityFactor.get();
//     baseX.set(baseX.get() + moveBy);
//   });

//   return (
//     <div className={cn("overflow-hidden whitespace-nowrap tracking-tighter leading-[0.8] m-0 flex flex-nowrap",className)}>
//       <motion.div
//         className="font-semibold uppercase flex whitespace-nowrap flex-nowrap"
//         style={{ x }}
//       >
//         <span className="mr-[30px]">{children}</span>
//         <span className="mr-[30px]">{children}</span>
//         <span className="mr-[30px]">{children}</span>
//         <span className="mr-[30px]">{children}</span>
//         <span className="mr-[30px]">{children}</span>
//         <span className="mr-[30px]">{children}</span>
//         <span className="mr-[30px]">{children}</span>
//         <span className="mr-[30px]">{children}</span>
//         <span className="mr-[30px]">{children}</span>
//         <span className="mr-[30px]">{children}</span>
//         <span className="mr-[30px]">{children}</span>
//         <span className="mr-[30px]">{children}</span>
//         <span className="mr-[30px]">{children}</span>
//         <span className="mr-[30px]">{children}</span>
//         <span className="mr-[30px]">{children}</span>
//         <span className="mr-[30px]">{children}</span>
//         <span className="mr-[30px]">{children}</span>
//         <span className="mr-[30px]">{children}</span>
//         <span className="mr-[30px]">{children}</span>
//       </motion.div>
//     </div>
//   );
// }

// export function ScrollText() {
//   return (
//     <section className="relative pt-[85vh] pb-[85vh] bg-purple-700 text-white">
//       <ParallaxText baseVelocity={-5}>Framer Motion</ParallaxText>
//       <ParallaxText baseVelocity={5}>Scroll velocity</ParallaxText>
//     </section>
//   );
// }

"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame
} from "framer-motion";
import { wrap } from "@motionone/utils";
import { cn } from "@/lib/utils";

export default function ParallaxText({ children, className }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  // Limit the velocity factor to a reasonable range
  const velocityFactor = useTransform(smoothVelocity, v => {
    const limited = Math.min(Math.abs(v) / 100, 0.35); // cap speed here (1.5 is max)
    return v < 0 ? -limited : limited;
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);
  const directionFactor = useRef(1);

  useAnimationFrame((t, delta) => {
    const velocity = velocityFactor.get();

    if (velocity === 0) return;

    directionFactor.current = velocity < 0 ? -1 : 1;

    const moveBy = directionFactor.current * Math.abs(velocity) * (delta / 1000) * 30; // tweak `30` for overall speed
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div
      className={cn(
        "overflow-hidden whitespace-nowrap tracking-tighter leading-[0.8] m-0 flex flex-nowrap",
        className
      )}
    >
      <motion.div
        className="font-semibold uppercase flex whitespace-nowrap flex-nowrap"
        style={{ x }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="mr-[30px]">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function ScrollText() {
  return (
    <section className="relative pt-[85vh] pb-[85vh] bg-purple-700 text-white">
      <ParallaxText>Framer Motion</ParallaxText>
      <ParallaxText>Scroll velocity</ParallaxText>
    </section>
  );
}

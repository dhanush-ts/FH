import { useRef, useEffect } from "react";
import Lottie from "lottie-react";
import { useInView } from "framer-motion";

const OptimizedLottie = ({ animationData }) => {
  const containerRef = useRef(null);
  const lottieRef = useRef();
  
  // Using 0.5 threshold for 50% visibility
  const isInView = useInView(containerRef, { threshold: 0.5 });

  useEffect(() => {
    if (isInView) {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.stop();
    }
  }, [isInView]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[300px] md:h-[400px] lg:h-[500px]"
      aria-label="Coding journey animation"
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={true} // loop only when in view
        autoplay={false} // controlled via useEffect
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default OptimizedLottie;

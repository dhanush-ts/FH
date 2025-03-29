"use client";

import { Suspense } from "react";
import Lottie from "lottie-react";
import Loading from "@/app/loading";

const DisplayLottie = ({ animationData }) => {
  return (
    <Suspense fallback={<Loading />}>
      <Lottie animationData={animationData} loop autoplay />
    </Suspense>
  );
};

export default DisplayLottie;

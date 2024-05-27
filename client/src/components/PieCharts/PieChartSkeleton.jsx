import React from "react";

const PieChartSkeleton = () => {
  return (
    <div className="rounded w-[380px] max-w-[500px] h-[380px] max-h-[500px]">
      <div className="relative h-60 mb-4 flex justify-center bg-gray-300 animate-pulse"></div>
    </div>
  );
};

export default PieChartSkeleton;

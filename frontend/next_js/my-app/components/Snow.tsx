"use client";

import Snowfall from "react-snowfall";

export default function Snow() {
  const now = new Date();
  const month = now.getMonth(); // 0 = январь, 11 = декабрь

  const isWinter =
    month === 11 || // декабрь
    month === 0 ||  // январь
    month === 1;    // февраль

  if (!isWinter) return null;

  return (
    <Snowfall
      color="#76a3dbff"
      snowflakeCount={250}
      style={{
        position: "fixed",
        width: "200vw",
        height: "200vh",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}

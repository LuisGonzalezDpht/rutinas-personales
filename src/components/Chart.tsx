"use client";

import { useEffect, useRef } from "react";
import { createChart, LineSeries, Time } from "lightweight-charts";

export interface LinePoint {
  time: Time;
  value: number;
}

export interface ChartSeries {
  id: string;
  name?: string;
  color?: string;
  data: LinePoint[];
}

export interface ChartProps {
  series: ChartSeries[];
}

export default function Chart({ series }: ChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 400,
      layout: {
        textColor: "white",
        background: { color: "#121212" },
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "#333" },
        horzLines: { color: "#333" },
      },
      timeScale: {
        borderColor: "#333",
      },
      autoSize: true,
    });

    // crear cada serie
    series.forEach((s) => {
      const line = chart.addSeries(LineSeries, {
        color: s.color ?? "#2962FF",
        lineWidth: 2,
        priceLineVisible: false,
      });
      line.setData(s.data);
    });

    const handleResize = () => {
      chart.applyOptions({ width: containerRef.current?.clientWidth ?? 400 });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      chart.remove();
      window.removeEventListener("resize", handleResize);
    };
  }, [series]);

  return <div ref={containerRef} className="w-full h-[400px]" />;
}

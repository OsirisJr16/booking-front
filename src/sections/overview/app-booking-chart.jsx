/* eslint-disable */
import React from "react";
import ApexChart from 'react-apexcharts';
import CircularProgress from "@mui/material/CircularProgress";
import useBookingCountsByMonth from "./app-count-by-month";

export default function BookingCountsByMonthChart() {
  const chartOptions = useBookingCountsByMonth();

  return (
    <div>
      {Object.keys(chartOptions).length ? (
        <ApexChart
          options={chartOptions}
          series={chartOptions.series}
          type="bar"
          width="100%"
          height="364"
        />
      ) : (
        <CircularProgress />
      )}
    </div>
  );
}
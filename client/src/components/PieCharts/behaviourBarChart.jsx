import { useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { fetchData } from "../../services/dataProcessing";
import { tokens } from "../../theme";

function BehaviourBarChart() {
  const [frequencyData, setFrequencyData] = useState([]);
  const [categories, setCategories] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Move fetch to another file

  useEffect(() => {
    async function fetchFrequencyData() {
      const frequencyDataFetched = await fetchData(
        "transactions/get/spendings/top5",
        "top5Spendings"
      );
      const frequencies = Object.values(frequencyDataFetched);
      const categoreisFetched = Object.keys(frequencyDataFetched);
      setFrequencyData(frequencies);
      setCategories(categoreisFetched);
    }
    fetchFrequencyData();
  }, []);

  const data = {
    series: [
      {
        data: frequencyData,
      },
    ],
    options: {
      chart: {
        foreColor: colors.grey[100],
        type: "bar",
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: "end",
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: categories,
      },
    },
  };

  return (
    <>
      <Chart
        options={data.options}
        series={data.series}
        type="bar"
        height="80%"
        width="30%"
      />
    </>
  );
}

export default BehaviourBarChart;

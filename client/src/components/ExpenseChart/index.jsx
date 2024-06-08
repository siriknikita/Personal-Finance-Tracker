import { useTheme } from "@emotion/react";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { tokens } from "../../theme";
import { fetchData } from "../../services/dataProcessing";

function ExpenseChart({ userID }) {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const colors = tokens(mode);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    async function fetchExpenseData() {
      const expenseData = await fetchData(
        `transactions/get/expenseData/${userID}`,
        "data"
      );
      const seriesData = [{ name: "Expense", data: expenseData }];
      setSeries(seriesData);
    }
    fetchExpenseData();
    // eslint-disable-next-line
  }, []);

  const options = {
    chart: {
      type: "area",
      foreColor: colors.grey[100],
      height: 350,
      animations: {
        initialAnimation: {
          enabled: false,
        },
      },
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: "zoom",
      },
    },
    markers: {
      size: 0,
    },
    title: {
      text: "Your expenses movement",
      align: "left",
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      type: "datetime",
    },
    tooltip: {
      theme: mode,
    }
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={350}
          margin={{ top: 10, right: 20, bottom: 20, left: 10 }}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
}

export default ExpenseChart;

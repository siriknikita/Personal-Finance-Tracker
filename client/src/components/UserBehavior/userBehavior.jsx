import { useTheme } from "@mui/material";
import React, { useLayoutEffect, useState } from "react";
import Chart from "react-apexcharts";
import { tokens } from "../../theme";
import { getUsersSpending } from "../../utils/categories";

const UserBehavior = () => {
  const [moneySpentData, setMoneySpentData] = useState({});
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useLayoutEffect(() => {
    async function fetchData() {
      const data = await getUsersSpending();
      setMoneySpentData(data);
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  const categoriesNames = Object.keys(moneySpentData);
  const moneySpentOnCategories = Object.values(moneySpentData);

  // Move this object creation separately

  const data = {
    series: moneySpentOnCategories,
    options: {
      chart: {
        foreColor: colors.grey[100],
        width: 380,
        type: "pie",
      },
      labels: categoriesNames,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  return (
    <>
      <Chart
        options={data.options}
        series={data.series}
        type="pie"
        height="100%"
        width="30%"
      />
    </>
  );
};

export default UserBehavior;

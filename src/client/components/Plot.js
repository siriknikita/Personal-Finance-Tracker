import Plotly from "plotly.js-dist";
import React, { useEffect } from "react";

function plotExpenseStat(divID, categories, moneySpent) {
    const layout = { title: "Money spent on each category" };
    const data = [{ labels: categories, values: moneySpent, type: "pie" }];
    Plotly.newPlot(divID, data, layout);
}

function PlotStatistics({ categories, moneySpent }) {
    useEffect(() => {
        plotExpenseStat("chartDiv", categories, moneySpent);
    }, [categories, moneySpent]);

    return <div id='chartDiv'></div>;
}

export default PlotStatistics;

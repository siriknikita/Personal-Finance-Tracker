import Plotly from "plotly.js-dist";
import React, { useEffect } from "react";

function plotExpenseStat(divID, categories, moneySpent) {
    const layout = { title: "Money spent on each category" };
    const data = [{ labels: categories, values: moneySpent, type: "pie" }];
    Plotly.newPlot(divID, data, layout);
}

function PlotStatistics({ showDashboard, categories, moneySpent }) {
    useEffect(() => {
        if (showDashboard) {
            plotExpenseStat("chartDiv", categories, moneySpent);
        }
    }, [showDashboard, categories, moneySpent]);

    return <div id='chartDiv'></div>;
}

export default PlotStatistics;

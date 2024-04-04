import React from 'react'
import PlotStatistics from './Plot'

async function fetchData(url) {
    try {
        let response = await fetch(`${process.env.REACT_APP_API_URL}/api/${url}`);
        let data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Error loading data: ${error}`);
    }
}

async function fetchMoneySpent(userID) {
    return fetchData(`get/transactions/moneySpent/${userID}`);
}

async function fetchTransactionCategories(userID) {
    return fetchData(`get/transactions/categories/${userID}`);
}

function PieChart({ userID }) {
    console.log("UserID:");
    console.log(userID);
    const categories = fetchTransactionCategories(userID);
    const moneySpent = fetchMoneySpent(userID);

    return (
        <div>
            <PlotStatistics categories={categories} moneySpent={moneySpent} />
        </div>
    )
}

export default PieChart

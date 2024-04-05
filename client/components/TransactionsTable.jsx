import React from 'react'

function TransactionsTable({ transactions }) {
    return (
        <table>
            {/* Table headers */}
            <thead>
                <tr>
                    <th>TransactionID</th>
                    <th>Amount</th>
                    <th>CategoryID</th>
                    <th>TransactionDate</th>
                </tr>
            </thead>
            {/* Table body */}
            <tbody>
                {/* The key is required for each mapped element in React lists */}
                {transactions?.map((transaction) => (
                    <tr key={transaction?.TransactionID}> {/* Use TransactionID as the unique key */}
                        <td>{transaction?.TransactionID}</td>
                        <td>{transaction?.Amount}</td>
                        <td>{transaction?.CategoryID}</td>
                        <td>{transaction?.TransactionDate}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default TransactionsTable

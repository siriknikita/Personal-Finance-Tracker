import "./History.css";
import React, { useMemo } from "react";
import { useTable } from "react-table";

function PlotHistory({ transactions }) {
    const data = useMemo(() => transactions, []);
    const columns = useMemo(
        () => [
            {
                Header: "TransactionID",
                accessor: "TransactionID",
            },
            {
                Header: "UserID",
                accessor: "UserID",
            },
            {
                Header: "Amount",
                accessor: "Amount",
            },
            {
                Header: "CategoryID",
                accessor: "CategoryID",
            },
            {
                Header: "TransactionDate",
                accessor: "TransactionDate",
            },
        ],
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data });

    return (
        <div className="container">
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()}>
                                    {column.render("Header")}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => (
                                    <td {...cell.getCellProps()}> {cell.render("Cell")} </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default PlotHistory;

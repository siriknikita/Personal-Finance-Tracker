import Box from "@mui/material/Box";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts";
import { fetchData } from "../../services/dataProcessing";
import styles from "../styles.module.css";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("categoryID", {
    header: () => "Category Name",
    cell: (info) => <>{info.getValue()}</>,
  }),
  columnHelper.accessor("amount", {
    header: () => "Amount",
    cell: (info) => <>{info.getValue()}</>,
  }),
];

function TransactionsTable() {
  const { user } = useContext(UserContext);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  // Do not use fetch func in components and not two in order

  useEffect(() => {
    async function fetchTransactions() {
      const fetchedTransactionsData = await fetchData(
        `transactions/get/${user.userID}`,
        "transactions"
      );
      const fetchedCategories = await fetchData(
        `transactions/get/categories/${user.userID}`,
        "categories"
      );
      setTransactions(fetchedTransactionsData);
      setCategories(fetchedCategories);
    }

    fetchTransactions();
  }, [user.userID]);

  const table = useReactTable({
    data: transactions,
    columns,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Box>
      <Box className={styles.container + "content"}>
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {transactions?.map((transaction, index) => (
              <tr key={transaction?.id}>
                <td>{categories[index]}</td>
                <td>{transaction?.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
}

export default TransactionsTable;

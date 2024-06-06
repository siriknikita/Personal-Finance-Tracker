import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts";
import { fetchData } from "../../services/dataProcessing";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("categoryID", {
    header: () => "Category",
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

  useEffect(() => {
    async function fetchTransactions() {
      const fetchedTransactionsData = await fetchData(
        `transactions/get/${user.userID}`,
        "transactions"
      );
      const fetchedCategoriesData = await fetchData(
        `transactions/get/categories/${user.userID}`,
        "categories"
      );

      const fetchedTransactions = fetchedTransactionsData.reverse();
      const fetchedCategories = fetchedCategoriesData.reverse();

      setTransactions(fetchedTransactions);
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
    <div className="overflow-x-auto">
      <table className="table table-pin-rows table-sm table-md table-lg">
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
            <tr key={transaction?.id} className="hover">
              <td>{categories[index]}</td>
              <td>{transaction?.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionsTable;

import Box from "@mui/material/Box";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { fetchData } from "../../services/dataProcessing";
import { formTableColumns } from "../../utils/tables";
import styles from "../styles.module.css";

function GoalTable() {
  const { user } = useContext(UserContext);
  const [goals, setGoals] = useState([]);
  const columns = formTableColumns(["userID", "description", "deadline"]);

  const table = useReactTable({
    data: goals,
    columns,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    async function fetchGoals() {
      const data = await fetchData(`goals/get/${user.userID}`);
      setGoals(data.goals);
    }
    fetchGoals();
  }, [user.userID]);

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
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
}

export default GoalTable;

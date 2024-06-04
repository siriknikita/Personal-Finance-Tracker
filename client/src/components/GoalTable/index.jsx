import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts";
import { fetchData } from "../../services/dataProcessing";
import { formTableColumns } from "../../utils/tables";

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
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Job</th>
            <th>Favorite Color</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          <tr>
            <th>1</th>
            <td>Cy Ganderton</td>
            <td>Quality Control Specialist</td>
            <td>Blue</td>
          </tr>
          {/* row 2 */}
          <tr className="hover">
            <th>2</th>
            <td>Hart Hagerty</td>
            <td>Desktop Support Technician</td>
            <td>Purple</td>
          </tr>
          {/* row 3 */}
          <tr>
            <th>3</th>
            <td>Brice Swyre</td>
            <td>Tax Accountant</td>
            <td>Red</td>
          </tr>
        </tbody>
      </table>
    </div>
    // <div>
    //   <table>
    //     <thead>
    //       {table.getHeaderGroups().map((headerGroup) => (
    //         <tr key={headerGroup.id}>
    //           {headerGroup.headers.map((header) => (
    //             <th key={header.id}>
    //               {flexRender(
    //                 header.column.columnDef.header,
    //                 header.getContext()
    //               )}
    //             </th>
    //           ))}
    //         </tr>
    //       ))}
    //     </thead>
    //     <tbody>
    //       {table.getRowModel().rows.map((row) => (
    //         <tr key={row.id}>
    //           {row.getVisibleCells().map((cell) => (
    //             <td key={cell.id}>
    //               {flexRender(cell.column.columnDef.cell, cell.getContext())}
    //             </td>
    //           ))}
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    // </div>
  );
}

export default GoalTable;

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { fetchData } from "../services/dataProcessing";
import { formTableColumns } from "../utils/tables";

export default function Table({ fetchUrl, dataKey, columnsAccessors }) {
  const [tableData, setTableData] = useState([]);

  const columns = formTableColumns(columnsAccessors);

  const table = useReactTable({
    data: tableData,
    columns,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    async function fetchTableData() {
      const fetchedTableData = await fetchData(fetchUrl, dataKey);
      setTableData(fetchedTableData);
    }
    fetchTableData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
         {table.getRowModel().rows.map((row) => (
           <tr key={row.id} className="hover">
             {row.getVisibleCells().map((cell) => (
               <td key={cell.id}>
                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
               </td>
             ))}
           </tr>
         ))}
        </tbody>
      </table>
    </div>
    // <div>
    // <table>
    //   <thead>
    //     {table.getHeaderGroups().map((headerGroup) => (
    //       <tr key={headerGroup.id}>
    //         {headerGroup.headers.map((header) => (
    //           <th key={header.id}>
    //             {flexRender(
    //               header.column.columnDef.header,
    //               header.getContext()
    //             )}
    //           </th>
    //         ))}
    //       </tr>
    //     ))}
    //   </thead>
    //   <tbody>
    //     {table.getRowModel().rows.map((row) => (
    //       <tr key={row.id}>
    //         {row.getVisibleCells().map((cell) => (
    //           <td key={cell.id}>
    //             {flexRender(cell.column.columnDef.cell, cell.getContext())}
    //           </td>
    //         ))}
    //       </tr>
    //     ))}
    //   </tbody>
    // </table>
    // </div>
  );
}

import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

function titleCase(str) {
  str = str.toLowerCase().split(" ");
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
}

export function formTableColumns(columns) {
  let formedColumns = [];
  for (let column of columns) {
    formedColumns.push(
      columnHelper.accessor(column, {
        header: () => titleCase(column),
        cell: (info) => <>{info.getValue()}</>,
      })
    );
  }
  return formedColumns;
}

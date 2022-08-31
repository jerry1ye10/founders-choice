import _ from "lodash";
import { useMemo, useState } from "react";
import { useTable, useGlobalFilter } from "react-table";
import Fuse from "fuse.js";

const RANKING_COLUMNS = [
  {
    Header: "Rank",
    accessor: "index",
  },
  {
    id: "display",
    Header: "Name",
    Cell: ({ value: { image, name } }) => (
      <span>
        <img className="object-scale-down bg-white inline w-10 h-10 mr-2 my-1" src={image} />
        {name}
      </span>
    ),
    accessor: ({ image, name }) => ({ image, name }),
  },
  {
    accessor: "name",
    Header: () => <></>,
    Cell: () => <></>,
  },
];

function GlobalFilter({ globalFilter, setGlobalFilter }) {
  const [value, setValue] = useState(globalFilter);
  const onChange = _.debounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <input
      className="text-black text-2xl p-2 w-full"
      value={value || ""}
      onChange={(e) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
      placeholder="Search firms by name..."
    />
  );
}

export const Ranking = ({ data }) => {
  const fuse = useMemo(() => new Fuse(data, { keys: ["name"] }), []);
  const globalFilter = useMemo(
    () =>
      function (rows, columnIds, filter) {
        return fuse.search(filter).map((e) => e.item);
      },
    [fuse]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    state,
    prepareRow,
    visibleColumns,
    setGlobalFilter,
  } = useTable(
    {
      columns: RANKING_COLUMNS,
      data,
    },
    useGlobalFilter
  );

  // Render the UI for your table
  return (
    <table
      style={{
        "table-layout": "fixed",
      }}
      {...getTableProps()}
      className="raleway font-extralight bg-gray-300 w-full"
    >
      <thead className="w-full">
        <tr className="bg-gray-400 w-full">
          <th
            className="w-full p-8"
            colSpan={visibleColumns.length}
            style={{
              textAlign: "left",
            }}
          >
            <GlobalFilter
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </th>
        </tr>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                className="text-3xl border-b border-black font-extralight text-left px-6 py-2"
                {...column.getHeaderProps()}
              >
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
            <tr
              className="text-2xl font-light text-left"
              {...row.getRowProps()}
            >
              {row.cells.map((cell) => {
                return (
                  <td className="px-6" {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

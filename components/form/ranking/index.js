import _ from "lodash";
import { useState } from "react";
import Link from "next/link";
import {
  useTable,
  useGlobalFilter,
  useFlexLayout,
  usePagination,
} from "react-table";
import Paginate from "react-paginate";

const RANKING_COLUMNS = [
  {
    Header: () => <div className="">#</div>,
    Cell: ({ value }) => (
      <div className="flex items-center w-8 h-8 my-1">{value}</div>
    ),
    accessor: "index",
    minWidth: 3,
    width: 6,
    maxWidth: 15,
  },
  {
    Header: () => (
      <div className="sm:text-2xl text-xl -ml-12 sm:ml-0 sm:block hidden">
        <Link href={"https://en.wikipedia.org/wiki/Elo_rating_system"}>
          <a class="underline text-blue-400">Elo</a>
        </Link>
      </div>
    ),
    accessor: "elo",
    Cell: ({ value }) => (
      <div className="sm:text-2xl text-xl -ml-12 sm:ml-0 sm:block hidden w-8 h-8 my-1">
        <div className="flex items-center">{Math.round(value)} </div>
      </div>
    ),
    minWidth: 0,
    width: 15,
    maxWidth: 20,
  },
  {
    Header: () => (
      <div className="sm:text-2xl text-xl -ml-12 sm:ml-0 lg:block hidden">
        Comparisons
      </div>
    ),
    accessor: "numComparisons",
    Cell: ({ value }) => (
      <div className="sm:text-2xl text-xl -ml-12 sm:ml-0 lg:block hidden w-8 h-8 my-1">
        <div className="flex items-center">{Math.round(value)} </div>
      </div>
    ),
    minWidth: 0,
    width: 35,
    maxWidth: 40,
  },
  {
    id: "display",
    Header: "Name",
    Cell: ({ value: { image, name } }) => (
      <span className="sm:text-2xl text-xl flex content-center">
        {image ? (
          <img
            className="object-scale-down bg-white inline w-8 h-8 sm:mr-6 mr-2 my-1"
            src={image}
          />
        ) : (
          <div className="inline w-8 h-8 sm:mr-6 mr-2 my-1" />
        )}
        <div className="flex items-center">{name}</div>
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
      className="text-black sm:text-2xl text-sm p-2 w-full"
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
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    state: { globalFilter, pageIndex },
    prepareRow,
    visibleColumns,
    setGlobalFilter,
    pageOptions,
    page,
    gotoPage,
  } = useTable(
    {
      columns: RANKING_COLUMNS,
      data,
    },
    useGlobalFilter,
    useFlexLayout,
    usePagination
  );

  const handlePageClick = (event) => gotoPage(event.selected);

  // Render the UI for your table
  return (
    <>
      <div className="sm:mb-4 mb-2">
        <Paginate
          forcePage={pageIndex}
          containerClassName={`sm:mt-6 mt-2 inline-flex sm:text-lg text-xs -space-x-px`}
          previousLinkClassName={`sm:py-2 sm:px-3 p-1 ml-0 leading-tight text-black	 bg-gray-300 rounded-l-lg border hover:bg-gray-400 hover:text-gray-200`}
          pageLinkClassName={`sm:py-2 sm:px-3 p-1 leading-tight text-black bg-gray-300 border hover:bg-gray-400 hover:text-gray-200`}
          breakLinkClassName={`sm:py-2 sm:px-3 p-1 leading-tight text-black	 bg-gray-300 border hover:bg-gray-400 hover:text-gray-200`}
          activeLinkClassName={`sm:py-2 sm:px-3 p-1 text-white bg-gray-400 border hover:bg-gray-500 hover:text-white`}
          nextLinkClassName={`sm:py-2 sm:px-3 p-1 leading-tight text-black bg-gray-300 rounded-r-lg border hover:bg-gray-400 hover:text-gray-200`}
          breakLabel="..."
          nextLabel="Next"
          previousLabel="Previous"
          pageCount={pageOptions.length}
          onPageChange={handlePageClick}
        />
      </div>
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
              className="w-full sm:p-8 p-2"
              colSpan={visibleColumns.length - 1}
              style={{
                textAlign: "left",
              }}
            >
              <GlobalFilter
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </th>
          </tr>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers
                .filter((column) => column.id !== "name")
                .map((column) => {
                  return (
                    <th
                      className="sm:text-2xl text-xl border-b border-black font-extralight text-left px-6 py-2"
                      {...column.getHeaderProps()}
                    >
                      {column.render("Header")}
                    </th>
                  );
                })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr
                className="text-2xl font-light text-left"
                {...row.getRowProps()}
              >
                {row.cells
                  .filter((cell) => cell.column.id !== "name")
                  .map((cell) => {
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
    </>
  );
};

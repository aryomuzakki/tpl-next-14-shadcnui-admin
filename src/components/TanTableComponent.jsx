"use client"

import { useMemo, useState } from 'react';

import {
  // Column,
  // ColumnDef,
  // PaginationState,
  // Table,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

// column filter custom
const startsWithFilterFn = (
  row,
  columnId,
  filterValue, //resolveFilterValue will transform this to a string
) => {
  console.log(filterValue);
  return row
    .getValue(columnId)
    .toString()
    .toLowerCase()
    .trim()
    .startsWith(filterValue); // toString, toLowerCase, and trim the filter value in `resolveFilterValue`
}

// remove the filter value from filter state if it is falsy (empty string in this case)
startsWithFilterFn.autoRemove = (val) => !val;

// transform/sanitize/format the filter value before it is passed to the filter function
startsWithFilterFn.resolveFilterValue = (val) => val.toString().toLowerCase().trim();
// end of column filter custom

const pageSizeOptions = [
  10,
  25,
  50,
  75,
  100,
]

export default function TanTable({ tableData = [], columns = [], meta = {} }) {

  return (
    <>
      <MyTable
        {...{
          data: tableData,
          columns,
          meta,
        }}
      />
      {/* <hr /> */}
      {/* <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      <div>
        <button onClick={() => refreshData()}>Refresh Data</button>
      </div> */}
    </>
  );
}

function MyTable({
  data,
  columns,
  meta,
}) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const tanTableObj = useReactTable({
    columns,
    data,
    debugTable: process.env.NODE_ENV === "development",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      pagination,
    },
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
    meta,
    filterFns: {
      startsWith: startsWithFilterFn,
    }
  });

  const curFirstRowNum = tanTableObj.getRowModel().rows[0]?.index + 1 || 0;
  const curLastRowNum = tanTableObj.getRowModel().rows[tanTableObj.getRowModel().rows.length - 1]?.index + 1 || 0;

  // const columnFilterValue = column.getFilterValue();

  return (
    <div className="">

      {/* <Input
        onChange={() => column.setFilterValue(e.target.value)}
        value={columnFilterValue ?? ""}
      /> */}

      {/* <div className="mb-4">
        <Button variant="outline" className="" onClick={async () => await dataFetcher()}>Refresh Data</Button>
      </div> */}

      <Table wrapperClassName="h-[60vh] rounded-lg border">
        <TableHeader className="sticky top-0 z-[2] bg-card [&_tr]:border-0 [&_tr]:shadow-[inset_0_-1px_0] [&_tr]:shadow-border">
          {tanTableObj.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    <div
                      className="block py-1"
                    >
                      <span
                        {...{
                          className: header.column.getCanSort()
                            ? "block py-1 ml-1.5 cursor-pointer select-none py-1 hover:text-accent-foreground"
                            : "block py-1 ml-1.5 ",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted()] ?? null}
                      </span>


                      {header.column.getCanFilter() ? (
                        <div className="">
                          <ColumnFilter column={header.column} tanTableObj={tanTableObj} />
                        </div>
                      ) : null}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {tanTableObj.getRowModel().rows.map((row) => {
            return (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex flex-col items-center space-y-4 py-4">
        <div className="flex w-full flex-col items-center gap-y-4 sm:flex-row sm:justify-between">

          <div className="flex w-full items-center space-x-2 justify-center sm:justify-start">
            <p className="whitespace-nowrap text-sm font-medium">
              Baris per halaman
            </p>
            <Select
              value={`${tanTableObj.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                tanTableObj.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 min-w-16 w-auto">
                <SelectValue
                  placeholder={tanTableObj.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-full items-center justify-center gap-2 sm:justify-end">
            <div className="flex px-1 items-center justify-center text-sm font-medium shrink-0">
              Halaman {tanTableObj.getState().pagination.pageIndex + 1} dari{" "}
              {tanTableObj.getPageCount()}
            </div>
            <div className="flex items-center gap-x-2">
              <Button
                aria-label="Go to first page"
                variant="outline"
                className="flex sm:hidden h-8 w-8 p-0 md:flex"
                onClick={() => tanTableObj.setPageIndex(0)}
                disabled={!tanTableObj.getCanPreviousPage()}
              >
                <DoubleArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                aria-label="Go to previous page"
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => tanTableObj.previousPage()}
                disabled={!tanTableObj.getCanPreviousPage()}
              >
                <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                aria-label="Go to next page"
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => tanTableObj.nextPage()}
                disabled={!tanTableObj.getCanNextPage()}
              >
                <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                aria-label="Go to last page"
                variant="outline"
                className="flex sm:hidden h-8 w-8 p-0 md:flex"
                onClick={() => tanTableObj.setPageIndex(tanTableObj.getPageCount() - 1)}
                disabled={!tanTableObj.getCanNextPage()}
              >
                <DoubleArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

        </div>

        <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-between">

          <div className="flex items-center gap-2 justify-start md:justify-end text-sm text-muted-foreground">
            Menampilkan baris {curFirstRowNum} - {curLastRowNum} dari {" "}
            {tanTableObj.getRowCount().toLocaleString()} Baris
          </div>

          <div className="flex text-sm text-muted-foreground">
            {tanTableObj.getFilteredSelectedRowModel().rows.length} dari{" "}
            {tanTableObj.getFilteredRowModel().rows.length} baris dipilih.
          </div>

        </div>
      </div>

    </div>
  );
}

function ColumnFilter({
  column,
  tanTableObj,
}) {
  // const firstValue = tanTableObj
  //   .getPreFilteredRowModel()
  //   .flatRows[0]?.getValue(column.id);

  // typeof firstValue === "number" ? (
  //   <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
  //     <input
  //       type="number"
  //       value={(columnFilterValue)?.[0] ?? ""}
  //       onChange={(e) =>
  //         column.setFilterValue((old) => [
  //           e.target.value,
  //           old?.[1],
  //         ])
  //       }
  //       placeholder={`Min`}
  //       className="w-24 border shadow rounded"
  //     />
  //     <input
  //       type="number"
  //       value={(columnFilterValue)?.[1] ?? ""}
  //       onChange={(e) =>
  //         column.setFilterValue((old) => [
  //           old?.[0],
  //           e.target.value,
  //         ])
  //       }
  //       placeholder={`Max`}
  //       className="w-24 border shadow rounded"
  //     />
  //   </div>
  // ) :

  const columnFilterValue = column.getFilterValue();

  return (
    <Input
      className="min-w-24"
      onChange={(e) => column.setFilterValue(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      placeholder={`Cari...`}
      type="text"
      value={(columnFilterValue ?? "")}
    />
  );
}
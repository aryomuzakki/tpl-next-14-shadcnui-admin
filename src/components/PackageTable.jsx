"use client"

import { createColumnHelper } from "@tanstack/react-table";
import TanTable from "./TanTableComponent";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Button } from "./ui/button";
import { useState } from "react";

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault("Asia/Jakarta");

// columns

const columnHelper = createColumnHelper();

const columnData = [
  // columnHelper.accessor("packageID", {
  //   cell: (props) => props.getValue(),
  //   header: "Package ID",
  //   footer: (props) => props.column.id,
  // }),
  columnHelper.accessor("listRank", {
    cell: (props) => props.getValue(),
    header: "Showing Order",
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("packageTitle", {
    cell: (props) => props.getValue(),
    header: "Name",
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("packagePrice", {
    cell: (props) => "Rp " + props.getValue().toLocaleString("id-ID"),
    header: "Price",
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("packageMaxParticipant", {
    cell: (props) => props.getValue().toLocaleString("id-ID"),
    header: "Max",
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("stockLeft", {
    cell: (props) => props.getValue().toLocaleString("id-ID"),
    header: "Available",
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("packageDescription", {
    cell: (props) => props.getValue(),
    header: "Description",
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("updatedAt", {
    cell: (props) => {
      return dayjs(props.getValue()).tz().format("DD MMM, HH:mm WIB");
    },
    header: "Last Update",
    footer: (props) => props.column.id,
  }),
]


const PackageTable = ({ tableData, dataFetcher }) => {
  const [theTableData, setTheTableData] = useState(tableData);

  return (
    <>
      <div className="">
        <Button variant="outline" className="" onClick={async () => {
          const updated = await dataFetcher();
          setTheTableData(updated);
        }}>
          Refresh Data
        </Button>
      </div>
      <TanTable tableData={theTableData} columns={columnData} />
    </>
  )
}

export default PackageTable
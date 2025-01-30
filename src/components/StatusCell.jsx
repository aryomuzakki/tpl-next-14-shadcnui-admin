"use client"

// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

const { useState } = require("react");
const { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } = require("./ui/select");

const statusOptions = [
  "unpaid",
  "oncheck",
  "paid",
  "expired",
  "canceled",
  "invalid",
  ...[
    process.env.NODE_ENV === "development" ? [
      "demo",
      "test",
    ] : []
  ],
]

export default function StatusCell({ info }) {
  const [statusValue, setStatusValue] = useState(info.getValue());


  return (
    <>
      <Select
        value={`${statusValue}`}
        onValueChange={(opt) => {
          setStatusValue(opt);

        }}
      >
        <SelectTrigger className="h-auto">
          <SelectValue
            placeholder={statusValue}
          />
        </SelectTrigger>
        <SelectContent side="top">
          {statusOptions.map((opt) => (
            <SelectItem key={opt} value={`${opt}`}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
            {alertDialogCancelBtn && <AlertDialogCancel className={`mt-0 ${alertDialogCancelCls}`}>{alertDialogCancelBtn}</AlertDialogCancel>}
            {alertDialogActionBtn && <AlertDialogAction onClick={alertDialogActionHandler} className={`${alertDialogActionCls ? alertDialogActionCls : "bg-red-600 hover:bg-green-700"}`}>{alertDialogActionBtn}</AlertDialogAction>}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </>
  )
}
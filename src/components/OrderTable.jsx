"use client"

import { createColumnHelper } from "@tanstack/react-table";
import StatusCell from "./StatusCell";
import TanTable from "./TanTableComponent";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "./ui/dialog";
import { useCallback, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import debounce from "lodash.debounce";
import { Minus, Plus, Trash } from "lucide-react";
import cloneDeep from "lodash.clonedeep";
import { toast } from "sonner";

// column table set up
const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("order.orderID", {
    cell: (props) => props.getValue(),
    header: "Order ID",
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("order.userFullName", {
    cell: (props) => props.getValue(),
    header: "Nama Lengkap",
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor((row) => {
    return row.orderItems.map((item) => {
      return `${item.package.packageTitle}`
    }).join(", ");
  }, {
    id: "orderItemsString",
    cell: (props) => props.getValue(),
    header: "Package(s)",
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("order.userWhatsappNumber", {
    header: "WhatsApp",
    footer: (props) => props.column.id,
  },
  ),
  columnHelper.accessor("order.status", {
    header: "Status",
    // cell: (info) => <StatusCell info={info} />,
    cell: (props) => props.getValue(),
    footer: (props) => props.column.id,
    filterFn: "startsWith",
  }),
  {
    id: "actions",
    header: "Tindakan",
    enableHiding: false,
    cell: (info) => {
      return (
        <OrderTableAction info={info} />
      )
    },
  },
];
// end of column table set up

const OrderTable = ({ tableData, dataFetcher }) => {
  const [theTableData, setTheTableData] = useState(tableData);

  const refreshData = async () => {
    const updated = await dataFetcher();
    setTheTableData(updated.data);
  }

  const meta = {
    refreshData,
  }

  return (
    <>
      <div className="">
        <Button variant="outline" className="" onClick={async () => await refreshData()}>
          Refresh Data
        </Button>
      </div>
      <TanTable tableData={theTableData} columns={columns} meta={meta} />
    </>
  )
}

export default OrderTable;

const statusOptions = [
  "unpaid",
  "oncheck",
  "paid",
  "expired",
  "canceled",
  "invalid",
  ...(process.env.NODE_ENV === "development" ? ["demo", "test"] : []),
]

const OrderTableAction = ({ info }) => {
  const [dialogStatusOpen, setDialogStatusOpen] = useState(false);
  const [dialogEditOpen, setDialogEditOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContentData, setDialogContentData] = useState(<></>);

  // const [statusValue, setStatusValue] = useState(info.row.original.order.status);
  const [currentData, setCurrentData] = useState(cloneDeep(info.row.original));

  const onDialogStatusOpenChange = (isOpen) => {
    if (isOpen === true) {
      return;
    };
    setDialogStatusOpen(false);
    setCurrentData({});
  }

  const onDialogOpenChange = (isOpen) => {
    if (isOpen === true) {
      return;
    };
    setDialogOpen(false);
    setCurrentData({});
  }

  const handleDebouncedInput = (ev) => {
    const currentOrderData = { ...currentData };

    ev.target.parentNode.parentNode.querySelectorAll("input").forEach((inputEl) => {
      currentOrderData.order[inputEl.id] = inputEl.value;
    })

    setCurrentData(currentOrderData);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleInputForm = useCallback(debounce(handleDebouncedInput, 500), []);

  const changeStatus = (newStatus) => {
    const newData = { ...currentData };
    newData.order.status = newStatus;
    setCurrentData(newData);
  }

  const updateStatus = async () => {
    const loadingToastID = toast.loading(`Mengupdate Status ke "${currentData?.order?.status}"`);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/${currentData.order.orderID}/status`, {
        method: "PATCH",
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: currentData?.order?.status,
        })
      })
      const result = await res.json();
      if (res.status === 200) {
        await info.table.options.meta?.refreshData();
        toast.success(`BERHASIL! Status di Update Menjadi '${currentData?.order?.status}' Pada Order Id ${currentData?.order?.orderID}`, {
          id: loadingToastID,
          duration: 10000,
        });
      } else {
        if (process.env.NODE_ENV === "development") console.log(result);
        console.error(result.message);
        if (res.status === 404 && result?.message?.toLowerCase()?.includes("order not found")) {
          toast.error(`Tidak Dapat Menemukan Order ID ${currentData?.order?.orderID}`, {
            id: loadingToastID,
            duration: 10000,
          });
        } else if (res.status === 404 && result?.message?.toLowerCase()?.includes("not found")) {
          toast.error(`Tidak Dapat Menemukan URL! Hub. Admin!`, {
            id: loadingToastID,
            duration: 10000,
          });
        } else {
          toast.error(`Gagal Mengubah Status Menjadi '${currentData?.order?.status}' Pada Order ID ${currentData?.order?.orderID}`, {
            id: loadingToastID,
            duration: 10000,
          });
        }
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") console.error(err);
      console.error(err.message);
      toast.error(`Gagal Mengubah Status Menjadi '${currentData?.order?.status}' Pada Order ID ${currentData?.order?.orderID}`, {
        id: loadingToastID,
        duration: 10000,
      });
    }
  }

  const deleteData = async () => {
    const loadingToastID = toast.loading(`Menghapus data "${currentData?.order?.status}"`);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/${currentData.order.orderID}`, {
        method: "DELETE",
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const result = await res.json();
      if (res.status === 200) {
        await info.table.options.meta?.refreshData();
        toast.success(`BERHASIL! Order ID ${currentData?.order?.orderID} Telah Dihapus`, {
          id: loadingToastID,
          duration: 10000,
        });
      } else {
        if (process.env.NODE_ENV === "development") console.log(result);
        console.error(result.message);
        if (res.status === 404 && result?.message?.toLowerCase()?.includes("order not found")) {
          toast.error(`Tidak Dapat Menemukan Order ID ${currentData?.order?.orderID}`, {
            id: loadingToastID,
            duration: 10000,
          });
        } else if (res.status === 404 && result?.message?.toLowerCase()?.includes("not found")) {
          toast.error(`Tidak Dapat Menemukan URL! Hub. Admin!`, {
            id: loadingToastID,
            duration: 10000,
          });
        } else {
          toast.error(`Gagal Menghapus Order ID ${currentData?.order?.orderID}`, {
            id: loadingToastID,
            duration: 10000,
          });
        }
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") console.error(err);
      console.error(err.message);
      toast.error(`Gagal Menghapus Order ID ${currentData?.order?.orderID}`, {
        id: loadingToastID,
        duration: 10000,
      });
    }
  }

  const incrementQuantity = (idx) => {
    const newData = { ...currentData };

    let newQuantity;
    const prev = currentData.orderItems[idx].quantity;

    if (currentData.orderItems[idx]?.package.packageTitle?.toLowerCase().includes("vip")) {
      newQuantity = prev < parseInt(currentData.orderItems[idx]?.stockLeft) ? prev + 1 : parseInt(currentData.orderItems[idx]?.stockLeft);
    } else if (currentData.orderItems[idx]?.package.packageTitle?.toLowerCase().includes("festival") && currentData.orderItems[idx]?.stockLeft) {
      newQuantity = prev < parseInt(currentData.orderItems[idx]?.stockLeft) ? prev + 1 : parseInt(currentData.orderItems[idx]?.stockLeft);
    } else {
      newQuantity = prev + 1;
    }

    newData.orderItems[idx].quantity = newQuantity;

    const totalAll = currentData.orderItems?.reduce((a, b) => {
      return a + (b?.price * b?.quantity || 0);
    }, 0);

    newData.order.orderTotalPrice = totalAll;

    setCurrentData(newData);
  }

  const decrementQuantity = (idx) => {
    const newData = { ...currentData };
    newData.orderItems[idx].quantity = (currentData.orderItems[idx].quantity > 1 ? currentData.orderItems[idx].quantity - 1 : 1);

    const totalAll = currentData.orderItems?.reduce((a, b) => {
      return a + (b?.price * b?.quantity || 0);
    }, 0);

    newData.order.orderTotalPrice = totalAll;

    setCurrentData(newData);
  }

  // useEffect(() => {
  //   const totalAll = currentData.orderItems?.reduce((a, b) => {
  //     console.log(a?.total || 0);
  //     return (a?.total || 0) + (b?.price * b?.quantity || 0);
  //   }, 0);


  //   setTotalAllPrice(totalAll);
  //   setCurrentData

  // }, [currentData]);

  const handleDeleteItems = (idx) => {
    console.log("will delete package", idx);
    return;
  }

  return (
    <div className="mx-auto w-max">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="" className="h-8 w-8 p-0 mx-auto">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {/* <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(payment.id)}
        >
          Copy payment ID
        </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setDialogStatusOpen(true);
              setCurrentData(cloneDeep(info.row.original));
            }}
          >
            Update Status
          </DropdownMenuItem>
          {/* <DropdownMenuItem>Kirim Ulang QR Ticket</DropdownMenuItem> */}
          {/* <DropdownMenuItem>Tandai Check In</DropdownMenuItem> */}
          <DropdownMenuItem
            onClick={() => {
              setDialogOpen(true);
              setDialogContentData(
                <>
                  <div className="flex justify-center items-center mb-2">
                    <DialogTitle className="text-xl font-bold" >Hapus Order ID {currentData?.order?.orderID} ?</DialogTitle>
                  </div>
                  <div className="flex justify-between items-center">
                    <Button variant="outline" className="" onClick={() => setDialogOpen(false)}>Batal</Button>
                    <Button variant="destructive" className="" onClick={async () => {
                      await deleteData();
                      setDialogOpen(false)
                    }}>Konfirmasi Hapus</Button>
                  </div>
                </>
              )
            }}
          >Hapus</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* update status dialog */}
      <Dialog className=""
        open={dialogStatusOpen} onOpenChange={(isOpen) => {
          onDialogStatusOpenChange(isOpen);
        }}
      >
        <DialogOverlay className="bg-transparent backdrop-blur-[1px]" />
        <DialogContent className="max-w-[440px] rounded-lg shadow-lg max-h-[calc(100dvh_-_2rem)] overflow-auto">
          <div className="flex justify-between items-center mb-2">
            <DialogTitle className="text-xl font-bold">Order ID {currentData?.order?.orderID}</DialogTitle>
          </div>
          <div>
            <form>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Nama Lengkap :
                </p>
                <span className="font-medium">{currentData?.order?.userFullName}</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-muted-foreground">
                  No. WhatsApp :
                </p>
                <span className="font-medium">{currentData?.order?.userWhatsappNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Email Aktif :
                </p>
                <span className="font-medium">{currentData?.order?.userEmailAddress}</span>
              </div>
              <div className="my-2">
                <p className="block text-sm font-medium text-muted-foreground mb-2">
                  Pesanan :
                </p>
                <div className="pl-4 mb-2">
                  {currentData?.orderItems?.length > 0 && currentData.orderItems.map((item, idx) => {
                    return (
                      <div className="flex justify-between" key={idx}>
                        <span>{item.package.packageTitle} @ {item.quantity} pcs</span>
                        <span>Rp {item?.total?.toLocaleString("id-ID")}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-between font-bold">
                  <span>TOTAL</span>
                  <span>Rp {currentData?.order?.orderTotalPrice?.toLocaleString("id-ID")}</span>
                </div>
              </div>
              <div className="mb-5">
                <label htmlFor="status" className="block text-sm font-medium text-muted-foreground mb-2">
                  Status<span className="text-red-500">*</span>
                </label>
                <Select
                  value={`${currentData?.order?.status}`}
                  onValueChange={(opt) => {
                    // setStatusValue(opt);
                    changeStatus(opt);
                  }}
                >
                  <SelectTrigger className="h-auto">
                    <SelectValue
                      placeholder={currentData?.order?.status}
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
              </div>
            </form>
          </div>
          <div className="flex justify-between items-center">
            <Button variant="destructive" className="" onClick={() => setDialogStatusOpen(false)}>Batal</Button>
            <Button variant="" className="" onClick={async () => {
              await updateStatus();
              setDialogStatusOpen(false)
            }}>Simpan</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* edit dialog */}
      <Dialog className=""
        open={dialogEditOpen} onOpenChange={(isOpen) => {
          onDialogEditOpenChange(isOpen);
        }}
      >
        <DialogOverlay className="bg-transparent backdrop-blur-[1px]" />
        <DialogContent className="max-w-[440px] rounded-lg shadow-lg max-h-[calc(100dvh_-_2rem)] overflow-auto">
          <div className="flex justify-between items-center mb-2">
            <DialogTitle className="text-xl font-bold">Order ID {currentData?.order?.orderID}</DialogTitle>
          </div>
          <div>
            <form>
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-muted-foreground mb-1">
                    Nama Lengkap<span className="text-red-500">*</span>
                  </label>
                  <Input defaultValue={currentData?.order?.userFullName} onInput={handleInputForm} id="userFullName" placeholder="contoh : Agus Budi" />
                </div>
                <div>
                  <label htmlFor="whatsappNumber" className="block text-sm font-medium text-muted-foreground mb-1">
                    No. WhatsApp<span className="text-red-500">*</span>
                  </label>
                  <Input defaultValue={currentData?.order?.userWhatsappNumber} onInput={handleInputForm} id="userWhatsappNumber" placeholder="contoh : 6281234567890" />
                </div>
                <div>
                  <label htmlFor="emailAddress" className="block text-sm font-medium text-muted-foreground mb-1">
                    Email Aktif<span className="text-red-500">*</span>
                  </label>
                  <Input defaultValue={currentData?.order?.userEmailAddress} onInput={handleInputForm} id="userEmailAddress" placeholder="contoh : agus@mail.com" />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-muted-foreground mb-1">
                    Status<span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={`${currentData?.order?.status}`}
                    onValueChange={(opt) => {
                      // setStatusValue(opt);
                      changeStatus(opt);
                    }}
                  >
                    <SelectTrigger className="h-auto">
                      <SelectValue
                        placeholder={currentData?.order?.status}
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
                </div>
                {/* Order Items Editable List Here */}
                <div>
                  <label htmlFor="" className="block text-sm font-medium text-muted-foreground mb-1">
                    Pesanan<span className="text-red-500">*</span>
                  </label>
                  <ul className="p-2 border rounded-md bg-card">
                    {currentData?.orderItems?.length > 0 && currentData.orderItems.map((item, idx) => {
                      return (
                        <li className={`flex justify-between items-center py-2 ${idx > 0 ? "border-t" : ""}`} key={idx}>
                          <div className="flex gap-2">
                            <div>
                              <Button variant="ghost" size="icon" className="" onClick={(ev) => {
                                ev.preventDefault();
                                handleDeleteItems(idx);
                              }}>
                                <Trash className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                            <div>
                              <h3 className="font-semibold">{item.package.packageTitle}</h3>
                              <p className="text-xs text-gray-500">Rp {item.package.packagePrice.toLocaleString("id-ID")}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center border rounded-full">
                              <Button variant="ghost" size="icon" onClick={(ev) => {
                                ev.preventDefault();
                                decrementQuantity(idx);
                              }}>
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="mx-2 min-w-[20px] text-center">{item.quantity}</span>
                              <Button variant="ghost" size="icon" onClick={(ev) => {
                                ev.preventDefault();
                                incrementQuantity(idx);
                              }}>
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="mt-2 mx-auto font-semibold text-sm">Rp {((item.package.packagePrice || 0) * item.quantity)?.toLocaleString("id-ID")}</p>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Total Harga
                  </p>
                  <p className="mt-2 mx-auto font-semibold text-sm">Rp {currentData?.order?.orderTotalPrice?.toLocaleString("id-ID")}</p>
                  {/* <label htmlFor="orderTotalPrice" >
                    Total Harga<span className="text-red-500">*</span>
                  </label>
                  <Input disabled defaultValue={currentData.order.orderTotalPrice?.toLocaleString("id-ID")} id="orderTotalPrice" /> */}
                </div>
              </div>
            </form>
          </div>
          <div className="flex justify-between items-center">
            <Button variant="destructive" className="" onClick={() => setDialogEditOpen(false)}>Batal</Button>
            <Button variant="" className="" onClick={async () => {
              await updateData();
              setDialogEditOpen(false)
            }}>Simpan</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* general dialog */}
      <Dialog className=""
        open={dialogOpen} onOpenChange={(isOpen) => {
          onDialogOpenChange(isOpen);
        }}
      >
        <DialogOverlay className="bg-transparent backdrop-blur-[1px]" />
        <DialogContent className="max-w-[440px] rounded-lg shadow-lg max-h-[calc(100dvh_-_2rem)] overflow-auto">
          {dialogContentData}
        </DialogContent>
      </Dialog>

    </div>
  )
}
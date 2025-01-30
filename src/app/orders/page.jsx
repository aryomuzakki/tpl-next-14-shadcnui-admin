import OrderTable from "@/components/OrderTable"
import { revalidatePath } from "next/cache";

// fetching api
const dataFetcher = async () => {
  "use server"
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const queryParams = new URLSearchParams({
      populate: "orderItems,packages",
      limit: process.env.NODE_ENV === "development" ? 20 : process.env.NEXT_PUBLIC_ORDER_ROW_LIMIT || 20,
      sort: "-createdAt",
    })
    const orderRes = await fetch(API_URL + "/order?" + queryParams.toString());

    revalidatePath("/orders");

    return await orderRes.json();
  } catch (err) {
    if (process.env.NODE_ENV === "development") console.log(err);
    console.log(err.message);
  }
}
// end of fetching api

export const metadata = {
  title: "Backoffice | Data Order",
};

export default async function OrderPage() {

  const orders = await dataFetcher();

  return (
    <OrderTable tableData={orders?.data || []} dataFetcher={dataFetcher} />
  )
}

export const revalidate = 0;
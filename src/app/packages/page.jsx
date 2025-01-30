import PackageTable from "@/components/PackageTable";

// fetching api
const dataFetcher = async () => {
  "use server"
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const queryParams = new URLSearchParams({
      limit: 20,
      sort: "-createdAt",
    })
    const packageRes = await fetch(API_URL + "/package?" + queryParams.toString());
    return await packageRes.json();
  } catch (err) {
    if (process.env.NODE_ENV === "development") console.log(err);
    console.log(err.message);
  }
}
const packages = await dataFetcher();
// end of fetching api

export const metadata = {
  title: "Backoffice | Data Tiket",
};

export default function PackagePage() {
  return (
    <PackageTable tableData={packages} dataFetcher={dataFetcher} />
  )
}

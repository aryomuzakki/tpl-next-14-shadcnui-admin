"use client"

import Link from "next/link"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "../ui/breadcrumb"
import { usePathname } from "next/navigation";

const PageTitle = ({ navObj }) => {
  const pathname = usePathname();

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList className="sm:gap-1">
        <BreadcrumbItem>
          <BreadcrumbLink className="hover:text-accent-foreground" asChild>
            <Link href="#">{navObj[pathname]}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {/* <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Orders</BreadcrumbPage>
                  </BreadcrumbItem> */}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default PageTitle
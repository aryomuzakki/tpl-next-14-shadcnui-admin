"use client"

import { Home, LineChart, Package, Package2, PanelLeft, ShoppingCart, Users2 } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { Button } from "../ui/button"
import { usePathname } from "next/navigation"
import Image from "next/image"

const MobileNav = ({ navData }) => {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="#"
            // className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            className="group flex h-9 w-full px-2.5 py-8 mb-2 shrink-0 items-center gap-2 text-lg font-semibold md:h-8 md:text-base"
          >
            <span className="flex items-center justify-center h-10 w-10 shrink-0 mr-2 text-primary-foreground">
              <Image
                src="/assets/img/shadcnui-logo.png"
                width={40}
                height={40}
                alt="Logo"
                className="overflow-hidden"
              />
            </span>
            <span className="">Admin Dashboard</span>
          </Link>
          {navData.map((navItem, idx) => {
            return (
              <Link
                key={idx}
                href={navItem.path}
                className={`${navItem.path === pathname ? "text-foreground" : "text-muted-foreground"} flex items-center gap-4 px-2.5 hover:text-foreground`}
              >
                {navItem.icon}
                {navItem.title}
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNav
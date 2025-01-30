"use client"

import { Package2, Settings } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { usePathname } from "next/navigation"
import Image from "next/image"

const SidebarNav = ({ navData }) => {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background sm:flex w-60">
      <nav className="flex flex-col sm:pb-5">
        <Link
          href="#"
          className="group flex h-9 w-full px-2.5 py-8 mb-2 shrink-0 items-center gap-2 text-lg font-semibold md:h-8 md:text-base hover:bg-accent"
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
            <TooltipProvider key={idx}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={navItem.path}
                    className={`${navItem.path === pathname ? "bg-accent text-accent-foreground" : "text-muted-foreground"} flex h-9 w-full px-4 py-5 mb-1 items-center transition-colors hover:bg-accent hover:text-accent-foreground md:h-8`}
                  >
                    {navItem.icon}
                    <span className=" ml-2">{navItem.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{navItem.title}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </nav>
      <nav className="mt-auto flex flex-col gap-4 sm:pt-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-full px-4 py-5 mb-4 items-center text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:h-8"
              >
                <Settings className="h-5 w-5" />
                <span className=" ml-2">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  )
}

export default SidebarNav
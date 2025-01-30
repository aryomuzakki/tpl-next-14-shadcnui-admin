import { Home, List, Search, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "../ui/breadcrumb"
import { ThemeToggle } from "../ThemeToggle"
import { Input } from "../ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import Image from "next/image"
import WithNextThemes from "./WithNextThemes"
import SidebarNav from "./SidebarNav"
import MobileNav from "./MobileNav"
import PageTitle from "./PageTitle"
import { Toaster } from "../ui/sonner"

const navData = [
  {
    title: "Dashboard",
    path: "/",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Data Order",
    path: "/orders",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    title: "Data Tiket",
    path: "/packages",
    icon: <List className="h-5 w-5" />,
  },
]

const navObj = {};
navData.forEach((nav) => {
  return navObj[nav.path] = nav.title;
})

const LayoutOne = ({ children }) => {

  return (
    <>
      <WithNextThemes
        attribute="class"
        enableSystem
        disableTransitionOnChange
      >
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <SidebarNav navData={navData} />
          <div className="flex flex-col sm:pl-60">
            <header className="sticky top-0 z-30 flex min-h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:bg-transparent sm:px-6">
              <MobileNav navData={navData} />

              <PageTitle navObj={navObj} />

              {/* <div className="relative flex-1 ml-auto md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cari..."
                  className="w-full rounded-lg bg-background pl-8 md:w-40 lg:w-60"
                />
              </div> */}

              <div className="ml-auto">
                <ThemeToggle />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full"
                  >
                    <Image
                      src="/assets/img/placeholder-user.jpg"
                      width={36}
                      height={36}
                      alt="Avatar"
                      className="overflow-hidden rounded-full"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </header>
            {/* <main className="flex-1 items-start p-4 lg:p-6 sm:py-0 bg-card"> */}
            <main className="flex flex-1 flex-col gap-2 p-4 md:gap-4 md:p-8 bg-card min-h-[calc(100vh_-_56px)]">
              {children}
            </main>
          </div>
        </div>
        <Toaster richColors closeButton position="bottom-center" duration={Infinity} visibleToasts={9} />
      </WithNextThemes>
    </>
  )
}

export default LayoutOne
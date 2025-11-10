"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Settings, UserCog, Sigma as Sitemap } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { canAccessAdminUsers, canAccessAdminStructure } from "@/lib/rbac"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, public: true },
  { name: "Contacts", href: "/contacts", icon: Users, public: true },
  { name: "Settings", href: "/settings", icon: Settings, public: true },
]

const adminNavigation = [
  { name: "Users", href: "/admin/users", icon: UserCog, check: canAccessAdminUsers },
  { name: "Structure", href: "/admin/structure", icon: Sitemap, check: canAccessAdminStructure },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const visibleAdminNav = adminNavigation.filter((item) => item.check(user))

  return (
    <aside className="w-64 border-r bg-muted/40">
      <nav className="flex flex-col gap-1 p-4">
        <div className="mb-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </div>

        {visibleAdminNav.length > 0 && (
          <>
            <div className="my-2 border-t" />
            <p className="px-3 py-2 text-xs font-semibold text-muted-foreground">Admin</p>
            {visibleAdminNav.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                    pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </>
        )}
      </nav>
    </aside>
  )
}

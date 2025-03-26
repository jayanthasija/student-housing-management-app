"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MessageSquare, Settings, Upload, Users, Wrench } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items?: {
    href: string
    title: string
    icon: React.ReactNode
  }[]
}

export default function Sidebar({ className, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  const items = [
    {
      href: "/",
      title: "Dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      href: "/students",
      title: "Students",
      icon: <Users className="h-5 w-5" />,
    },
    {
      href: "/maintenance",
      title: "Maintenance",
      icon: <Wrench className="h-5 w-5" />,
    },
    {
      href: "/documents",
      title: "Documents",
      icon: <Upload className="h-5 w-5" />,
    },
    {
      href: "/feedback",
      title: "Feedback",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      href: "/settings",
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <nav className={cn("flex flex-col gap-2 p-4 md:w-60 border-r h-full", className)} {...props}>
      {items.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? "secondary" : "ghost"}
          className="justify-start gap-2"
          asChild
        >
          <Link href={item.href}>
            {item.icon}
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  )
}


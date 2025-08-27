"use client";

import {
  AlertTriangle,
  Factory,
  Gauge,
  LifeBuoy,
  MessageSquare,
  Settings,
  TrendingUp,
  Warehouse,
  Wrench,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSites } from "@/components/nav-sites";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navMain = [
  {
    title: "Dashboard",
    url: "#",
    icon: Gauge,
    isActive: true,
    items: [
      { title: "Overview", url: "#" },
      { title: "Live Metrics", url: "#" },
      { title: "Summary", url: "#" },
    ],
  },
  {
    title: "Machines",
    url: "#",
    icon: Wrench,
    items: [
      { title: "All Machines", url: "#" },
      { title: "By Line", url: "#" },
      { title: "Maintenance", url: "#" },
    ],
  },
  {
    title: "Analytics",
    url: "#",
    icon: TrendingUp,
    items: [
      { title: "Trends", url: "#" },
      { title: "Reports", url: "#" },
      { title: "Anomaly Detection", url: "#" },
    ],
  },
  {
    title: "Alerts",
    url: "#",
    icon: AlertTriangle,
    items: [
      { title: "Active Alerts", url: "#" },
      { title: "History", url: "#" },
      { title: "Rules", url: "#" },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    items: [
      { title: "General", url: "#" },
      { title: "Users", url: "#" },
      { title: "Integrations", url: "#" },
    ],
  },
];

const navSecondary = [
  { title: "Support", url: "#", icon: LifeBuoy },
  { title: "Feedback", url: "#", icon: MessageSquare },
];

const projects = [
  { name: "Factory 001", url: "#", icon: Factory },
  { name: "Factory 002", url: "#", icon: Factory },
  { name: "Mustafar Site", url: "#", icon: Warehouse },
];

const data = {
  user: {
    name: "Hego Damask",
    email: "hego@damaskholdings.com",
    avatar: "",
  },
  navMain,
  navSecondary,
  projects,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Factory className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Damask Holdings</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSites projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

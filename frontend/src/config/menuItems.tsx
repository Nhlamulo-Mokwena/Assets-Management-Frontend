// config/menuItems.ts
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  Tag,
  Users,
  ArrowLeftRight,
  Wrench,
  Settings,
  LogOut,
  PackageSearch,
  ClipboardList,
  User,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../auth/useAuth";

const { user } = useAuth();

export const adminMenu = [
  {
    section: "Overview",
    items: [
      {
        label: "Dashboard",
        href: `/user-home/${user?.sub}`,
        icon: LayoutDashboard,
      },
    ],
  },
  {
    section: "Assets",
    items: [
      {
        label: "All Assets",
        href: `/user-home/${user?.sub}/all-assets`,
        icon: Package,
      },
      {
        label: "Register Asset",
        href: `/user-home/${user?.sub}/add-asset`,
        icon: PackagePlus,
      },
      {
        label: "Categories",
        href: `/user-home/${user?.sub}/categories`,
        icon: Tag,
      },
    ],
  },
  {
    section: "People",
    items: [
      {
        label: "Employees",
        href: `/user-home/${user?.sub}/employees`,
        icon: Users,
      },
      {
        label: "Assignments",
        href: `/user-home/${user?.sub}/assignments`,
        icon: ArrowLeftRight,
      },
    ],
  },
  {
    section: "Maintenance",
    items: [
      {
        label: "Maintenance Logs",
        href: `/user-home/${user?.sub}/maintenance`,
        icon: Wrench,
      },
    ],
  },
  {
    section: "System",
    items: [
      {
        label: "Settings",
        href: `/user-home/${user?.sub}/settings`,
        icon: Settings,
      },
      { label: "Logout", href: "/logout", icon: LogOut },
    ],
  },
];

export const employeeMenu = [
  {
    section: "Overview",
    items: [
      {
        label: "Dashboard",
        href: `/user-home/${user?.sub}`,
        icon: LayoutDashboard,
      },
    ],
  },
  {
    section: "My Assets",
    items: [
      {
        label: "Assigned to Me",
        href: `/user-home/${user?.sub}/assigned-to-me`,
        icon: ClipboardList,
      },
      {
        label: "Browse Assets",
        href: `/user-home/${user?.sub}/browse-assets`,
        icon: PackageSearch,
      },
    ],
  },
  {
    section: "Maintenance",
    items: [
      {
        label: "Report an Issue",
        href: `/user-home/${user?.sub}/report-issue`,
        icon: AlertTriangle,
      },
    ],
  },
  {
    section: "Account",
    items: [
      {
        label: "My Profile",
        href: `/user-home/${user?.sub}/profile`,
        icon: User,
      },
      { label: "Logout", href: "/logout", icon: LogOut },
    ],
  },
];

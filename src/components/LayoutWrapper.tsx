"use client";

import { usePathname } from "next/navigation";

interface LayoutWrapperProps {
  navbar: React.ReactNode;
  subNavbar: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}

export default function LayoutWrapper({ navbar, subNavbar, footer, children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isOrganiserRoute = pathname?.startsWith("/organiser");
  const isAdminRoute = pathname?.startsWith("/admin");
  const hideGlobalNav = isOrganiserRoute || isAdminRoute;
  const hideSubNav = isOrganiserRoute || isAdminRoute;

  return (
    <>
      {!hideGlobalNav && navbar}
      {!hideSubNav && subNavbar}
      
      {children}
      {!isOrganiserRoute && !isAdminRoute && footer}
    </>
  );
}

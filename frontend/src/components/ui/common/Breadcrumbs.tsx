"use client";

import { usePathname, useRouter } from "next/navigation";
import { Breadcrumbs as BreadcrumbsMui, Link, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { BREADCRUMBS_MAP } from "@/lib/constants/common";
import nProgress from "nprogress";

export const Breadcrumbs = () => {
  const pathname = usePathname();
  const router = useRouter();

  // Убираем начальный "/" и пустые элементы
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null; // если мы на главной "/"

  const items = segments.map((segment, index) => {
    const isLast = index === segments.length - 1;
    // Собираем путь до текущего сегмента включительно
    const href = "/" + segments.slice(0, index + 1).join("/");

    const label =
      segment in BREADCRUMBS_MAP
        ? BREADCRUMBS_MAP[segment as keyof typeof BREADCRUMBS_MAP]
        : segment;

    if (isLast) {
      return (
        <Typography
          key={href}
          color="text.primary"
          className="!text-sm sm:!text-lg"
        >
          {label}
        </Typography>
      );
    }

    return (
      <Link
        key={href}
        underline="hover"
        color="inherit"
        href={href}
        onClick={(e) => {
          e.preventDefault();
          nProgress.start();
          router.push(href);
        }}
        className="cursor-pointer !text-sm sm:!text-lg"
      >
        {label}
      </Link>
    );
  });

  return (
    <BreadcrumbsMui
      separator={<NavigateNextIcon fontSize="medium" />}
      aria-label="breadcrumb"
      className="!mb-4"
    >
      {items}
    </BreadcrumbsMui>
  );
};

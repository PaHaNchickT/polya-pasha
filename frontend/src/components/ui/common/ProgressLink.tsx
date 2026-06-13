"use client";

import { usePathname, useRouter } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

type ProgressLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  className?: string;
};

export const ProgressLink = ({
  href,
  children,
  className,
  onClick,
  ...props
}: ProgressLinkProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const predictPathname = href;

    if (predictPathname !== pathname) {
      event.preventDefault();

      NProgress.start();
      router.push(href);

      if (onClick) onClick(event);
    }
  };

  return (
    <a onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};

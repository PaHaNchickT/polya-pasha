"use client";

import { useRouter } from "next/navigation";
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

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    NProgress.start();
    router.push(href);

    if (onClick) onClick(event);
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};

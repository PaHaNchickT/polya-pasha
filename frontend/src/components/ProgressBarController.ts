"use client";

import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import { useEffect, useRef } from "react";

export const ProgressBarController = () => {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    // как только pathname изменился (новая страница загружена) — завершаем прогресс
    NProgress.done();
  }, [pathname]);

  return null;
};

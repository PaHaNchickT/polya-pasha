"use client";

import { Button } from "@mui/material";
import Link from "next/link";
import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
};

const Error = ({ error }: ErrorProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grow flex flex-col items-center justify-center text-center gap-[21px]">
      <h1 className="text-[37px] font-medium">Упс, что-то пошло не так...</h1>
      <Button variant="contained" color="primary">
        <Link href="/">Вернуться на главную</Link>
      </Button>
    </div>
  );
};

export default Error;

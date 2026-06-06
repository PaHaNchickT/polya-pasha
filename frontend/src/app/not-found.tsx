import { Button } from "@mui/material";
import Link from "next/link";

const NotFound = () => (
  <div className="grow flex flex-col items-center justify-center text-center gap-[21px]">
    <h1 className="text-[37px] font-medium">
      Упс, такой страницы не существует...
    </h1>
    <Button variant="contained" color="primary">
      <Link href="/">Вернуться на главную</Link>
    </Button>
  </div>
);

export default NotFound;

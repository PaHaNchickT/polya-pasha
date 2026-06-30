import { HEADER_TABS_KEYS, HEADER_TABS_MAP } from "@/lib/constants/common";
import { Button, Typography } from "@mui/material";
import { ProgressLink } from "../ui/common/ProgressLink";
import { usePathname } from "next/navigation";

interface HeaderTabsProps {
  onClose?: () => void;
}

export const HeaderTabs = ({ onClose }: HeaderTabsProps) => {
  const pathname = usePathname();

  return (
    <div className="grow flex gap-4 flex-col sm:flex-row justify-center items-center px-0 text-white">
      {HEADER_TABS_KEYS.map((route) =>
        `/${route}` === pathname ? (
          <Typography
            key={`${route}-tav`}
            variant="button"
            className="!text-white !text-[13px] px-[10px] py-[4px] underline decoration-white underline-offset-4 flex justify-center items-center"
          >
            {HEADER_TABS_MAP[route]}
          </Typography>
        ) : (
          <ProgressLink key={`${route}-tav`} href={`/${route}`}>
            <Button
              variant="text"
              size="small"
              className="!text-white"
              onClick={() => onClose?.()}
            >
              {HEADER_TABS_MAP[route]}
            </Button>
          </ProgressLink>
        ),
      )}
    </div>
  );
};

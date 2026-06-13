"use client";

import { Button, IconButton, Typography } from "@mui/material";
import { Place } from "@/types/place";
import { api } from "@/lib/api";
import { Breadcrumbs } from "@/components/ui/common/Breadcrumbs";
import EditIcon from "@mui/icons-material/Edit";
import YMap from "@/components/ui/common/YMap";
import { ProgressLink } from "@/components/ui/common/ProgressLink";
import { DeleteWithConfirmButton } from "@/components/ui/common/DeleteWithConfirmButton";
import { notify } from "@/lib/utils/notify";
import nProgress from "nprogress";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PlaceEditPageProps {
  data: Place;
}

export const PlacePage = ({ data }: PlaceEditPageProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setLoading(true);

    api
      .deletePlace(data.id)
      .then(() => {
        notify("Место успешно удалено!", "success");
        nProgress.start();
        router.push("/places");
      })
      .catch((err) => {
        notify(err.message, "error");
        console.error(err.message);
      })
      .finally(() => setLoading(false));
  };

  const handleClickTest = () => {
    console.log("clicked");

    api
      .createPlace({
        title: "Кафе «Ромашка»",
        description: "Уютное кафе в центре",
        event_date: "2026-06-10T18:00:00.000Z",
        author: "admin",
        location_type: "walk",
        activity_type: ["food", "action"],
        cover_type: "open",
        comment: "Можно с собаками",
        address: "ул. Ленина, 10",
        coordinates: [55.7558, 37.6173],
        link: null,
        rating: 0,
        images: [],
        is_visited: false,
      })
      .then((data) => console.log(data, "success"))
      .catch((err) => console.error(err.message));
  };

  return (
    <main>
      <div>
        <Typography variant="h1" gutterBottom>
          {data.title}
        </Typography>
        <div className="flex justify-between items-center">
          <Breadcrumbs />
          <div className="flex gap-2">
            <ProgressLink href={`/places/${data.id}/edit`}>
              <IconButton aria-label="add" loading={loading}>
                <EditIcon />
              </IconButton>
            </ProgressLink>
            <DeleteWithConfirmButton
              isIconOnly
              onDelete={handleDelete}
              loading={loading}
              dialogContentText="Вы уверены, что хотите удалить это место? Это действие нельзя отменить."
            />
          </div>
        </div>
        <YMap center={data.coordinates} readOnly />
      </div>
      <Button onClick={handleClickTest}>Add test place</Button>
    </main>
  );
};

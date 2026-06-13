"use client";

import { Button, IconButton, Typography } from "@mui/material";
import { Place } from "@/types/place";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Breadcrumbs } from "@/components/ui/common/Breadcrumbs";
import EditIcon from "@mui/icons-material/Edit";
import YMap from "@/components/ui/common/YMap";

interface PlaceEditPageProps {
  data: Place;
}

export const PlacePage = ({ data }: PlaceEditPageProps) => {
  const router = useRouter();

  const handleClickEdit = () => {
    router.push(`/places/${data.id}/edit`);
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
          <IconButton onClick={handleClickEdit} aria-label="add">
            <EditIcon />
          </IconButton>
        </div>
        <YMap center={data.coordinates} readOnly />
      </div>
      <Button onClick={handleClickTest}>Add test place</Button>
    </main>
  );
};

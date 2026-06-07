import { FC } from "react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { api } from "@/lib/api";

export const AddButton: FC = () => {
  const handleClick = () => {
    console.log("clicked");

    api
      .createPlace({
        title: "Кафе «Ромашка»",
        description: "Уютное кафе в центре",
        event_date: "2026-06-10T18:00:00.000Z",
        author: "Pasha",
        location_type: "walk",
        activity_type: ["food"],
        cover_type: "open",
        comment: "Можно с собаками",
        address: "ул. Ленина, 10",
        coordinates: [55.7558, 37.6173],
        link: null,
        rating: 5,
        images: [],
        is_visited: false,
      })
      .then((data) => console.log(data, "success"))
      .catch((err) => console.error(err.message));
  };

  return (
    <IconButton onClick={handleClick} aria-label="add">
      <AddIcon />
    </IconButton>
  );
};

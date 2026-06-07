import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Avatar, AvatarGroup, Box, Typography } from "@mui/material";
import { Place } from "@/types/place";
import { AUTHORS_MAP, LOCATION_TYPE_MAP } from "@/lib/constants/place";
import { useRouter } from "next/navigation";

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: 0,
  height: "100%",
  backgroundColor: (theme.vars || theme).palette.background.paper,
  "&:hover": {
    backgroundColor: "transparent",
    cursor: "pointer",
  },
  "&:focus-visible": {
    outline: "3px solid",
    outlineColor: "hsla(210, 98%, 48%, 0.5)",
    outlineOffset: "2px",
  },
}));

const StyledCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  gap: 4,
  padding: 16,
  flexGrow: 1,
  "&:last-child": {
    paddingBottom: 16,
  },
});

const StyledTypography = styled(Typography)({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
});

function Author({ authors }: { authors: { name: string; avatar: string }[] }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
          alignItems: "center",
        }}
      >
        <AvatarGroup max={3}>
          {authors.map((author, index) => (
            <Avatar
              key={index}
              alt={author.name}
              src={author.avatar}
              sx={{ width: 24, height: 24 }}
            />
          ))}
        </AvatarGroup>
        <Typography variant="caption">
          {authors.map((author) => author.name).join(", ")}
        </Typography>
      </Box>
      <Typography variant="caption">July 14, 2021</Typography>
    </Box>
  );
}

type IPlaceItem = {
  item: Place;
};

export const PlaceItem = ({ item }: IPlaceItem) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`places/${item.id}`);
  };

  return (
    <StyledCard
      variant="outlined"
      onClick={handleClick}
      tabIndex={0}
      sx={{ height: "100%" }}
    >
      <CardMedia
        component="img"
        alt="green iguana"
        image={"https://picsum.photos/800/450?random=45"}
        sx={{
          height: { sm: "auto", md: "50%" },
          aspectRatio: { sm: "16 / 9", md: "" },
        }}
      />
      <StyledCardContent>
        <Typography gutterBottom variant="caption" component="div">
          {LOCATION_TYPE_MAP[item.locationType]}
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          {item.title}
        </Typography>
        <StyledTypography
          variant="body2"
          gutterBottom
          sx={{ color: "text.secondary" }}
        >
          {item.description}
        </StyledTypography>
      </StyledCardContent>
      <Author
        authors={[
          {
            name: AUTHORS_MAP[item.author],
            avatar: "/static/images/avatar/4.jpg",
          },
        ]}
      />
    </StyledCard>
  );
};

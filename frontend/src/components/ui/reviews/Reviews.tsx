import { ReviewForm } from "./ReviewForm/ReviewForm";
import { ReviewItem } from "./ReviewItem";
import { Review } from "@/types/reviews";

interface ReviewsProps {
  placeId: number;
  data: Review[];
}

export const Reviews = ({ placeId, data }: ReviewsProps) => {
  const defaultValues = {
    title: "",
    description: "",
    visitedAt: "",
  };

  return (
    <div
      className={data.length ? "grid grid-cols-2 gap-4" : "flex justify-center"}
    >
      <div className={data.length ? "min-w-0" : "min-w-[680px]"}>
        <ReviewForm
          placeId={placeId}
          mode="create"
          defaultValues={defaultValues}
        />
      </div>
      {data!.map((item, index) => (
        <ReviewItem key={index} data={item} placeId={placeId} />
      ))}
    </div>
  );
};

import styles from "./StarRating.module.css";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  showEmpty?: boolean;
}

/**
 * Calculates the fill percentage for each star based on the rating.
 * @param rating - The rating value (0-5)
 * @param starIndex - The index of the star (0-4)
 * @returns The fill percentage (0-100) for that star
 */
function calculateStarFillPercentage(
  rating: number,
  starIndex: number
): number {
  const starValue = starIndex + 1;

  if (rating >= starValue) {
    return 100; // Fully filled
  } else if (rating > starIndex) {
    // Partially filled - calculate exact percentage
    return (rating - starIndex) * 100;
  }
  return 0; // Empty
}

/**
 * Renders a single star with partial fill based on percentage.
 */
function Star({ fillPercentage }: { fillPercentage: number }) {
  return (
    <span className={styles.starWrapper}>
      <span className={styles.starEmpty}>☆</span>
      <span
        className={styles.starFilled}
        style={{ clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` }}
      >
        ★
      </span>
    </span>
  );
}

/**
 * A reusable star rating component that displays partial star fills
 * based on the exact rating percentage.
 */
export default function StarRating({
  rating,
  maxStars = 5,
  size = "md",
  showEmpty = true,
}: StarRatingProps) {
  const clampedRating = Math.max(0, Math.min(rating, maxStars));
  const stars = Array.from({ length: maxStars }, (_, index) => index);

  return (
    <span
      className={`${styles.stars} ${styles[size]}`}
      aria-label={`Rating: ${rating} out of ${maxStars} stars`}
    >
      {stars.map((index) => {
        const fillPercentage = calculateStarFillPercentage(
          clampedRating,
          index
        );
        if (!showEmpty && fillPercentage === 0) return null;
        return <Star key={index} fillPercentage={fillPercentage} />;
      })}
    </span>
  );
}

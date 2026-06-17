export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

export type ReactionType = "pray" | "peace" | "candle";
export type PrayerType = "wish" | "gratitude" | "memorial" | "worry" | "peace";

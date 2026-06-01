type ImageSize = "thumb" | "card" | "detail" | "avatar";

const transforms: Record<ImageSize, string> = {
  thumb: "w_150,h_200,c_fill,q_auto,f_auto",
  card: "w_300,h_400,c_fill,q_auto,f_auto",
  detail: "w_600,h_800,c_fill,q_auto,f_auto",
  avatar: "w_200,h_200,c_fill,q_auto,f_auto",
};

const PLACEHOLDER = "assets/images/placeholder.jpg";

export function getImageUrl(
  url: string | null | undefined,
  size: ImageSize,
): string {
  if (!url) return PLACEHOLDER;
  return url.replace("/upload/", `/upload/${transforms[size]}/`);
}

import { toast } from "sonner";

export const showToast = (
  message: string,
  type: "success" | "error" | "info" = "success",
): void => {
  if (type === "success") toast.success(message);
  else if (type === "error") toast.error(message);
  else toast(message);
};

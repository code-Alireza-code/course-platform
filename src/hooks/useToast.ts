import { toast } from "sonner";

export default function actionToast(actionData: {
  error: boolean;
  message: string;
}) {
  return toast(actionData.error ? "Error" : "Success", {
    description: actionData.message,
    style: {
      backgroundColor: actionData.error ? "#dc2626" : "#fff",
      color: actionData.error ? "#fff" : "#000",
      fontWeight: 600,
    },
  });
}

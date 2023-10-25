import * as yup from "yup";

import { generateRequiredErrorMessage } from "@/utils/constants";

export const idParamsSchema = yup.object({
  id: yup.string().required(generateRequiredErrorMessage("ID")),
});


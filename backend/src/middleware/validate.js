import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";

export const validate = (schema, source = "body") => (req, _res, next) => {
  try {
    req[source] = schema.parse(req[source]);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new AppError("Validation failed", 400, error.issues));
    }

    return next(error);
  }
};

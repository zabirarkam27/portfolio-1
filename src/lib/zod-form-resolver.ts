import type { FieldErrors, Resolver } from "react-hook-form";
import type { z } from "zod";

export function zodFormResolver<TSchema extends z.ZodType>(
  schema: TSchema,
): Resolver<z.infer<TSchema>> {
  return async (values) => {
    const result = await schema.safeParseAsync(values);

    if (result.success) {
      return {
        errors: {},
        values: result.data,
      };
    }

    return {
      values: {},
      errors: Object.fromEntries(
        result.error.issues.map((issue) => [
          issue.path.join("."),
          {
            message: issue.message,
            type: issue.code,
          },
        ]),
      ) as FieldErrors<z.infer<TSchema>>,
    };
  };
}

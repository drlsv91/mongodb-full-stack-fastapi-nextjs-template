import { useForm, UseFormProps, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<z.infer<TSchema>>, "resolver"> & {
    schema: TSchema;
  }
): UseFormReturn<z.infer<TSchema>> {
  const { schema, ...formProps } = props;

  return useForm<z.infer<TSchema>>({
    ...formProps,
    resolver: zodResolver(schema),
  });
}

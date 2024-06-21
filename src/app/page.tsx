"use client";

import { useForm } from "@tanstack/react-form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { trpc } from "./_trpc/client";

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getProducts = trpc.product.getAll.useQuery({
    query: searchParams.get("query")?.toString(),
  });
  const createProduct = trpc.product.create.useMutation();

  const form = useForm<NonNullable<typeof createProduct.variables>>({
    onSubmit: async ({ value }) => {
      createProduct.mutate(value, {
        onSuccess: () => {
          getProducts.refetch();
        },
      });
    },
    defaultValues: {
      name: "Test",
      code: "test_",
      brand: "Honda",
      price: 10_000,
      stock: 1,
    },
  });

  const searchHandler = useDebouncedCallback((query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 500);

  if (getProducts.isError) {
    return <p>{getProducts.error.message}</p>;
  }

  return (
    <>
      <input
        type="text"
        key={searchParams.get("query")?.toString()}
        placeholder="search name or code"
        onChange={(e) => searchHandler(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div>
          <form.Field name="name">
            {(field) => (
              <input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
        </div>
        <div>
          <form.Field name="code">
            {(field) => (
              <input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
        </div>
        <div>
          <form.Field name="brand">
            {(field) => (
              <input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
        </div>
        <div>
          <form.Field name="price">
            {(field) => (
              <input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
            )}
          </form.Field>
        </div>
        <div>
          <form.Field name="stock">
            {(field) => (
              <input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
            )}
          </form.Field>
        </div>
        <button type="submit">Submit</button>
      </form>
      <ul>
        {getProducts?.data?.map((product) => {
          return <li key={product.id}>{product.name}</li>;
        })}
      </ul>
    </>
  );
}

"use client";

import { DataTable } from "@/components/datatable";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@tanstack/react-form";
import { Download, Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useDebouncedCallback } from "use-debounce";
import { trpc } from "./_trpc/client";
import { columns } from "./columns";

export default function Page() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [openAddDialog, setOpenAddDialog] = React.useState(false);

	const getProducts = trpc.product.getAll.useQuery({
		query: searchParams.get("query")?.toString(),
	});
	const createProduct = trpc.product.create.useMutation();

	const form = useForm<NonNullable<typeof createProduct.variables>>({
		onSubmit: async ({ value }) => {
			createProduct.mutate(value, {
				onSuccess: () => {
					setOpenAddDialog(false);
					getProducts.refetch();
				},
			});
		},
		defaultValues: {
			name: "Test",
			code: "test_",
			brand: "Honda",
			price: 10_000,
			quantity: 1,
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
		<div className="px-16 py-8 flex flex-col items-start gap-8">
			<div className="w-full flex justify-between items-center">
				<h1 className="text-3xl font-medium">Products</h1>
				<div className="flex gap-4">
					<Button
						type="button"
						variant="outline"
						className="flex items-center gap-1"
					>
						<Download />
						Download CSV
					</Button>
					<Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
						<DialogTrigger asChild>
							<Button type="button" className="flex items-center gap-1">
								<Plus />
								Add product
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<form
								onSubmit={(e) => {
									e.preventDefault();
									e.stopPropagation();
									form.handleSubmit();
								}}
							>
								<DialogHeader>
									<DialogTitle>Add Product</DialogTitle>
									<DialogDescription>
										Input product data here. Click save when you're done.
									</DialogDescription>
								</DialogHeader>
								<div className="grid gap-4 py-4">
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="name" className="text-right">
											Name
										</Label>
										<form.Field name="name">
											{(field) => (
												<Input
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													id="name"
													autoComplete="off"
													className="col-span-3"
												/>
											)}
										</form.Field>
									</div>
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="code" className="text-right">
											Product Code
										</Label>
										<form.Field name="code">
											{(field) => (
												<Input
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													id="name"
													autoComplete="off"
													className="col-span-3"
												/>
											)}
										</form.Field>
									</div>
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="brand" className="text-right">
											Brand
										</Label>
										<form.Field name="brand">
											{(field) => (
												<Input
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													id="name"
													autoComplete="off"
													className="col-span-3"
												/>
											)}
										</form.Field>
									</div>
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="price" className="text-right">
											Price
										</Label>
										<form.Field name="price">
											{(field) => (
												<Input
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) =>
														field.handleChange(Number(e.target.value))
													}
													id="name"
													autoComplete="off"
													className="col-span-3"
												/>
											)}
										</form.Field>
									</div>
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="quantity" className="text-right">
											Quantity
										</Label>
										<form.Field name="quantity">
											{(field) => (
												<Input
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) =>
														field.handleChange(Number(e.target.value))
													}
													id="name"
													autoComplete="off"
													className="col-span-3"
												/>
											)}
										</form.Field>
									</div>
								</div>
								<DialogFooter>
									<Button type="submit">save</Button>
								</DialogFooter>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			</div>
			<DataTable columns={columns} data={getProducts.data || []} />
		</div>
	);
}

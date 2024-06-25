import type { products } from "@/database/product";
import {
	type AccessorKeyColumnDef,
	createColumnHelper,
} from "@tanstack/react-table";

type Product = Omit<typeof products.$inferSelect, "created_at">;

const columnHelper = createColumnHelper<Product>();

export const columns: AccessorKeyColumnDef<
	Product,
	// biome-ignore lint/suspicious/noExplicitAny: it's okay
	any
>[] = [
	columnHelper.accessor("code", {
		header: "Code",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("name", {
		header: "Name",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("brand", {
		header: "Brand",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("price", {
		header: "Price",
		cell: (info) => info.getValue(), // Todo: fix currency
	}),
	columnHelper.accessor("quantity", {
		header: "Quantity",
		cell: (info) => info.getValue(), // Todo: fix quantity
	}),
];

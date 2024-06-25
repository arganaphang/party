"use client";

import { trpc } from "@/app/_trpc/client";

export default function Page() {
	const getHealth = trpc.health.getHealth.useQuery();

	return (
		<>
			<h1>{getHealth.data?.message}</h1>
		</>
	);
}

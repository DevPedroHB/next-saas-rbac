"use client";

import { getQueryClient } from "@/libs/get-query-client";
import { QueryClientProvider as ReactQueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";

interface IQueryClientProvider {
	children: ReactNode;
}

export function QueryClientProvider({ children }: IQueryClientProvider) {
	const queryClient = getQueryClient();

	return (
		<ReactQueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</ReactQueryClientProvider>
	);
}

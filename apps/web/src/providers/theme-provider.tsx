"use client";

import { keys } from "@/constants/keys";
import {
	ThemeProvider as NextThemeProvider,
	type ThemeProviderProps,
} from "next-themes";

export function ThemeProvider(props: ThemeProviderProps) {
	return (
		<NextThemeProvider
			attribute="class"
			defaultTheme="system"
			storageKey={keys.THEME}
			enableSystem
			disableTransitionOnChange
			{...props}
		/>
	);
}

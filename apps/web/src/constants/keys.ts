import { formatKeyStorage } from "@/functions/format-key-storage";

export const keys = {
	THEME: formatKeyStorage("theme"),
	TOKEN: formatKeyStorage("token"),
} as const;

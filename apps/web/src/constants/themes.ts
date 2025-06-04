import { Moon, Sun, SunMoon } from "lucide-react";

export const themes = [
	{
		name: "Claro",
		value: "light",
		icon: Sun,
	},
	{
		name: "Escuro",
		value: "dark",
		icon: Moon,
	},
	{
		name: "Sistema",
		value: "system",
		icon: SunMoon,
	},
] as const;

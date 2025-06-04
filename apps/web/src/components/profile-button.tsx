"use client";

import { getProfile } from "@/actions/auth/get-profile-action";
import { themes } from "@/constants/themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronDown, User2 } from "lucide-react";
import { useTheme } from "next-themes";
import { SignOutDialog } from "./sign-out-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function ProfileButton() {
	const { data } = useSuspenseQuery({
		queryKey: ["profile"],
		queryFn: getProfile,
	});

	const { theme, setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center gap-3 outline-none">
				<div className="flex flex-col items-end">
					<span className="font-medium text-sm">
						{data.user.name ?? "Sem nome"}
					</span>
					<span className="text-muted-foreground text-xs">
						{data.user.email}
					</span>
				</div>
				<Avatar>
					<AvatarImage
						src={data.user.avatarUrl ?? ""}
						alt={data.user.name ?? data.user.email}
					/>
					<AvatarFallback>
						<User2 className="size-5 text-muted-foreground" />
					</AvatarFallback>
				</Avatar>
				<ChevronDown className="size-4 text-muted-foreground" />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Minha conta</DropdownMenuLabel>
				<DropdownMenuGroup>
					<DropdownMenuItem>
						Perfil
						<DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>Temas</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
									{themes.map((theme) => {
										const Icon = theme.icon;

										return (
											<DropdownMenuRadioItem
												key={theme.value}
												value={theme.value}
											>
												{theme.name}
												<DropdownMenuShortcut>
													<Icon className="size-4" />
												</DropdownMenuShortcut>
											</DropdownMenuRadioItem>
										);
									})}
								</DropdownMenuRadioGroup>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<SignOutDialog asChild>
					<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
						Sair
						<DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
					</DropdownMenuItem>
				</SignOutDialog>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

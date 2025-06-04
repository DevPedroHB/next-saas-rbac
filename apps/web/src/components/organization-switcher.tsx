import { ChevronsUpDown, Package, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function OrganizationSwitcher() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center gap-2 p-1 rounded outline-none focus:ring-2 focus:ring-primary w-[12.5rem] font-medium text-sm">
				<span className="text-muted-foreground">Selecione organização</span>
				<ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
			</DropdownMenuTrigger>
			<DropdownMenuContent
				sideOffset={12}
				className="w-(--radix-dropdown-menu-trigger-width)"
			>
				<DropdownMenuLabel>Organizações</DropdownMenuLabel>
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<Avatar className="mr-2 size-4">
							<AvatarImage src="https://github.com/rocketseat.png" />
							<AvatarFallback>
								<Package className="size-3 text-muted-foreground" />
							</AvatarFallback>
						</Avatar>
						<span className="line-clamp-1">Rocketseat</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href="/create-organization">
						<PlusCircle className="mr-2 size-4" />
						Criar nova
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

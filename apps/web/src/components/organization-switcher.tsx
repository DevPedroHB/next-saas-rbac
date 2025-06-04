"use client";

import { getOrganizations } from "@/actions/orgs/get-organizations-action";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronsUpDown, Package, PlusCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
	const { data } = useSuspenseQuery({
		queryKey: ["organizations"],
		queryFn: getOrganizations,
	});

	const pathnames = usePathname();

	const currentOrg = data.organizations.find((org) =>
		pathnames.startsWith(`/org/${org.slug}`),
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center gap-2 p-1 rounded outline-none focus:ring-2 focus:ring-primary w-[12.5rem] font-medium text-sm">
				{currentOrg ? (
					<>
						<Avatar className="mr-2 size-4">
							<AvatarImage
								src={currentOrg.avatarUrl ?? ""}
								alt={currentOrg.name}
							/>
							<AvatarFallback>
								<Package className="size-3 text-muted-foreground" />
							</AvatarFallback>
						</Avatar>
						<span className="text-left truncate">{currentOrg.name}</span>
					</>
				) : (
					<span className="text-muted-foreground">Selecione organização</span>
				)}
				<ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
			</DropdownMenuTrigger>
			<DropdownMenuContent
				sideOffset={12}
				className="w-(--radix-dropdown-menu-trigger-width)"
			>
				<DropdownMenuLabel>Organizações</DropdownMenuLabel>
				<DropdownMenuGroup>
					{data.organizations.map((organization) => {
						return (
							<DropdownMenuItem key={organization.id} asChild>
								<Link href={`/org/${organization.slug}`}>
									<Avatar className="mr-2 size-4">
										<AvatarImage
											src={organization.avatarUrl ?? ""}
											alt={organization.name}
										/>
										<AvatarFallback>
											<Package className="size-3 text-muted-foreground" />
										</AvatarFallback>
									</Avatar>
									<span className="line-clamp-1">{organization.name}</span>
								</Link>
							</DropdownMenuItem>
						);
					})}
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

import { getProfileAction } from "@/actions/auth/get-profile-action";
import { getMembershipAction } from "@/actions/orgs/get-membership-action";
import { getOrganizationsAction } from "@/actions/orgs/get-organizations-action";
import { Nextjs } from "@ridemountainpig/svgl-react";
import { HydrationBoundary } from "@tanstack/react-query";
import { Slash } from "lucide-react";
import { OrganizationSwitcher } from "./organization-switcher";
import { ProfileButton } from "./profile-button";

export async function Header() {
	const { data: organizationsData } = await getOrganizationsAction();
	const { data: profileData } = await getProfileAction();
	const { data: membershipData } = await getMembershipAction();

	return (
		<header className="flex justify-between items-center mx-auto pb-2 border-b max-w-[75rem]">
			<div className="flex items-center gap-3">
				<Nextjs className="size-6" />
				<Slash className="text-border size-3 -rotate-[24deg]" />
				<HydrationBoundary state={organizationsData?.dehydratedState}>
					<OrganizationSwitcher />
				</HydrationBoundary>
				{membershipData?.ability.can("get", "Project") && <p>Projetos</p>}
			</div>
			<div className="flex items-center gap-4">
				<HydrationBoundary state={profileData?.dehydratedState}>
					<ProfileButton />
				</HydrationBoundary>
			</div>
		</header>
	);
}

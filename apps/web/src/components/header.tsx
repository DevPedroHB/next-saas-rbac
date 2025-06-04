import { getProfileAction } from "@/actions/auth/get-profile-action";
import { Nextjs } from "@ridemountainpig/svgl-react";
import { HydrationBoundary } from "@tanstack/react-query";
import { ProfileButton } from "./profile-button";

export async function Header() {
	const { data } = await getProfileAction();

	return (
		<header className="flex justify-between items-center mx-auto max-w-[75rem]">
			<div className="flex items-center gap-3">
				<Nextjs className="size-6" />
			</div>
			<div className="flex items-center gap-4">
				<HydrationBoundary state={data?.dehydratedState}>
					<ProfileButton />
				</HydrationBoundary>
			</div>
		</header>
	);
}

import { getProfileAction } from "@/actions/auth/get-profile-action";
import { SignOutDialog } from "@/components/sign-out-dialog";
import { Button } from "@/components/ui/button";

export default async function Home() {
	const { data } = await getProfileAction();

	return (
		<main className="flex flex-col justify-center items-center min-h-screen">
			<code>
				<pre>{JSON.stringify(data?.user, null, 2)}</pre>
			</code>
			<SignOutDialog>
				<Button type="button">Sair</Button>
			</SignOutDialog>
		</main>
	);
}

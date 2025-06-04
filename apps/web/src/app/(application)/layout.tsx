import { Header } from "@/components/header";
import { getServerSession } from "@/libs/session";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

interface IApplicationLayout {
	children: ReactNode;
}

export default async function ApplicationLayout({
	children,
}: Readonly<IApplicationLayout>) {
	const session = await getServerSession();

	if (!session.token) {
		redirect("/auth/sign-in");
	}

	return (
		<div className="space-y-4 py-4">
			<Header />
			<main className="mx-auto w-full max-w-[75rem]">{children}</main>
		</div>
	);
}

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

	return <>{children}</>;
}

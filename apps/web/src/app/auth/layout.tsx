import { getServerSession } from "@/libs/session";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

interface IAuthLayout {
	children: ReactNode;
}

export default async function AuthLayout({ children }: Readonly<IAuthLayout>) {
	const session = await getServerSession();

	if (session.token) {
		redirect("/");
	}

	return (
		<main className="flex flex-col justify-center items-center px-4 min-h-screen">
			<section className="w-full max-w-xs">{children}</section>
		</main>
	);
}

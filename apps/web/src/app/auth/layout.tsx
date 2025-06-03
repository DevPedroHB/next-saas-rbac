import type { ReactNode } from "react";

interface IAuthLayout {
	children: ReactNode;
}

export default function AuthLayout({ children }: Readonly<IAuthLayout>) {
	return (
		<main className="flex flex-col justify-center items-center px-4 min-h-screen">
			<section className="w-full max-w-xs">{children}</section>
		</main>
	);
}

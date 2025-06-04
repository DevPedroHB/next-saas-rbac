import { Header } from "@/components/header";
import { Suspense } from "react";

export default function Home() {
	return (
		<div className="py-4">
			<Suspense>
				<Header />
			</Suspense>
			<main>
				<h1>Page Home</h1>
			</main>
		</div>
	);
}

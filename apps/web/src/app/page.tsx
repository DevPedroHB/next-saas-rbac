import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
	return (
		<main className="flex flex-col justify-center items-center min-h-screen">
			<h1>Page Home</h1>
			<Button type="button" asChild>
				<Link href="/auth/sign-in">Entrar</Link>
			</Button>
		</main>
	);
}

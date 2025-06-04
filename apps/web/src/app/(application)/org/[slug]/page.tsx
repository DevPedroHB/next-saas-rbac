import { Header } from "@/components/header";

interface IOrganization {
	params: {
		slug: string;
	};
}

export default async function Projects({ params }: IOrganization) {
	const { slug } = await params;

	return (
		<div className="py-4">
			<Header />
			<main>
				<h1>Page Projects {slug}</h1>
			</main>
		</div>
	);
}

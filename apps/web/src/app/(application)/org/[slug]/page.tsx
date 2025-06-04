interface IOrganization {
	params: Promise<{ slug: string }>;
}

export default async function Projects({ params }: IOrganization) {
	const { slug } = await params;

	return <h1>Page Projects {slug}</h1>;
}

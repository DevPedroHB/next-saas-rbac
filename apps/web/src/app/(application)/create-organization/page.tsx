import { UpsertOrganizationForm } from "./components/upsert-organization-form";

export default function CreateOrganization() {
	return (
		<div className="space-y-4">
			<h1 className="font-bold text-2xl">Criar organização</h1>
			<UpsertOrganizationForm />
		</div>
	);
}

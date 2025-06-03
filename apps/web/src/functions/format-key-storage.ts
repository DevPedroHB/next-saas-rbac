import pkg from "../../../../package.json";

export function formatKeyStorage(key: string) {
	return `@${pkg.name}/${pkg.version}:${key}`;
}

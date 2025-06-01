export interface SlugOptions {
	separator?: string;
	case?: "lower" | "upper";
	decamelize?: boolean;
	customReplacements?: ReadonlyArray<[string, string]>;
	preserveCharacters?: string[];
}

export function slugify(input: string, options: SlugOptions = {}) {
	const {
		separator = "-",
		case: letterCase = "lower",
		decamelize = true,
		customReplacements = [],
		preserveCharacters = [],
	} = options;

	let str = input;

	// 1. Decamelize: separa camelCase em palavras
	if (decamelize) {
		str = str.replace(/([a-z0-9])([A-Z])/g, `$1${separator}$2`);
	}

	// 2. Substituições personalizadas antes de remover acentos
	for (const [from, to] of customReplacements) {
		str = str.split(from).join(to);
	}

	// 3. Normaliza e remove acentos (diacríticos)
	// biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
	str = str.normalize("NFD").replace(/[̀-ͯ]/g, "");

	// 4. Construir padrão regex para preservação de caracteres
	const preserveEscaped = preserveCharacters.map((ch) => `\\${ch}`).join("");
	const preservePattern = preserveEscaped
		? `A-Za-z0-9${preserveEscaped}`
		: "A-Za-z0-9";

	// 5. Substituir caracteres não permitidos por separador
	const invalidCharsRegex = new RegExp(`[^${preservePattern}]+`, "g");
	str = str.replace(invalidCharsRegex, separator);

	// 6. Aplicar case (minúsculas ou maiúsculas)
	str = letterCase === "lower" ? str.toLowerCase() : str.toUpperCase();

	// 7. Colapsar separadores duplicados
	const duplicateSepRegex = new RegExp(`${separator}{2,}`, "g");
	str = str.replace(duplicateSepRegex, separator);

	// 8. Remover separadores no início e fim
	const trimSepRegex = new RegExp(`^${separator}|${separator}$`, "g");
	str = str.replace(trimSepRegex, "");

	return str;
}

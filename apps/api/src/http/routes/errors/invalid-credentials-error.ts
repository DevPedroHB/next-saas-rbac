/**
 * Representa um erro de autenticação devido a credenciais inválidas.
 * Comumente usado quando o usuário fornece CPF, CNPJ, senha, token ou ID inválido
 * em operações que exigem autenticação ou validação de identidade.
 */
export class InvalidCredentialsError extends Error {
	/**
	 * Nome da classe de erro.
	 */
	public readonly name = "InvalidCredentialsError";
	/**
	 * Código HTTP correspondente ao erro de autenticação (`401 Unauthorized`).
	 */
	public readonly statusCode = 401;

	/**
	 * Cria uma nova instância de `InvalidCredentialsError`.
	 * @param message Mensagem descritiva do erro.
	 * @param options Opções adicionais para o erro.
	 */
	constructor(
		message = "As credenciais estão incorretas. Verifique as informações e tente novamente.",
		options?: ErrorOptions,
	) {
		super(message, options);

		// Corrige o protótipo para garantir instanceof funcional.
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

/**
 * Representa um erro de autorização (HTTP 401) que ocorre quando o usuário
 * não está autenticado ou suas credenciais são inválidas para acessar o recurso.
 */
export class UnauthorizedError extends Error {
	/**
	 * Nome do erro.
	 */
	public readonly name = "UnauthorizedError";
	/**
	 * Código de status HTTP associado ao erro (401).
	 */
	public readonly statusCode = 401;

	/**
	 * Cria uma nova instância de `UnauthorizedError`.
	 * @param message Mensagem de erro personalizada (padrão: mensagem genérica de não autorizado).
	 * @param options Opções adicionais para o construtor de `Error`.
	 */
	constructor(
		message = "Não autorizado. Verifique as informações e tente novamente.",
		options?: ErrorOptions,
	) {
		super(message, options);

		// Corrige o protótipo para garantir instanceof funcional.
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

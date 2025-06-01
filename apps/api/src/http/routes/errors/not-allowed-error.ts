/**
 * Representa um erro de autorização devido à tentativa de executar uma ação proibida.
 * Usado quando um usuário autenticado tenta acessar ou manipular um recurso para o qual
 * ele não possui permissões suficientes.
 */
export class NotAllowedError extends Error {
	/**
	 * Nome da classe de erro.
	 */
	public readonly name = "NotAllowedError";
	/**
	 * Código HTTP correspondente ao erro de autorização (`403 Forbidden`).
	 */
	public readonly statusCode = 403;

	/**
	 * Cria uma nova instância de `NotAllowedError`.
	 * @param message Mensagem descritiva do erro.
	 * @param options Opções adicionais para o erro.
	 */
	constructor(
		message = "Ação não permitida. Você não tem permissão para realizar esta operação.",
		options?: ErrorOptions,
	) {
		super(message, options);

		// Corrige o protótipo para garantir instanceof funcional.
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

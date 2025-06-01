/**
 * Representa um erro de recurso não encontrado.
 * Usado quando uma entidade requisitada pelo cliente não pôde ser localizada no sistema.
 */
export class ResourceNotFoundError extends Error {
	/**
	 * Nome da classe de erro.
	 */
	public readonly name = "ResourceNotFoundError";
	/**
	 * Código HTTP correspondente ao erro de recurso não encontrado (`404 Not Found`).
	 */
	public readonly statusCode = 404;

	/**
	 * Cria uma nova instância de `ResourceNotFoundError`.
	 * @param message Mensagem descritiva do erro.
	 * @param options Opções adicionais para o erro.
	 */
	constructor(
		message = "Recurso não encontrado. Verifique se o recurso solicitado existe e tente novamente.",
		options?: ErrorOptions,
	) {
		super(message, options);

		// Corrige o protótipo para garantir instanceof funcional.
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

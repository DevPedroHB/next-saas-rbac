/**
 * Representa um erro lançado quando um recurso já existe no sistema.
 * Utilizado comumente em operações de criação (como cadastro ou inserção)
 * quando os dados fornecidos já estão presentes no sistema e não podem ser duplicados.
 */
export class AlreadyExistsError extends Error {
	/**
	 * Nome da classe de erro.
	 */
	public readonly name = "AlreadyExistsError";
	/**
	 * Código HTTP correspondente ao erro de conflito (`409 Conflict`).
	 */
	public readonly statusCode = 409;

	/**
	 * Cria uma nova instância de `AlreadyExistsError`.
	 * @param message Mensagem descritiva do erro.
	 * @param options Opções adicionais para o erro.
	 */
	constructor(
		message = "O recurso já existe. Por favor, tente utilizar informações diferentes.",
		options?: ErrorOptions,
	) {
		super(message, options);

		// Corrige o protótipo para garantir instanceof funcional.
		Object.setPrototypeOf(this, AlreadyExistsError.prototype);
	}
}

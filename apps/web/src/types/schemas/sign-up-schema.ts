import { z } from "zod";

export const signUpSchema = z
	.object({
		name: z.string().min(3),
		email: z.string().email(),
		password: z
			.string()
			.regex(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!"@#$%^&*?]).{6,32}$/, {
				message:
					"A senha deve conter de 6 a 32 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.",
			})
			.min(6)
			.max(32),
		confirmPassword: z
			.string()
			.regex(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!"@#$%^&*?]).{6,32}$/, {
				message:
					"A senha deve conter de 6 a 32 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.",
			})
			.min(6)
			.max(32),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas devem ser iguais.",
		path: ["confirmPassword"],
	});

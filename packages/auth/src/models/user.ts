export enum Role {
	ADMIN = "ADMIN",
	MEMBER = "MEMBER",
}

export interface User {
	role: Role;
}

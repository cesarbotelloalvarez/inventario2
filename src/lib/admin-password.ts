const TALLER_DELETE_PASSWORD = "taller2025";

export function assertTallerPassword(password: string) {
  if (password !== TALLER_DELETE_PASSWORD) {
    throw new Error("Contraseña incorrecta.");
  }
}

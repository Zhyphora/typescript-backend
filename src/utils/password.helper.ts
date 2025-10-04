import bcrypt from "bcrypt";

export class PasswordHelper {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Hash password menggunakan bcrypt
   * @param password - Plain text password
   * @returns Hashed password
   */
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Verify password dengan hash yang tersimpan
   * @param password - Plain text password
   * @param hashedPassword - Hashed password dari database
   * @returns true jika password cocok, false jika tidak
   */
  static async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}

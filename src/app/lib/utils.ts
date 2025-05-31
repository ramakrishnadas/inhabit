import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    console.log('Generated salt:', salt);

    const hash = await bcrypt.hash(password, salt);
    console.log('Hashed password:', hash);

    return hash;
  } catch (err) {
    console.error('Error hashing password:', err);
    throw err;
  }
}

// Overload signatures
export async function comparePasswords(password: string): Promise<boolean>;
export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean>;

// Implementation
export async function comparePasswords(
  password: string,
  hashedPassword?: string
): Promise<boolean> {
  try {
    if (hashedPassword) {
      // Compare provided password with provided hash
      return await bcrypt.compare(password, hashedPassword);
    } else {
      // For demonstration: hash password and compare it to itself (this always returns true)
      const hashed = await hashPassword(password);
      return await bcrypt.compare(password, hashed);
    }
  } catch (err) {
    console.error('Error comparing passwords:', err);
    throw err;
  }
}

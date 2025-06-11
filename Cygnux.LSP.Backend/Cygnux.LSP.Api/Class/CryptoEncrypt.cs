using System.Security.Cryptography;
using System.Text;

namespace Cygnux.LSP.Api.Class
{
    //public class CryptoEncrypt
    //{
    //}

    public static class PasswordHasher
    {
        public static string HashPassword(string password)
        {
            // Generate a salt
            byte[] salt = RandomNumberGenerator.GetBytes(16);

            // Hash the password with PBKDF2
            var hash = new Rfc2898DeriveBytes(password, salt, 100_000, HashAlgorithmName.SHA256);
            byte[] hashBytes = hash.GetBytes(32);

            // Combine salt + hash
            var combined = new byte[48];
            Buffer.BlockCopy(salt, 0, combined, 0, 16);
            Buffer.BlockCopy(hashBytes, 0, combined, 16, 32);

            return Convert.ToBase64String(combined);
        }

        public static bool VerifyPassword(string password, string hashedPassword)
        {
            byte[] combined = Convert.FromBase64String(hashedPassword);
            byte[] salt = new byte[16];
            byte[] storedHash = new byte[32];

            Buffer.BlockCopy(combined, 0, salt, 0, 16);
            Buffer.BlockCopy(combined, 16, storedHash, 0, 32);

            var hash = new Rfc2898DeriveBytes(password, salt, 100_000, HashAlgorithmName.SHA256);
            byte[] hashBytes = hash.GetBytes(32);

            return CryptographicOperations.FixedTimeEquals(hashBytes, storedHash);
        }

        public static string Encrypt(string plainText, string key)
        {
            using var aes = Aes.Create();
            aes.Key = Encoding.UTF8.GetBytes(key.PadRight(32)); // AES-256
            aes.GenerateIV();

            using var encryptor = aes.CreateEncryptor();
            byte[] inputBytes = Encoding.UTF8.GetBytes(plainText);
            byte[] encryptedBytes = encryptor.TransformFinalBlock(inputBytes, 0, inputBytes.Length);

            byte[] result = aes.IV.Concat(encryptedBytes).ToArray(); // Prepend IV
            return Convert.ToBase64String(result);
        }

        public static string Decrypt(string encryptedText, string key)
        {
            byte[] fullCipher = Convert.FromBase64String(encryptedText);

            using var aes = Aes.Create();
            aes.Key = Encoding.UTF8.GetBytes(key.PadRight(32));
            aes.IV = fullCipher.Take(16).ToArray();
            byte[] cipherBytes = fullCipher.Skip(16).ToArray();

            using var decryptor = aes.CreateDecryptor();
            byte[] decryptedBytes = decryptor.TransformFinalBlock(cipherBytes, 0, cipherBytes.Length);

            return Encoding.UTF8.GetString(decryptedBytes);
        }

    }
}
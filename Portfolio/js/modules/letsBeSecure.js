document.addEventListener('DOMContentLoaded', () => {

  toogleEye();

  const form = document.querySelector('.password-form');
  const passwordInput = document.querySelector('.password-input');

  // Elementos donde mostramos resultado
  const resultDiv = document.querySelector('.result');
  const encryptedPasswordElement = document.querySelector(
    '.encrypted-password'
  );
  const saltElement = document.querySelector('.salt');
  const iterationsElement = document.querySelector('.iterations');
  const uniquePasswordElement = document.querySelector('.unique-password');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const password = passwordInput.value.trim();
    if (!password) {
      alert('Por favor, ingresa una contraseña.');
      return;
    }

    // 1) Hashear la contraseña (PBKDF2 con sal e iteraciones)
    const { salt, hash, iterations } = await hashPasswordPBKDF2(password);

    // 2) Generar una contraseña única aleatoria
    const randomPassword = generateRandomPassword(16);

    // 3) Mostrar resultado
    encryptedPasswordElement.textContent = hash;
    saltElement.textContent = salt;
    iterationsElement.textContent = iterations;
    uniquePasswordElement.textContent = randomPassword;

    // 4) Quitar "hidden" y forzar la animación deslizante
    resultDiv.classList.remove('hidden'); // por si estaba oculta totalmente
    resultDiv.classList.add('show'); // activamos la animación
  });
});


/**
 * Why use PBKDF2?
 * Mainly because PBKDF2 or (Password-Based Key Derivation Function 2) is a standard function published on
 * RFC 8018 by "IEFT". Defining derivation tactics of keys and encryptioning based on passwords.
 * 
 * It combines a hash function like SHA-256 with a iterative process to increase the computational cost of attacks,
 * make them less feasible.
 * 
 * Resistance to Brute-Force Attacks: PBKDF2 introduces a configurable iteration factor, 
 * forcing attackers to perform multiple hashing operations for each attempt,  
 * significantly increasing the time required to crack passwords.
 * 
 * Wide Compatibility: PBKDF2 is widely supported in modern cryptographic libraries 
 * and is recognized as a reliable and secure technique.
 * 
 * By - ALEROC
 */


/**
 * Deriva un hash PBKDF2 (SHA-256) de 256 bits (32 bytes) a partir de una contraseña.
 * Retorna { salt, hash, iterations } en formato hex.
 */
async function hashPasswordPBKDF2(password) {
  const saltLength = 16; // 16 bytes de sal
  const iterations = 100000; // Ajusta según rendimiento y seguridad
  const keylenBits = 256; // 256 bits = 32 bytes

  // Generamos la sal aleatoria
  const saltArray = crypto.getRandomValues(new Uint8Array(saltLength));

  // Convertimos la contraseña a ArrayBuffer
  const encoder = new TextEncoder();
  const passBuffer = encoder.encode(password);

  // usamos la pass base para PBKDF2
  const baseKey = await crypto.subtle.importKey(
    'raw',
    passBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  // Derivamos 256 bits (32 bytes) usando PBKDF2
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltArray,
      iterations: iterations,
      hash: 'SHA-256',
    },
    baseKey,
    keylenBits
  );

  // Convertimos los bits (ArrayBuffer) a Hex
  const derivedBytes = new Uint8Array(derivedBits);
  const hashHex = Array.from(derivedBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // Salt to Hex
  const saltHex = Array.from(saltArray)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return {
    salt: saltHex,
    hash: hashHex,
    iterations,
  };
}

/**
 * Genera una contraseña aleatoria de la longitud indicada (por defecto 16).
 */
function generateRandomPassword(length = 16) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    const randomIndex = randomValues[i] % chars.length;
    result += chars[randomIndex];
  }
  return result;
}

function toogleEye() {
  const passwordInput = document.querySelector('.password-input');
  const togglePasswordButton = document.querySelector('.toggle-password');

  togglePasswordButton.addEventListener('click', () => {
    // Cambia el tipo de input entre "password" y "text"
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';

    // Cambia el icono (puedes usar un ícono dinámico si prefieres)
    togglePasswordButton.textContent = isPassword ? '🙈' : '👁️';
  });
}

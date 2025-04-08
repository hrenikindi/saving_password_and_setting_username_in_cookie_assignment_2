const MIN = 100;
const MAX = 999;
const pinInput = document.getElementById('pin');
const sha256HashView = document.getElementById('sha256-hash');
const resultView = document.getElementById('result');

// a function to store in the local storage
function store(key, value) {
  localStorage.setItem(key, value);
}

// a function to retrieve from the local storage
function retrieve(key) {
  return localStorage.getItem(key);
}

function getRandomArbitrary(min, max) {
  let cached;
  cached = Math.random() * (max - min) + min;
  cached = Math.floor(cached);
  return cached;
}

// a function to clear the local storage
function clear() {
  localStorage.clear();
}

/**
 * Generates SHA256 hash of a given string
 * SHA-256 produces a 256-bit (32-byte) hash value, typically rendered as a hexadecimal number
 * @param {string} message - The input string to hash
 * @returns {Promise<string>} - Hexadecimal string representation of the hash
 */
async function sha256(message) {
  // Step 1: Convert the message to UTF-8 encoded bytes
  const msgBuffer = new TextEncoder().encode(message);

  // Step 2: Compute the hash using Web Crypto API
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  // Step 3: Convert the hash from ArrayBuffer to regular Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // Step 4: Convert each byte to 2-digit hexadecimal string
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))  // Ensure each byte is 2 chars
    .join('');  // Combine all hexadecimal strings
  
  return hashHex;
}

async function getSHA256Hash() {
  let cached = retrieve('sha256');
  if (cached) {
    return cached;
  }

  cached = await sha256(getRandomArbitrary(MIN, MAX));
  store('sha256', cached);
  return cached;
}

async function main() {
  sha256HashView.innerHTML = 'Calculating...';
  const hash = await getSHA256Hash();
  sha256HashView.innerHTML = hash;
}

async function test() {
  const pin = pinInput.value;

  if (pin.length !== 3) {
    resultView.innerHTML = '💡 not 3 digits';
    resultView.classList.remove('hidden');
    return;
  }

  const sha256HashView = document.getElementById('sha256-hash');
  const hasedPin = await sha256(pin);

  if (hasedPin === sha256HashView.innerHTML) {
    resultView.innerHTML = '🎉 success';
    resultView.classList.add('success');
  } else {
    resultView.innerHTML = '❌ failed';
  }
  resultView.classList.remove('hidden');
}

// ensure pinInput only accepts numbers and is 3 digits long
pinInput.addEventListener('input', (e) => {
  const { value } = e.target;
  pinInput.value = value.replace(/\D/g, '').slice(0, 3);
});

// attach the test function to the button
document.getElementById('check').addEventListener('click', test);

main();

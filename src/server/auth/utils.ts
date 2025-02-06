import { compare } from "bcrypt-ts";

async function sha256Hash(input: string) {
    const msgUint8 = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return hashHex;
}

/**
 * This function will check if a hash is valid against a string.
 * This will be used for passwords
 *
 * This function is written to support the old sha256 hashing, as well as the new bcrypt
 */
export async function checkHash(input: string, hash: string) {
    const bcryptRegex = /^\$2[ayb]\$.+$/gm;

    if (bcryptRegex.test(hash)) {
        return await compare(input, hash);
    } else {
        return (await sha256Hash(input)) === hash;
    }
}

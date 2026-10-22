package config;

import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

/**
 * Builds the HMAC signing key from the configured secret (KONVO_JWT_SECRET).
 * The secret is never hardcoded: startup fails with a clear message when it is missing or too short.
 */
public final class JwtKeys {

    /** HS256 needs a key of at least 256 bits. */
    public static final int MIN_SECRET_BYTES = 32;

    private JwtKeys() {
    }

    public static SecretKey fromSecret(String secret) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException(
                    "KONVO_JWT_SECRET is not set. Add a random value of at least 32 characters to .env "
                            + "(for example the output of: openssl rand -hex 32).");
        }
        byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
        if (bytes.length < MIN_SECRET_BYTES) {
            throw new IllegalStateException(
                    "KONVO_JWT_SECRET is too short: it needs at least " + MIN_SECRET_BYTES + " bytes.");
        }
        return Keys.hmacShaKeyFor(bytes);
    }
}

package config;

import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

@Service
public class JwtProvider {

    private final SecretKey key;

    public JwtProvider(@Value("${konvo.jwt.secret:}") String secret) {
        this.key = JwtKeys.fromSecret(secret);
    }

    /** The signing key, shared with {@link JwtTokenValidator} so both always agree. */
    public SecretKey getKey() {
        return key;
    }

    public String generateToken(Authentication authentication) {
        String jwt = Jwts.builder()
                .claim("iat", System.currentTimeMillis() / 1000)
                .claim("exp", (System.currentTimeMillis() + 1000 * 60 * 60 * 24) / 1000)
                .claim("email", authentication.getName())
                .signWith(key)
                .compact();
        return jwt;
    }

    public String getEmailFromToken(String jwt) {
        // Handle Bearer prefix and whitespace
        if (jwt != null) {
            int bearerIndex = jwt.indexOf("Bearer ");
            if (bearerIndex != -1) {
                // Extract the token and remove ALL whitespace
                jwt = jwt.substring(bearerIndex + "Bearer ".length()).replaceAll("\\s", "");
            }
        }

        // Now parse the cleaned token
        return Jwts.parser().verifyWith(key).build()
                .parseSignedClaims(jwt).getPayload().get("email").toString();
    }
}

// Prompt: "How do I implement JWT token refresh functionality?"
// Prompt: "The JWT token validation is failing. How can I debug this issue?"

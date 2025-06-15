package config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.stream.Collectors;

@Service
public class JwtProvider {

    private final SecretKey key;

    public JwtProvider() {
        byte[] keyBytes = JwtConstant.SECRET_KEY.getBytes(StandardCharsets.UTF_8);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Authentication authentication) {
        String jwt = Jwts.builder()
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24 hours
                .claim("email", authentication.getName())
                .claim("authorities", authentication.getAuthorities()
                        .stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.joining(",")))
                .signWith(key)
                .compact();
        return jwt;
    }

//    public String getEmailFromToken(String jwt) {
//        return Jwts.parser().verifyWith(key).build()
//                .parseSignedClaims(jwt).getBody().get("email").toString();
//    }

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
            .parseSignedClaims(jwt).getBody().get("email").toString();
}
}

package config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.filter.OncePerRequestFilter;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import javax.crypto.SecretKey;
import java.io.IOException;

public class JwtTokenValidator extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenValidator.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String jwt = request.getHeader(JwtConstant.JWT_HEADER);
        logger.debug("Processing JWT token for request: {}", request.getRequestURI());

        if (jwt != null) {
            int bearerIndex = jwt.indexOf("Bearer ");
            if (bearerIndex != -1) {
                // Extract the token and aggressively remove ALL whitespace (visible or invisible)
                jwt = jwt.substring(bearerIndex + "Bearer ".length()).replaceAll("\\s", "");
                logger.debug("JWT token extracted successfully");
            } else {
                // If "Bearer " prefix is not found, treat it as an invalid JWT header format
                logger.warn("Bearer prefix not found in Authorization header");
                jwt = null; // Will skip JWT parsing block below
            }
        }

        if (jwt != null && !jwt.isEmpty()) {
            try {
                SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());
                Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(jwt).getPayload();

                String email = String.valueOf(claims.get("email"));
                // Always give every user the 'USER' authority using SimpleGrantedAuthority
                Authentication auth = new UsernamePasswordAuthenticationToken(email, null, java.util.Collections.singletonList(new SimpleGrantedAuthority("USER")));
                SecurityContextHolder.getContext().setAuthentication(auth);
                logger.debug("Authentication set successfully for user: {}", email);

            } catch (Exception e) {
                logger.error("JWT validation error: {}", e.getMessage());
                // Throw BadCredentialsException directly to be handled by Spring Security's ExceptionTranslationFilter
                throw new BadCredentialsException("Invalid or expired token", e);
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return request.getServletPath().startsWith("/auth/");
    }
}


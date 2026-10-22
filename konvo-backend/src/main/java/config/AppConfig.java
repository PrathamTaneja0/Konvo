package config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.List;
import static org.springframework.security.config.Customizer.withDefaults;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
@EnableWebSecurity
public class AppConfig {    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtTokenValidator jwtTokenValidator) throws Exception {
        http
            // CSRF only threatens credentials the browser attaches on its own (cookies, sessions).
            // Signup/signin carry none, and a bearer header can't be set cross-site without passing CORS,
            // so those are exempt; anything else still needs a CSRF token.
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/auth/**")
                .ignoringRequestMatchers(AppConfig::hasBearerToken)
            )
            .cors(withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/api/news", "/api/news/", "/api/news/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtTokenValidator, BasicAuthenticationFilter.class);
        
        return http.build();
    }

    private static boolean hasBearerToken(HttpServletRequest request) {
        String header = request.getHeader(JwtConstant.JWT_HEADER);
        return header != null && header.startsWith("Bearer ");
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtTokenValidator jwtTokenValidator(JwtProvider jwtProvider) {
        return new JwtTokenValidator(jwtProvider.getKey());
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost", "http://localhost:80"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}

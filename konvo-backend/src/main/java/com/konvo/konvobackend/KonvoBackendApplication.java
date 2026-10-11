package com.konvo.konvobackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"controller", "config", "service", "model", "repository", "dto", "dto_mapper"})
@EntityScan("model")
@EnableJpaRepositories("repository")
public class KonvoBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(KonvoBackendApplication.class, args);
    }

}

// Prompt: "How do I configure CORS for the Spring Boot application?"
// Prompt: "The application is not starting properly. How can I debug the startup issues?"

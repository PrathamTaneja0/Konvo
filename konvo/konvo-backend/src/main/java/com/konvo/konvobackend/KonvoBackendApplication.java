package com.konvo.konvobackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"controller", "config", "service", "model", "repository"})
@EntityScan("model")
@EnableJpaRepositories("repository")
public class KonvoBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(KonvoBackendApplication.class, args);
    }

}

package de.kinoapplikation.kino.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;

@Configuration
public class DbInitializer {

    @Bean
    CommandLineRunner initDb() {
        return args -> {
            Path dbPath = Path.of("kino6.db");

            if (Files.exists(dbPath)) {
                return;
            }

            ClassPathResource resource = new ClassPathResource("kino6.db");
            if (resource.exists()) {
                try (InputStream in = resource.getInputStream()) {
                    Files.copy(in, dbPath);
                }
            } else {
                // No bundled DB found — create an empty SQLite file so Hibernate can initialize it
                Files.createDirectories(dbPath.toAbsolutePath().getParent() == null ? Path.of(".") : dbPath.toAbsolutePath().getParent());
                Files.createFile(dbPath);
            }
        };
    }
}

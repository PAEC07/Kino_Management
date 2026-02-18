package de.kinoapplikation.kino.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import de.kinoapplikation.kino.entity.Benutzer;
import de.kinoapplikation.kino.repository.BenutzerRepository;

@Configuration
public class AdminSeeder {

    @Bean
    CommandLineRunner seedAdmin(BenutzerRepository repo, BCryptPasswordEncoder encoder) {
        return args -> {
            String adminUser = "admin";
            String adminEmail = "admin@kino.de";
            String adminPass = "admin12345"; // später ändern

            // Wenn schon ein Admin existiert -> nichts tun
            boolean adminExists = repo.findAll().stream()
                    .anyMatch(u -> u.getRole() != null && u.getRole().equalsIgnoreCase("ADMIN"));

            if (adminExists) return;

            // Wenn "admin" schon existiert -> auf ADMIN hochstufen
            var existing = repo.findByUsername(adminUser);
            if (existing.isPresent()) {
                Benutzer u = existing.get();
                u.setRole("ADMIN");
                repo.save(u);
                System.out.println("✅ Existing user 'admin' promoted to ADMIN");
                return;
            }

            Benutzer u = new Benutzer(adminUser, adminEmail, encoder.encode(adminPass));
            u.setRole("ADMIN");
            repo.save(u);

            System.out.println("✅ Admin seeded: username=admin password=" + adminPass);
        };
    }
}

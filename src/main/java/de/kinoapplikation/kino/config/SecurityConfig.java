package de.kinoapplikation.kino.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Für eure JSON-API + lokale Tests am einfachsten:
                .csrf(csrf -> csrf.disable())

                // WICHTIG: KEINE Spring-Loginseite mehr
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())

                // Alles erlauben (du machst Login/Register selber per JS+API)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/", "/index.html",
                                "/login.html", "/register.html",
                                "/Admin.html", "/Account.html",
                                "/css/**", "/js/**", "/img/**",
                                "/api/**"
                        ).permitAll()
                        .anyRequest().permitAll()
                )

                // CORS optional (wenn du später Frontend getrennt hostest)
                .cors(Customizer.withDefaults());

        return http.build();
    }
}

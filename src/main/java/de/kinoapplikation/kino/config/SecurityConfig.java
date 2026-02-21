package de.kinoapplikation.kino.config;

import de.kinoapplikation.kino.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .cors(Customizer.withDefaults())

                .authorizeHttpRequests(auth -> auth
                        // Static
                        .requestMatchers(
                                "/", "/index.html",
                                "/login.html", "/register.html",
                                "/Admin.html", "/Account.html",
                                "/css/**", "/js/**", "/img/**"
                        ).permitAll()

                        // Auth
                        .requestMatchers("/api/benutzer/login", "/api/benutzer/register").permitAll()

                        .requestMatchers("/api/saal/add").hasRole("ADMIN")
                        .requestMatchers("/api/saal/*/delete").hasRole("ADMIN")

                        .requestMatchers("/api/filme/add").hasRole("ADMIN")
                        .requestMatchers("/api/filme/*/delete").hasRole("ADMIN")

                        .requestMatchers("/api/vorstellungen/add").hasRole("ADMIN")
                        .requestMatchers("/api/vorstellungen/*/delete").hasRole("ADMIN")

                        // Rest API frei (oder später absichern)
                        .requestMatchers("/api/**").permitAll()

                        .anyRequest().permitAll()
                );

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}

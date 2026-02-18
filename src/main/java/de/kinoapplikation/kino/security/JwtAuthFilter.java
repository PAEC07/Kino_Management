package de.kinoapplikation.kino.security;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();

        // Auth endpoints nie filtern
        return path.startsWith("/api/benutzer/login") || path.startsWith("/api/benutzer/register");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring("Bearer ".length()).trim();

        try {
            Claims claims = jwtUtil.parseClaims(token);

            String userId = claims.getSubject();
            String username = String.valueOf(claims.get("username"));
            String role = String.valueOf(claims.get("role")); // USER/ADMIN

            // Spring erwartet Rollen als ROLE_*
            var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));

            var auth = new UsernamePasswordAuthenticationToken(
                    username,
                    null,
                    authorities
            );

            // optional: userId als detail
            auth.setDetails(userId);

            SecurityContextHolder.getContext().setAuthentication(auth);

        } catch (Exception e) {
            // Token ungültig -> nicht authentifiziert
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}

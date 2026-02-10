package de.kinoapplikation.kino.dto;

public class AuthDtos {

    public static class RegisterRequest {
        public String username;
        public String email;
        public String password;
        public String passwordConfirm;
    }

    public static class LoginRequest {
        public String username;
        public String password;
    }

    public static class AuthResponse {
        public boolean ok;
        public String message;
        public Long id;
        public String username;
        public String email;

        public AuthResponse() {}
        public AuthResponse(boolean ok, String message) {
            this.ok = ok;
            this.message = message;
        }

        public AuthResponse(boolean ok, String message, Long id, String username, String email) {
            this.ok = ok;
            this.message = message;
            this.id = id;
            this.username = username;
            this.email = email;
        }
    }
}

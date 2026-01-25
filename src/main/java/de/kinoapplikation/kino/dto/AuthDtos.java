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

        public AuthResponse() {}
        public AuthResponse(boolean ok, String message) {
            this.ok = ok;
            this.message = message;
        }
    }
}

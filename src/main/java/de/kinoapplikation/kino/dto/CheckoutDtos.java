package de.kinoapplikation.kino.dto;

import java.util.List;

public class CheckoutDtos {

    public static class CheckoutRequest {
        public Long benutzerId;
        public Long vorstellungId;
        public List<Long> sitzplatzIds;
    }

    public static class CheckoutResponse {
        public boolean ok;
        public String message;
        public Long buchungId;
        public long totalCents;

        public CheckoutResponse() {}

        public CheckoutResponse(boolean ok, String message, Long buchungId, long totalCents) {
            this.ok = ok;
            this.message = message;
            this.buchungId = buchungId;
            this.totalCents = totalCents;
        }
    }
}

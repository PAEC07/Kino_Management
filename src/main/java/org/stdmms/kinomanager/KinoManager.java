// Das hier definiert das Projekt "Main"
package org.stdmms.kinomanager;
import java.sql.*;

// NB 18.11.2025
public class KinoManager {
    
    public static void main(String[] args) {
        //Config auslesen
        //ConfigReader configReader = new ConfigReader();
        //Mit den Config Daten eine Verbindung zur DB herstellen
        Connector connector = new Connector("jdbc:sqlite:kino-v1.db", "", "");
        //TODO: Weiteren Programmablauf hier implementieren
        System.out.println("Verbindung zur Datenbank hergestellt.");
        Connection con = connector.getConnection();
        String sqlcmd = "SELECT * FROM Accounts;";
        System.out.println("Abfrage wird ausgeführt: " + sqlcmd);
        try {
            Statement state = con.createStatement();
            ResultSet rs = state.executeQuery(sqlcmd);
            System.out.println("Abfrage erfolgreich. Ergebnisse:");
            while (rs.next()) {
                System.out.println("tets");
                System.out.println("Account Mail: " + rs.getString("Email"));
            }
        } catch (Exception e) {
            System.out.println(e.toString());
        }
    }

    public static void logError(Exception e) {
        System.out.println(e.toString());
    }
}
//Hiermit soll eine verbindung zur Datenbank hergestellt werden
//Es dürfen hier keine Abfragen stattfinden; nur reinen verbindungsaufbau
package org.stdmms.kinomanager;

import java.sql.Connection;
import java.sql.DriverManager;
import org.stdmms.kinomanager.KinoManager;


// NB 18.11.2025
public class Connector {

    private String username;
    private String password;

    public Connector(String username, String password) {
        this.username = username;
        this.password = password;
        connectionService();
    }

   /**
    * Stellt eine verbindung zur Datenbank her
    * @param username Admin account of sqliteDB
    * @param password the password of the sqliteDB
    * @return database connection
    */
    //TODO: Verbindungsaufbau testen
    private Connection connectionService() {
        Connection conn = null;
        try {
            // Class.forName("org.sqlite.JDBC");
            if (username != null) {
                conn = DriverManager.getConnection("jdbc:sqlite:kino.db", username, password);
            } else {
                conn = DriverManager.getConnection("jdbc:sqlite:kino.db");
            }  
        } catch (Exception e) {
            logError(e);
        }
    }
}
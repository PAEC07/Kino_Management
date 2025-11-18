//Hiermit soll eine verbindung zur Datenbank hergestellt werden
//Es dürfen hier keine Abfragen stattfinden; nur reinen verbindungsaufbau
package org.stdmms.kinomanager;

import java.sql.Connection;
import java.sql.DriverManager;


// NB 18.11.2025
public class Connector {

    private String username;
    private String password;
    private String dblocation;
    private Connection conn;

    public Connector(String dblocation, String username, String password) {
        this.username = username;
        this.password = password;
        this.dblocation = dblocation;
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
        try {
            // Class.forName("org.sqlite.JDBC");
            if (username.isEmpty() || password.isEmpty()) {
                conn = DriverManager.getConnection(dblocation);
            } else {
                conn = DriverManager.getConnection(dblocation, username, password);
            }  
        } catch (Exception e) {
            KinoManager.logError(e);
        }
        return conn;
    }

    public Connection getConnection() {
        return conn;
    }
}
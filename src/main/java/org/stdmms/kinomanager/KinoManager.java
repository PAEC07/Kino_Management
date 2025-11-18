// Das hier definiert das Projekt "Main"
package org.stdmms.kinomanager;

// NB 18.11.2025
public class KinoManager {
    
    public static void main(String[] args) {
        //Config auslesen
        ConfigReader configReader = new ConfigReader();
        //Mit den Config Daten eine Verbindung zur DB herstellen
        Connector connector = new Connector(configReader.getDatabaseUrl(),
                                            configReader.getDatabaseUsername(),
                                            configReader.getDatabasePassword());
        //TODO: Weiteren Programmablauf hier implementieren
        //connector.getConnection();
    }

    public static void logError(Exception e) {
        System.out.println(e.toString());
    }
}
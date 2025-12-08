package org.stdmms.kinomanager;

import java.io.InputStream;
import org.yaml.snakeyaml.Yaml;
import java.util.Map;
import java.util.stream.Collectors;

public class ConfigReader {

    private Map<String, String> config;

    public ConfigReader() {
        loadConfig();
    }

    @SuppressWarnings("unchecked")
    private void loadConfig() {
        Yaml yaml = new Yaml();
        try (InputStream in = getClass().getClassLoader().getResourceAsStream("config.yaml")) {
            if (in == null) {
                throw new RuntimeException("config.yaml wurde nicht gefunden!");
            }
            Map<String, Object> tempConfig = yaml.load(in);

            Object dbObj = tempConfig.get("database");
            if (dbObj instanceof Map) {
                config = ((Map<?, ?>) dbObj).entrySet().stream()
                        .collect(Collectors.toMap(
                                e -> e.getKey().toString(),
                                e -> e.getValue().toString()));
            } else {
                throw new RuntimeException("Fehler: 'database' Abschnitt fehlt oder ist ungültig.");
            }

        } catch (Exception e) {
            KinoManager.logError(e);
        }
    }

    public String getDbUrl() {
        return config.get("url");
    }

    public String getDbUsername() {
        return config.get("username");
    }

    public String getDbPassword() {
        return config.get("password");
    }
}
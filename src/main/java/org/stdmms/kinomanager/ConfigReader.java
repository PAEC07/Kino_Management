/*
package org.stdmms.kinomanager;
import java.io.InputStream;
import org.yaml.snakeyaml.Yaml;
import java.util.Map;

public class ConfigReader {

    private Map<String, String> config;

    public ConfigReader() {
        loadConfig();
    }

    @SuppressWarnings("unchecked")
    private void loadConfig() {
        Yaml yaml = new Yaml();
        try (InputStream in = this.getClass().getClassLoader().getResourceAsStream("config.yaml")) {
            Map<String, Object> tempConfig;
            tempConfig = yaml.load(in);
            config = (Map<String, String>) tempConfig.get("database");
        } catch (Exception e) {
            KinoManager.logError(e);
        }
    }

    public String getDatabaseUrl() {
        return config.get("url");
    }

    public String getDatabaseUsername() {
        return config.get("username");
    }

    public String getDatabasePassword() {
        return config.get("password");
    }
}*/
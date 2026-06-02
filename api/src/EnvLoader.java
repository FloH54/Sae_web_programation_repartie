import java.io.*;
import java.util.HashMap;
import java.util.Map;

public class EnvLoader {

    public static Map<String, String> load(String path) {
        Map<String, String> env = new HashMap<>();

        try (BufferedReader br = new BufferedReader(new FileReader(path))) {
            String line;

            while ((line = br.readLine()) != null) {
                line = line.trim();

                if (line.isEmpty() || line.startsWith("#")) continue;

                String[] parts = line.split("=", 2);
                if (parts.length == 2) {
                    env.put(parts[0], parts[1]);
                }
            }

        } catch (IOException e) {
            e.printStackTrace();
        }

        return env;
    }
}
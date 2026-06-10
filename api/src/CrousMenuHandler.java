import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

public class CrousMenuHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) {
        try {
            String id = getQueryParam(exchange.getRequestURI().getQuery(), "id");

            if (id == null || id.isBlank()) {
                sendJson(exchange, 400, "{\"error\":\"Parametre id manquant\"}");
                return;
            }

            URL url = new URL("https://api.croustillant.menu/v1/restaurants/" + id + "/menu");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            int status = conn.getResponseCode();
            InputStream stream = status >= 400 ? conn.getErrorStream() : conn.getInputStream();

            if (stream == null) {
                sendJson(exchange, 502, "{\"error\":\"api error\"}");
                return;
            }

            BufferedReader reader = new BufferedReader(new InputStreamReader(stream, "UTF-8"));
            StringBuilder responseBuilder = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                responseBuilder.append(line);
            }
            reader.close();

            byte[] response = responseBuilder.toString().getBytes("UTF-8");

            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Content-Type", "application/json; charset=UTF-8");
            exchange.sendResponseHeaders(status, response.length);

            OutputStream os = exchange.getResponseBody();
            os.write(response);
            os.close();

        } catch (Exception e) {
            e.printStackTrace();

            try {
                sendJson(exchange, 500, "{\"error\":\"api error\"}");
            } catch (Exception ignored) {}
        }
    }

    private String getQueryParam(String query, String key) {
        if (query == null) return null;

        for (String param : query.split("&")) {
            String[] kv = param.split("=", 2);
            if (kv.length == 2 && kv[0].equals(key)) {
                return kv[1];
            }
        }

        return null;
    }

    private void sendJson(HttpExchange exchange, int status, String body) throws IOException {
        byte[] response = body.getBytes("UTF-8");

        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Content-Type", "application/json; charset=UTF-8");
        exchange.sendResponseHeaders(status, response.length);

        OutputStream os = exchange.getResponseBody();
        os.write(response);
        os.close();
    }
}

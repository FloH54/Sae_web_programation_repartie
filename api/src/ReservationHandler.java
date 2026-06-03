import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ReservationHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) {

        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "POST, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            try {
                exchange.sendResponseHeaders(204, -1);
            } catch (Exception ignored) {}
            return;
        }

        try {
            InputStream is = exchange.getRequestBody();
            String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);

            String nom         = extractString(body, "nom");
            String prenom      = extractString(body, "prenom");
            String telephone   = extractString(body, "telephone");
            String nbStr       = extractValue(body, "nbPersonnes");
            String restIdStr   = extractValue(body, "restaurantId");

            if (nbStr == null || restIdStr == null || nbStr.isBlank() || restIdStr.isBlank()) {
                sendJson(exchange, 400, "{\"error\":\"Champs manquants ou vides\"}");
                return;
            }

            int nbPersonnes  = Integer.parseInt(nbStr);
            int restaurantId = Integer.parseInt(restIdStr);

            Connection conn = Database.getConnection();
            String sql = "INSERT INTO reservations (id_rest, nom, prenom, nb_personne, telephone, date) " +
                        "VALUES (?, ?, ?, ?, ?, NOW())";

            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setInt(1, restaurantId);
                stmt.setString(2, nom);
                stmt.setString(3, prenom);
                stmt.setInt(4, nbPersonnes);
                stmt.setString(5, telephone);
                stmt.executeUpdate();
            }

            sendJson(exchange, 201, "{\"message\":\"Reservation creee\"}");

        } catch (NumberFormatException e) {
            sendJson(exchange, 400, "{\"error\":\"nbPersonnes et restaurantId doivent etre des entiers\"}");
        } catch (IllegalArgumentException e) {
            sendJson(exchange, 400, "{\"error\":\"" + e.getMessage() + "\"}");
        } catch (Exception e) {
            e.printStackTrace();
            sendJson(exchange, 500, "{\"error\":\"Erreur serveur\"}");
        }
    }

    private String extractString(String json, String key) {
        Pattern p = Pattern.compile("\"" + key + "\"\\s*:\\s*\"([^\"]*)\"");
        Matcher m = p.matcher(json);
        if (m.find()) return m.group(1);
        throw new IllegalArgumentException("Champ manquant : " + key);
    }

    private String extractValue(String json, String key) {
        Pattern p = Pattern.compile("\"" + key + "\"\\s*:\\s*(-?\\d+)");
        Matcher m = p.matcher(json);
        if (m.find()) return m.group(1);
        return null;
    }

    private void sendJson(HttpExchange exchange, int status, String json) {
        try {
            byte[] response = json.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json; charset=UTF-8");
            exchange.sendResponseHeaders(status, response.length);
            OutputStream os = exchange.getResponseBody();
            os.write(response);
            os.close();
        } catch (Exception ignored) {}
    }
}
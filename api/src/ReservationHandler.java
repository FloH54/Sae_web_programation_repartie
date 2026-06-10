import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.sql.*;
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

        Connection conn = null;

        try {

            InputStream is = exchange.getRequestBody();
            String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);

            String nom = extractString(body, "nom");
            String prenom = extractString(body, "prenom");
            String telephone = extractString(body, "telephone");
            String date = extractString(body, "date");

            String nbStr = extractValue(body, "nbPersonnes");
            String restIdStr = extractValue(body, "restaurantId");

            if (nbStr == null || restIdStr == null) {
                sendJson(exchange, 400, "{\"error\":\"Champs manquants\"}");
                return;
            }

            int nbPersonnes = Integer.parseInt(nbStr);
            int restaurantId = Integer.parseInt(restIdStr);

            conn = Database.getConnection();
            conn.setAutoCommit(false);

            int capacite;

            String sqlRestaurant =
                    "SELECT nbPlace FROM restaurants WHERE id = ? FOR UPDATE";

            try (PreparedStatement stmt = conn.prepareStatement(sqlRestaurant)) {

                stmt.setInt(1, restaurantId);

                ResultSet rs = stmt.executeQuery();

                if (!rs.next()) {
                    conn.rollback();
                    sendJson(exchange, 404, "{\"error\":\"Restaurant introuvable\"}");
                    return;
                }

                capacite = rs.getInt("nbPlace");
            }

            int dejaReserve = 0;

            String sqlRes =
                    "SELECT COALESCE(SUM(nb_personne),0) " +
                    "FROM reservations " +
                    "WHERE id_rest = ? AND DATE(date) = ? FOR UPDATE";

            try (PreparedStatement stmt = conn.prepareStatement(sqlRes)) {

                stmt.setInt(1, restaurantId);
                stmt.setString(2, date);

                ResultSet rs = stmt.executeQuery();

                if (rs.next()) {
                    dejaReserve = rs.getInt(1);
                }
            }

            int reste = capacite - dejaReserve;

            if (nbPersonnes > reste) {
                conn.rollback();
                sendJson(exchange, 409,
                        "{\"error\":\"Il ne reste que " + reste + " place(s)\"}");
                return;
            }

            String insert =
                    "INSERT INTO reservations (id_rest, nom, prenom, nb_personne, telephone, date) " +
                    "VALUES (?, ?, ?, ?, ?, ?)";

            try (PreparedStatement stmt = conn.prepareStatement(insert)) {

                stmt.setInt(1, restaurantId);
                stmt.setString(2, nom);
                stmt.setString(3, prenom);
                stmt.setInt(4, nbPersonnes);
                stmt.setString(5, telephone);
                stmt.setString(6, date);

                stmt.executeUpdate();
            }

            conn.commit();

            sendJson(exchange, 201, "{\"message\":\"Reservation creee\"}");

        } catch (Exception e) {

            try {
                if (conn != null) conn.rollback();
            } catch (SQLException ignored) {}

            e.printStackTrace();
            sendJson(exchange, 500, "{\"error\":\"Erreur serveur\"}");

        } finally {

            try {
                if (conn != null) conn.setAutoCommit(true);
            } catch (SQLException ignored) {}
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
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.OutputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class RestaurantHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) {

        try {
            Connection conn = Database.getConnection();

            String sql = "SELECT id, nom, adresse, gps FROM restaurants";
            PreparedStatement stmt = conn.prepareStatement(sql);

            ResultSet rs = stmt.executeQuery();

            StringBuilder json = new StringBuilder();
            json.append("[");

            boolean first = true;

            while (rs.next()) {

                if (!first) json.append(",");
                first = false;

                json.append("{")
                    .append("\"id\":").append(rs.getInt("id")).append(",")
                    .append("\"nom\":\"").append(escape(rs.getString("nom"))).append("\",")
                    .append("\"adresse\":\"").append(escape(rs.getString("adresse"))).append("\",")
                    .append("\"gps\":\"").append(escape(rs.getString("gps"))).append("\"")
                    .append("}");
            }

            json.append("]");

            byte[] response = json.toString().getBytes("UTF-8");

            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

            exchange.getResponseHeaders().add("Content-Type", "application/json; charset=UTF-8");
            exchange.sendResponseHeaders(200, response.length);

            OutputStream os = exchange.getResponseBody();
            os.write(response);
            os.close();

        } catch (Exception e) {
            e.printStackTrace();

            try {
                String error = "{\"error\":\"database error\"}";
                byte[] response = error.getBytes("UTF-8");

                exchange.sendResponseHeaders(500, response.length);

                OutputStream os = exchange.getResponseBody();
                os.write(response);
                os.close();

            } catch (Exception ignored) {}
        }
    }

    private String escape(String str) {
        if (str == null) return "";
        return str.replace("\"", "\\\"");
    }
}
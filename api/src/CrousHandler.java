import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONArray;
import org.json.JSONObject;

public class CrousHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) {
        try {
            URL url = new URL("https://api.croustillant.menu/v1/restaurants");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            BufferedReader reader = new BufferedReader(
                new InputStreamReader(conn.getInputStream(), "UTF-8")
            );

            StringBuilder responseBuilder = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                responseBuilder.append(line);
            }
            reader.close();

            JSONObject root = new JSONObject(responseBuilder.toString());
            JSONArray data = root.getJSONArray("data");

            JSONArray filtered = new JSONArray();

            // 3. Filtrer region.code == 19
            for (int i = 0; i < data.length(); i++) {
                JSONObject resto = data.getJSONObject(i);
                JSONObject region = resto.getJSONObject("region");

                if (region.getInt("code") == 19) {
                    // On garde seulement certaines infos (comme RestaurantHandler)
                    JSONObject obj = new JSONObject();
                    obj.put("nom", resto.getString("nom"));
                    obj.put("adresse", resto.getString("adresse"));
                    obj.put("latitude", resto.getDouble("latitude"));
                    obj.put("longitude", resto.getDouble("longitude"));

                    filtered.put(obj);
                }
            }

            byte[] response = filtered.toString().getBytes("UTF-8");

            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Content-Type", "application/json; charset=UTF-8");

            exchange.sendResponseHeaders(200, response.length);

            OutputStream os = exchange.getResponseBody();
            os.write(response);
            os.close();

        } catch (Exception e) {
            e.printStackTrace();

            try {
                String error = "{\"error\":\"api error\"}";
                byte[] response = error.getBytes("UTF-8");

                exchange.sendResponseHeaders(500, response.length);

                OutputStream os = exchange.getResponseBody();
                os.write(response);
                os.close();

            } catch (Exception ignored) {}
        }
    }
}
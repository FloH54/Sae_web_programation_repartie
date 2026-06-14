import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import java.util.Map;

// javac -cp ".;../lib/*" *.java
// java -cp ".;../lib/*;." Main

public class Main {

    public static void main(String[] args) throws Exception {
        Class.forName("org.mariadb.jdbc.Driver");

        Map<String, String> env = EnvLoader.load("../.env");

        Database.init(env);

        System.setProperty("http.proxyHost", "www-cache.iutnc.univ-lorraine.fr");
        System.setProperty("http.proxyPort", "3128");
        System.setProperty("https.proxyHost", "www-cache.iutnc.univ-lorraine.fr");
        System.setProperty("https.proxyPort", "3128");

        ArrayList<Route> routesList = new ArrayList<>();

        routesList.add(new Route("ping", PingHandler.class));
        routesList.add(new Route("road", RoadHandler.class));
        routesList.add(new Route("restaurants", RestaurantHandler.class));
        routesList.add(new Route("reservation", ReservationHandler.class));
        routesList.add(new Route("crous", CrousHandler.class));
        routesList.add(new Route("crous/menu", CrousMenuHandler.class));

        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        for (Route route : routesList) {
            server.createContext("/" + route.name,
                    (HttpHandler) route.classRoute.getDeclaredConstructor().newInstance());
        }

        server.setExecutor(null);
        server.start();

        System.out.println("Serveur démarré sur http://localhost:8080");
    }
}
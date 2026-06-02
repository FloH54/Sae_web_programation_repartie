import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Main {

    public static void main(String[] args) throws Exception {
        ArrayList<Route> routesList = new ArrayList<>();

        routesList.add(new Route("ping", PingHandler.class));
        routesList.add(new Route("road", RoadHandler.class));

        // Création du serveur sur le port 8080
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        // Définition de la route /ping

        for (int i = 0; i < routesList.size(); i++) {
            server.createContext("/" + routesList.get(i).name, (HttpHandler) routesList.get(i).classRoute.getDeclaredConstructor().newInstance());
        }

        // Lancement du serveur
        server.setExecutor(null);
        server.start();

        System.out.println("Serveur démarré sur http://localhost:8080");
    }
}
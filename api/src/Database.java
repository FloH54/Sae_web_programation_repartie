import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Map;

public class Database {

    private static Connection connection;
    private static String url;
    private static String user;
    private static String pass;

    public static void init(Map<String, String> env) {
        try {
            String host = env.get("DB_HOST");
            String port = env.get("DB_PORT");
            String db   = env.get("DB_NAME");
            user        = env.get("DB_USER");
            pass        = env.get("DB_PASSWORD");

            url = "jdbc:mariadb://" + host + ":" + port + "/" + db;

            connection = DriverManager.getConnection(url, user, pass);

            System.out.println("✅ Connexion DB réussie");

        } catch (SQLException e) {
            System.out.println("❌ Erreur connexion DB");
            e.printStackTrace();
        }
    }

    public static Connection getConnection() throws SQLException {
        if (connection == null || connection.isClosed() || !connection.isValid(2)) {
            System.out.println("🔄 Reconnexion DB...");
            connection = DriverManager.getConnection(url, user, pass);
        }
        return connection;
    }
}
import com.sun.net.httpserver.HttpHandler;

public class Route {
    public String name;
    public Class classRoute;

    public Route(String n, Class h){
        name = n;
        classRoute = h;
    }
}

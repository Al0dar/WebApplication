package springs.network.web;

import com.sun.net.httpserver.*;

import java.net.InetSocketAddress;

import springs.network.web.session.WebSessions;

public class WebServer {

    public static HttpServer server;
    public static WebSessions sessions;

    public static void create(Integer port) throws Exception {

        boolean useSSL = true;
        if (useSSL)
            server = SSLHelper.CreateHTTPSServer(port);
        else
            server = HttpServer.create(new InetSocketAddress(port), 0);

        sessions = new WebSessions();

        System.out.println("Web server created @ http" + (useSSL ? "s" : "") + "://localhost:" + port);

    }

    public static void listen(String path, HttpHandler handler) {
        HttpContext context = server.createContext(path);
        context.setHandler(handler);
        System.out.println("Web server is listening for " + path);
    }

    public static void start() {
        server.setExecutor(null);
        server.start();
        System.out.println("Web server started");
    }

    public static Responder getResponder(HttpExchange exchange, String handlerName) {
        Responder rv = getResponder(exchange);
        System.out.println(handlerName + " responding to " + rv.getUrl());
        return rv;
    }

    public static Responder getResponder(HttpExchange exchange) {
        return new Responder(exchange);
    }

}

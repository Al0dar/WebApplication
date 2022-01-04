package springs.network.web;

import com.sun.net.httpserver.*;
import springs.network.web.session.WebSessions;

import javax.net.ssl.*;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.security.KeyStore;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

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

        System.out.println("Web server created @ localhost:" + port);
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

    public static Responder getResponder(HttpExchange exchange) throws IOException {
        return new Responder(exchange);
    }

}

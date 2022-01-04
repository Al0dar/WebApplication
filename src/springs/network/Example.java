package springs.network;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import springs.network.web.Responder;
import springs.network.web.WebServer;

import java.io.IOException;
import java.time.*;
import java.util.List;

public class Example {

    // TODO : check that the URI is valid (eg. /favicon.ico is not valid for handleHome)

    public static void start() throws Exception {
        WebServer.create(8500);
        WebServer.listen("/", Example::handleHome);
        WebServer.listen("/static/", Example::handleStatic);
        WebServer.listen("/saveimage/", Example::handleSaveImage);
        WebServer.listen("/info", Example::handleInfo);
        WebServer.start();
    }

    private static void handleHome(HttpExchange exchange) throws IOException {
        Responder r = WebServer.getResponder(exchange);
        System.out.println("handleHome: " + exchange.getRequestURI().getPath());
        r.startHtml();
        r.out("<html>");
        r.out("<body>");
        r.outln("<b>Home</b>");
        r.outln("<img src='/static/images/home.jpg' width=100px/>");
        r.outln("Hello :)");
        r.outln("<a href='/info'>information</a><br/>");
        r.outln("<a href='/static/test/index.html'>static test</a>");
        r.out("</body>");
        r.out("</html>");
        r.end();
    }

    private static void handleStatic(HttpExchange exchange) throws IOException {
        Responder r = WebServer.getResponder(exchange);
        String fileName = Helper.RootPath() + exchange.getRequestURI().getPath();
        r.respondWithFile(fileName);
    }

    private static void handleSaveImage(HttpExchange exchange) throws IOException {
        Responder r = WebServer.getResponder(exchange);
        String url = exchange.getRequestURI().getPath();
        System.out.println("handleSaveImage: " + url);
        String rootPath = Helper.RootPath() + "/static/images/saved/";
        String prefix = "/saveimage/";
        String fileName = rootPath + url.substring(prefix.length());
        r.saveToFile(fileName);
    }

    private static void handleInfo(HttpExchange exchange) throws IOException {
        Responder r = WebServer.getResponder(exchange);
        r.startHtml();
        r.out("<html>");
        r.out("<body>");
        r.outln("<b>Information</b>");
        r.outln("a random number : " + Math.random() + "");
        r.out("the local date and time : ");
        r.outln(LocalDate.now() + " " + LocalTime.now() + "");
        r.outln("information from the request headers");
        r.out_HelperRequestHeaders();
        r.outln("cookies");
        r.out_HelperCookies();
        r.outln("<a href='/'>home</a>");
        r.out("</body>");
        r.out("</html>");
        r.end();
    }

}

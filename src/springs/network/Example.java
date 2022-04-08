package springs.network;

import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.time.*;

import springs.network.web.*;

public class Example {

    /*
        todo
            filter URIs, only allowing 'whitelisted' characters.
            check that URIs are valid and accessible.
    */

    public static void start() throws Exception {
        WebServer.create(443);
        WebServer.listen("/", Example::handleHome);

        // http://springs.network/.well-known/pki-validation/fileauth.txt
        WebServer.listen("/.well-known/pki-validation/fileauth.txt", Example::handleSSLValidation);

        WebServer.listen("/favicon.ico", Example::handleFavIcon);
        WebServer.listen("/static/", Example::handleStatic);
        WebServer.listen("/saveimage/", Example::handleSaveImage);
        WebServer.listen("/info", Example::handleInfo);
        WebServer.start();
    }

    private static void handleHome(HttpExchange exchange) throws IOException {
        Responder r = WebServer.getResponder(exchange, "Example.handleHome");
        r.startHtml();
        r.out("<html>");
        r.out("<body>");
        r.outln("<b>Home</b>");
        r.outln("<img src='/static/images/home.jpg' width=100px/>");
        r.outln("");
        r.outln("Hello World");
        r.outln("");
        r.outln("<a href='/info'>information</a>");
        r.outln("<a href='/static/test/index.html'>static test</a>");
        r.out("</body>");
        r.out("</html>");
        r.end();
    }

    private static void handleFavIcon(HttpExchange exchange) throws IOException {
        Responder r = WebServer.getResponder(exchange, "Example.handleFavIcon");
        r.respondWithFile(Helper.RootPath() + "/static/images/favicon.png");
    }

    private static void handleSSLValidation(HttpExchange exchange) throws IOException {
        Responder r = WebServer.getResponder(exchange, "Example.handleSSLValidation");
        r.respondWithFile(Helper.RootPath() + "/static/SSLValidation/fileauth.txt");
    }

    private static void handleStatic(HttpExchange exchange) throws IOException {
        Responder r = WebServer.getResponder(exchange, "Example.handleStatic");
        String fileName = Helper.RootPath() + r.getUrl();
        if (fileName.toLowerCase().trim().endsWith(".fooml")) {
            r.startHtml();
            r.out("<html>");
            r.out("<body>");
            r.outHtmlFromFooML(fileName);
            r.out("</body>");
            r.out("</html>");
            r.end();
        }
        else
            r.respondWithFile(fileName);
    }

    private static void handleSaveImage(HttpExchange exchange) {
        boolean haveWriteAccess = false; // insecure at the moment: URLs need filtering
        if (haveWriteAccess) {
            Responder r = WebServer.getResponder(exchange, "Example.handleSaveImage");
            String rootPath = Helper.RootPath() + "/static/";
            String prefixToRemove = "/saveimage/";
            String fileName = rootPath + r.getUrl().substring(prefixToRemove.length());
            r.saveToFile(fileName);
        }
    }

    private static void handleInfo(HttpExchange exchange) throws IOException {
        Responder r = WebServer.getResponder(exchange, "Example.handleInfo");
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

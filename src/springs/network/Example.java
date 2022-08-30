package springs.network;

import com.sun.net.httpserver.HttpExchange;

import java.io.File;
import java.io.IOException;
import java.time.*;
import java.util.ArrayList;

import com.sun.xml.internal.fastinfoset.util.StringArray;
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
        WebServer.listen("/favicon.ico", Example::handleFavIcon);
        WebServer.listen("/static/", Example::handleStatic);
        WebServer.listen("/info", Example::handleInfo);
        WebServer.listen("/timer/", Example::handleTimer);
        WebServer.listen("/reverse", Example::handleReverse);
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
        r.outln("<a href='/reverse'>reverse</a>");
        r.outln("<a href='/static/test/index.html'>static test</a>");
        r.outln("<a href='/timer/x'>timer</a>");
        r.out("</body>");
        r.out("</html>");
        r.end();
    }

    private static void handleFavIcon(HttpExchange exchange) throws IOException {
        Responder r = WebServer.getResponder(exchange, "Example.handleFavIcon");
        File file = new File(Helper.RootPath() + "/static/images/favicon.png");
        r.respondWithFile(file);
    }

    private static void handleStatic(HttpExchange exchange) throws IOException {
        Responder r = WebServer.getResponder(exchange, "Example.handleStatic");
        String fileName = Helper.RootPath() + r.getUrl();
        String method = r.getRequestMethod().toLowerCase();

        // method : get
        if (method.equals("get")) {
            File file = new File(fileName);
            if (file != null) {
                if (file.isDirectory()) {
                    respondStaticFolder(r, file);
                } else {
                    if (fileName.toLowerCase().trim().endsWith(".fooml")) {
                        respondStaticFooml(r, fileName);
                    } else
                        respondStaticFile(r, file);
                }
            }
        }

        // method : post
        if (method.equals("post")) {
            boolean haveWriteAccess = true; // insecure at the moment: URLs need filtering
            if (haveWriteAccess) {
                r.saveToFile(fileName);
                r.start();
                r.out("success");
                r.end();
            }
        }

    }

    private static void respondStaticFile(Responder r, File file) throws IOException {
        r.respondWithFile(file);
    }

    private static void respondStaticFolder(Responder r, File folder) throws IOException {
        r.startHtml();
        r.out("<html>");
        r.out("<body>");
        String name = folder.getName();
        String[] l = folder.list();
        for (String s : l) {
            r.out("<a href='" + name + "/" + s + "'>");
            r.out(s);
            r.outln("</a>");
        }
        r.out("</body>");
        r.out("</html>");
        r.end();
    }

    private static void respondStaticFooml(Responder r, String fileName) throws IOException {
        r.startHtml();
        r.out("<html>");
        r.out("<body>");
        r.outHtmlFromFooML(fileName);
        r.out("</body>");
        r.out("</html>");
        r.end();
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

    private static void handleTimer(HttpExchange exchange) throws IOException {
        Responder r = WebServer.getResponder(exchange, "Example.handleTimer");
        r.startHtml();
        r.out("<html>");
        r.out("<body>");
        r.outln("<b>Timer</b>");

        r.out("starting: ");
        r.outln(LocalDate.now() + " " + LocalTime.now() + "");

        r.out("sleeping..: ");
        try {
            java.lang.Thread.sleep(5000);
            r.out("finished: ");
        }
        catch (Exception ex) {
            r.outln("error sleeping: " + ex.getMessage());
        }
        r.outln(LocalDate.now() + " " + LocalTime.now() + "");

        r.outln("<a href='/'>home</a>");

        r.out("</body>");
        r.out("</html>");
        r.end();
    }



    private static void handleReverse(HttpExchange exchange) throws IOException {
        Responder r = WebServer.getResponder(exchange, "Example.handleReverse");

        PlanActions actions = new PlanActions();
        actions.add(new PlanAction("drive to H house B46 3FJ", 30));
        actions.add(new PlanAction("say hello to H and Pebble", 5));
        actions.add(new PlanAction("open Google Maps on phone, and search for Snow Hill Car Park", 5));
        actions.add(new PlanAction("drive from H house to Snow Hill Car Park", 30));
        actions.add(new PlanAction("park in Snow Hill Car Park and walk to Great Western Arcade", 10));
        actions.add(new PlanAction("eat", 60));
        actions.add(new PlanAction("walk to and leave Snow Hill Car Park", 10));
        actions.add(new PlanAction("drive to and park in Newhall St Car Park, Birmingham B3 1SW", 10));
        actions.add(new PlanAction("walk to Church", 10));
        actions.add(new PlanAction("enter Church", 5));
        actions.add(new PlanAction("concert starts", 0));

        r.startHtml();
        r.out("<html><head><title>Reverse</title></head>");
        r.out("<body>");
        r.outln("<b>Reverse</b>");

        LocalDate date = LocalDate.of (2022, 8, 27);
        LocalTime time = LocalTime.of (18, 30);

        r.outln();
        r.outln("target time : " + date + " " + time);
        r.outln();

        PlanActions reverseActions = new PlanActions();
        for (PlanAction a : actions)
            reverseActions.add(0, a);

        ArrayList<String> strings = new ArrayList<>();

        for (PlanAction a : reverseActions) {
            time = time.minusMinutes(a.Minutes);
            strings.add(0, "<u>" + time + "</u> <b>" + a.Name + " - <i>" + a.Minutes + " minutes</i></b>");
        }

        for (String s : strings) {
            r.outln(s);
        }
        r.outln();

        r.outln("<a href='/'>home</a>");

        r.out("</body>");
        r.out("</html>");
        r.end();
    }

}

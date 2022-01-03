package springs.network.web;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import springs.network.web.session.WebSession;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.nio.file.Files;
import java.util.Collections;
import java.util.List;

public class Responder {

    private HttpExchange exchange;
    private OutputStream responseBody;
    private RequestCookies requestCookies;

    private WebSession session;

    private String outSuffix = "";
    private String outlnSuffix = "";

    public Responder(HttpExchange exchange) {
        this.exchange = exchange;
        responseBody = exchange.getResponseBody();
    }

    public void startHtml() throws IOException {
        resolveSession();
        exchange.sendResponseHeaders(HttpURLConnection.HTTP_OK, 0);
        outSuffix = "\n";
        outlnSuffix = "<br/>\n";
    }

    public void out(String s) throws IOException {
        responseBody.write(s.getBytes());
        responseBody.write(outSuffix.getBytes());
    }

    public void outln(String s) throws IOException {
        responseBody.write(s.getBytes());
        responseBody.write(outlnSuffix.getBytes());
    }

    public void end() throws IOException {
        responseBody.close();
    }

    public void respondWithFile(String fileName) throws IOException {

        // set the content type within the response headers
        if (fileName.toLowerCase().endsWith(".svg")) {
            exchange.getResponseHeaders().put("Content-Type", Collections.singletonList("image/svg+xml"));
        }

        // send the response headers
        exchange.sendResponseHeaders(HttpURLConnection.HTTP_OK, 0);

        // try to send the file contents within the response body
        try {
            File file = new File(fileName);
            Files.copy(file.toPath(), responseBody);
        } catch (Exception ex) {
        }

        // close the response body
        responseBody.close();

    }

    public String getRequestCookie(String key) {
        String rv = "";
        RequestCookies rc = getRequestCookies();
        if (rc.containsKey(key))
            rv = rc.get(key);
        return rv;
    }

    private void resolveSession() {
        String sessionKey = getRequestCookie("sessionKey");
        session = WebServer.sessions.get(sessionKey);
        setResponseCookie("sessionKey", session.key);
    }

    private void setResponseCookie(String key, String value) {
        exchange.getResponseHeaders().add("Set-Cookie", key + "=" + value + "; path=/");
    }

    private RequestCookies getRequestCookies() {
        if (requestCookies == null)
            requestCookies = new RequestCookies(exchange);
        return requestCookies;
    }

    public void out_HelperRequestHeaders() throws IOException {
        Headers h = exchange.getRequestHeaders();
        for (String key : h.keySet()) {
            List values = h.get(key);
            String s = key + " = " + values.toString();
            outln(s);
        }
    }

    public void out_HelperCookies() throws IOException {
        RequestCookies rc = getRequestCookies();
        for (String key : rc.keySet()) {
            out("cookie : key = [" + key + "]");
            out(" value = [" + rc.get(key) + "]");
        }
        outln("testCookie = " + getRequestCookie("testCookie"));
    }

}

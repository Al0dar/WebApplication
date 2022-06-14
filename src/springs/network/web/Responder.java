package springs.network.web;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;

import java.io.*;
import java.net.HttpURLConnection;
import java.nio.file.Files;
import java.util.Collections;
import java.util.List;

import springs.network.web.session.*;

public class Responder {

    private HttpExchange exchange;
    private InputStream requestBody;
    private OutputStream responseBody;
    private RequestCookies requestCookies;

    private WebSession session;

    private String outSuffix = "";
    private String outlnSuffix = "";

    public Responder(HttpExchange exchange) {
        this.exchange = exchange;
        requestBody = exchange.getRequestBody();
        responseBody = exchange.getResponseBody();
    }

    public String getUrl() {
        return exchange.getRequestURI().getPath();
    }

    public String getRequestMethod() {
        return exchange.getRequestMethod().toLowerCase();
    }

    public void start() throws IOException {
        resolveSession();
        exchange.sendResponseHeaders(HttpURLConnection.HTTP_OK, 0);
    }

    public void startHtml() throws IOException {
        start();
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
            ex.printStackTrace();
        }

        // close the response body
        responseBody.close();

    }

    public void outHtmlFromFooML(String fileName) throws IOException {
        try (BufferedReader br = new BufferedReader(new FileReader(fileName))) {
            String line;
            while ((line = br.readLine()) != null) {
                String trim = line.trim();
                out("<div>");
                if (trim.startsWith("#")) {
                    out("<i>" + line + "</i>");
                } else if (trim.startsWith("*")) {
                    out("<b>" + trim.substring(1) + "</b>");
                } else
                    out(line);
                out("</div><br/>");
            }
        }
    }

    public void saveToFile(String fileName) {
        try {
            File file = new File(fileName);
            file.createNewFile();
            FileOutputStream outputStream = new FileOutputStream(file);
            byte[] buffer = new byte[16 * 1024];
            int bytesRead;
            while ((bytesRead = requestBody.read(buffer)) != -1)
                outputStream.write(buffer, 0, bytesRead);
            outputStream.close();
        } catch (Exception ex) {
            System.out.println("?:" + ex.toString());
        }
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
            List<String> values = h.get(key);
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

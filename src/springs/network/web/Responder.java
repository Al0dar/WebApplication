package springs.network.web;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;

import java.io.*;
import java.net.HttpURLConnection;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.LongAdder;

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

    public void outln() throws IOException {
        outln("");
    }

    public void outln(String s) throws IOException {
        responseBody.write(s.getBytes());
        responseBody.write(outlnSuffix.getBytes());
    }

    public void end() throws IOException {
        responseBody.close();
    }

    public void respondWithFile(File file) throws IOException {

        String name = file.getName().toLowerCase();

        // set the content type within the response headers
        if (name.endsWith(".svg")) {
            exchange.getResponseHeaders().put("Content-Type", Collections.singletonList("image/svg+xml"));
        }

        // send the response headers
        exchange.sendResponseHeaders(HttpURLConnection.HTTP_OK, 0);

        // try to send the file contents within the response body
        try {
            Files.copy(file.toPath(), responseBody);
        } catch (Exception ex) {
            System.out.println("* error : " + ex.toString());
            // ex.printStackTrace();
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

    public void convertFile_WebKitFormBoundary(String fromFileName, String toFileName) {
        try {
            File fromFile = new File(fromFileName);
            FileInputStream inputStream = new FileInputStream(fromFile);

            Long fileSize = fromFile.length();
            System.out.println("file size:" + fileSize);

            File toFile = new File(toFileName);
            toFile.createNewFile();
            FileOutputStream outputStream = new FileOutputStream(toFile);

            LongAdder bytesReadCount = new LongAdder();

            // read first 4 lines
            for (int i=0; i<4; i++) {
                String line = readln(inputStream, bytesReadCount);
            }
            System.out.println("bytesReadCount:" + bytesReadCount.toString());

            {
                long bytesRemaining = fileSize - bytesReadCount.longValue();
                bytesRemaining -= 46;
                System.out.println("bytesRemaining:" + bytesRemaining);

                int bufferSize = 16 * 1024;
                byte[] buffer = new byte[bufferSize];
                boolean stay = true;
                while (stay) {

                    int bytesRead = inputStream.read(buffer);
                    if (bytesRead > 0) {

                        int bytesToOutput = bytesRead;
                        if (bytesToOutput > bytesRemaining) {
                            bytesToOutput = (int)bytesRemaining;
                            stay = false;
                        }
                        outputStream.write(buffer, 0, bytesToOutput);
                        bytesRemaining -= bytesRead;

                    } else {
                        stay = false; // end of stream
                    }

                }
            }

            outputStream.close();

        } catch (Exception ex) {
            System.out.println("?:" + ex.toString());
        }
    }

    private String readln(FileInputStream inputStream, LongAdder outBytesReadCount) throws IOException {
        // return the next line of text from the input stream
        String line = "";

        boolean was_nl1 = false;
        boolean was_nl2 = false;

        boolean stay = true;
        while (stay) { // until we've read a line or reached the end
            byte[] buffer = new byte[1];
            int bytesRead = inputStream.read(buffer); // todo: check bytesRead?
            if (bytesRead == 1) {

                outBytesReadCount.add(1);

                byte b = buffer[0];
                boolean is_nl1 = (b == 13);
                boolean is_nl2 = (b == 10);
                boolean isEndOfLine = false;
                if (is_nl1) {
                    if (was_nl2)
                        isEndOfLine = true;
                } else if (is_nl2) {
                    if (was_nl1)
                        isEndOfLine = true;
                } else {
                    line += (char)b;
                }
                if (isEndOfLine) {
                    stay = false; // finished reading line
                }
                was_nl1 = is_nl1;
                was_nl2 = is_nl2;
            } else { // end of input stream
                stay = false;
            }
        }

        return line;
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

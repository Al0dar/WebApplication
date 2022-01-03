package springs.network.web;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;

import java.util.HashMap;
import java.util.List;

public class RequestCookies extends HashMap<String, String> {

    public RequestCookies(HttpExchange exchange) {
        Headers h = exchange.getRequestHeaders();
        List<String> values = h.get("Cookie");
        if (values != null) {
            extractValues(values);
        }
    }

    private void extractValues(List<String> values) {
        for (String all : values) {
            String[] pairs = all.split(";");
            for (String pair : pairs)
                extractPair(pair);
        }
    }

    private void extractPair(String pair) {
        String[] kv = pair.split("=");
        try {
            String key = kv[0].trim();
            String value = kv[1].trim();
            put(key, value);
        } catch (Exception ex) {}
    }

}

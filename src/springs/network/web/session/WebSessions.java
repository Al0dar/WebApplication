package springs.network.web.session;

import java.util.Hashtable;
import java.util.Random;

public class WebSessions {

    private Hashtable<String, WebSession> sessions = new Hashtable<>();

    public WebSession get(String key) {
        WebSession rv = null;
        if (sessions.containsKey(key))
            rv = sessions.get(key);
        if (rv == null) {
            rv = new WebSession(getNewUniqueKey());
            sessions.put(rv.key, rv);
        }
        return rv;
    }

    private String getNewUniqueKey() {
        String rv = "";
        boolean done = false;
        while (!done) {
            String k = getRandomString(20);
            if (!sessions.containsKey(k)) {
                rv = k;
                done = true;
            }
        }
        return rv;
    }

    private String getRandomString(Integer length) {
        String sc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        StringBuilder sb = new StringBuilder();
        Random rnd = new Random();
        while (sb.length() < length) {
            int index = (int) (rnd.nextFloat() * sc.length());
            sb.append(sc.charAt(index));
        }
        return sb.toString();
    }

}

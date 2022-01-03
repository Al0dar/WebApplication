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
            server = CreateHTTPSServer(port);
        else
            server = CreateHTTPServer(port);

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

    public static HttpServer CreateHTTPSServer(Integer port) throws Exception {

        // implementation note : to generate the testkey.jks file, use the following from a command prompt :-
        //
        //      keytool -genkeypair -keyalg RSA -alias selfsigned -keystore testkey.jks -storepass password -validity 360 -keysize 2048
        //
        // then move the file into the 'working folder'.
        // You can determine the 'working folder' path in java by using System.getProperty("user.dir")

        HttpServer rv = null;

        try {
            // setup the socket address
            InetSocketAddress address = new InetSocketAddress(port);

            // initialise the HTTPS server
            HttpsServer httpsServer = HttpsServer.create(address, 0);
            SSLContext sslContext = SSLContext.getInstance("TLS");

            // initialise the keystore
            char[] password = "password".toCharArray();
            KeyStore ks = KeyStore.getInstance("JKS");
            FileInputStream fis = new FileInputStream("testkey.jks");
            ks.load(fis, password);

            // setup the key manager factory
            KeyManagerFactory kmf = KeyManagerFactory.getInstance("SunX509");
            kmf.init(ks, password);

            // setup the trust manager factory
            TrustManagerFactory tmf = TrustManagerFactory.getInstance("SunX509");
            tmf.init(ks);

            // setup the HTTPS context and parameters
            sslContext.init(kmf.getKeyManagers(), tmf.getTrustManagers(), null);
            httpsServer.setHttpsConfigurator(new HttpsConfigurator(sslContext) {
                public void configure(HttpsParameters params) {
                    try {
                        // initialise the SSL context
                        SSLContext context = getSSLContext();
                        SSLEngine engine = context.createSSLEngine();
                        params.setNeedClientAuth(false);
                        params.setCipherSuites(engine.getEnabledCipherSuites());
                        params.setProtocols(engine.getEnabledProtocols());

                        // Set the SSL parameters
                        SSLParameters sslParameters = context.getSupportedSSLParameters();
                        params.setSSLParameters(sslParameters);

                    } catch (Exception ex) {
                        System.out.println("Failed to create HTTPS port");
                    }
                }
            });

            rv = httpsServer;

        } catch (Exception exception) {
            System.out.println("Failed to create HTTPS server on port " + port);
            exception.printStackTrace();
        }

        return rv;
    }

    public static HttpServer CreateHTTPServer(Integer port) throws Exception {
        return HttpServer.create(new InetSocketAddress(port), 0);
    }

}

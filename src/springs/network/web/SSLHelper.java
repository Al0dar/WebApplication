package springs.network.web;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpsConfigurator;
import com.sun.net.httpserver.HttpsParameters;
import com.sun.net.httpserver.HttpsServer;

import javax.net.ssl.*;
import java.io.FileInputStream;
import java.net.InetSocketAddress;
import java.security.KeyStore;
import java.security.cert.Certificate;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Enumeration;

public class SSLHelper {

    public static HttpServer CreateHTTPSServer(Integer port) {

        // note: to generate the testkey.jks file
        // '#keytool -genkeypair -keyalg RSA -alias selfsigned -keystore testkey.jks -storepass password -validity 360 -keysize 2048
        // then: move the file into the working folder.
        // 'note: you can determine the working folder path in java like this
        // ''#System.getProperty("user.dir")

        HttpServer rv = null;

        try {

            // setup the socket address
            InetSocketAddress address = new InetSocketAddress(port);

            // initialise the HTTPS server
            HttpsServer httpsServer = HttpsServer.create(address, 0);
            SSLContext sslContext = SSLContext.getInstance("TLS");

            // initialise the keystore

            // to import a certificate in PEM format into a keystore, keytool will do the job:
            //     # keytool -import -alias *alias* -keystore cacerts -file *cert.pem*

            // # keytool -import -alias TestDigiCert01 -keystore cacerts -file springs.network.pem

            KeyStore ks = null;
            char[] password = null;

            try {
                System.out.print("trying to open cacerts: ");
                ks = KeyStore.getInstance("JKS");
                password = "T3stD1g1Cert01".toCharArray();
                FileInputStream fis = new FileInputStream("cacerts.xxx");
                ks.load(fis, password);
                System.out.println("ok.");
            } catch (Exception ex) {
                System.out.println("failed, defaulting to last known working configuration.");
                ks = KeyStore.getInstance("JKS");
                password = "password".toCharArray();
                FileInputStream fis = new FileInputStream("testkey.jks");
                ks.load(fis, password);
            }

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

}

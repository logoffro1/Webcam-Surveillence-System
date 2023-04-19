package org.example;
import com.github.sarxos.webcam.Webcam;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.websocket.server.WebSocketHandler;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.swing.*;


public class Main {
    static {
        Webcam.setDriver(new OpenImajDriver());
    }
    private static final Logger LOG = LoggerFactory.getLogger(Main.class);

    public static void main(String[] args) throws Exception {

        for (String name : WebcamCache.getWebcamNames()) {
            LOG.info("Will read webcam {}", name);

        }
        JFrame window = new JFrame("Test webcam panel");
        window.setSize(600,400);
        window.setResizable(false);
        window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        window.pack();
        window.setVisible(true);
        Server server = new Server(8123);
        WebSocketHandler wsHandler = new WebSocketHandler() {

            @Override
            public void configure(WebSocketServletFactory factory) {
                factory.register(WebcamWebSocketHandler.class);
            }
        };

        server.setHandler(wsHandler);
        server.start();
        server.join();
    }
}

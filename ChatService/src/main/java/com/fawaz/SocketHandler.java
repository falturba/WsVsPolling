package com.fawaz;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;

public class SocketHandler extends TextWebSocketHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(SocketHandler.class);
    private static final int MESSAGE_SIZE_LIMIT = 100;
    private static final int USERNAME_SIZE_LIMIT = 35;

    private ConcurrentHashMap<String, Session> sessions = new ConcurrentHashMap<>();

    @Override
    public void handleTextMessage(WebSocketSession webSocketSession, TextMessage textMessage) throws IOException {
        Session senderSession = sessions.get(webSocketSession.getId());
        for (Session receiverSession : sessions.values()) {
            String message = new StringBuilder(MESSAGE_SIZE_LIMIT + USERNAME_SIZE_LIMIT)
                    .append(senderSession.getColorHex())
                    .append(':')
                    .append(senderSession.getUserName())
                    .append(": ")
                    .append(textMessage.getPayload())
                    .toString();
            synchronized (receiverSession.getWebSocketSession()) {
                receiverSession.getWebSocketSession().sendMessage(new TextMessage(message));
            }

            HttpPollingHandler.messagesBuffer.get(receiverSession.getUserName()).add(message);
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession webSocketSession) throws IOException {
        URI uri = webSocketSession.getUri();
        if (uri == null) {
            LOGGER.error("Failed to get the uri");
            webSocketSession.close(CloseStatus.BAD_DATA);
            return;
        }

        String pathQuery = webSocketSession.getUri().getPath();
        if (pathQuery == null) {
            LOGGER.error("Failed to get the path");
            webSocketSession.close(CloseStatus.BAD_DATA);
            return;
        }

        String userName = pathQuery.substring(pathQuery.lastIndexOf('/') + 1);
        if (userName.isBlank() || userName.length() > USERNAME_SIZE_LIMIT) {
            LOGGER.error("Invalid username");
            webSocketSession.close(CloseStatus.BAD_DATA);
            return;
        }

        webSocketSession.setTextMessageSizeLimit(MESSAGE_SIZE_LIMIT);

        LOGGER.info("Adding new session {} for username {}", webSocketSession.getId(), userName);
        Session session = new Session();
        session.setUserName(userName);
        session.setWebSocketSession(webSocketSession);

        if (sessions.values().stream().map(Session::getUserName).anyMatch(userName::equalsIgnoreCase)) {
            LOGGER.info("Username {} is taken", userName);
            webSocketSession.close(CloseStatus.NOT_ACCEPTABLE);
            return;
        }

        sessions.put(webSocketSession.getId(), session);
        HttpPollingHandler.messagesBuffer.put(userName, new ArrayList<>());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession webSocketSession, CloseStatus status) throws Exception {
        Session session = sessions.get(webSocketSession.getId());
        if (session != null) {
            LOGGER.info("Connection closed by {}", session.getUserName());
            sessions.remove(webSocketSession.getId());
        }

        super.afterConnectionClosed(webSocketSession, status);
    }
}
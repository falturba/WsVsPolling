package com.fawaz;

import lombok.Data;
import org.springframework.web.socket.WebSocketSession;

import java.awt.*;
import java.util.Random;

@Data
public class Session  {

    private static final float MIN_BRIGHTNESS = 0.8f;

    public Session() {
        Random random = new Random();
        float h = random.nextFloat();
        float s = random.nextFloat();
        float b = MIN_BRIGHTNESS + ((1f - MIN_BRIGHTNESS) * random.nextFloat());
        Color color = Color.getHSBColor(h, s, b);
        this.colorHex = String.format("#%02x%02x%02x", color.getRed(), color.getGreen(), color.getBlue());
    }

    private String userName;
    private WebSocketSession webSocketSession;
    private String colorHex;
}

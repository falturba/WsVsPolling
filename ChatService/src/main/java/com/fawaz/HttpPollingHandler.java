package com.fawaz;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
public class HttpPollingHandler {
    public static HashMap<String, List<String>> messagesBuffer = new HashMap<>();

    @GetMapping("/messages/{userName}")
    public ResponseEntity<List<String>> getMessages(@PathVariable String userName) throws InterruptedException {
        if (messagesBuffer.get(userName) == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (messagesBuffer.get(userName).size() == 0) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        List<String> messages = new ArrayList<>(messagesBuffer.get(userName));
        messagesBuffer.get(userName).clear();
        return ResponseEntity.ok(messages);
    }
}

package com.common.infra;

import java.util.HashMap;
import java.util.Map;

public class HttpCorsHeader {

    public static Map<String, String> get() {
        final var headers = new HashMap<String, String>();
        headers.put("Content-Type", "application/json");
        headers.put("Access-Control-Allow-Origin", "*");
        headers.put("Access-Control-Allow-Credentials", "true");
        return headers;
    }

}

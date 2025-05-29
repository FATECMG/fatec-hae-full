package com.common.infra;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HttpResponse<T> {
    
    private Integer status;
    private T body;
    
    public HttpResponse(Integer status, T body) {
        this.status = status;
        this.body = body;
    }
    
    public static <T> HttpResponse<T> ok(T body) {
        return new HttpResponse<>(200, body);
    }

    public static <T> HttpResponse<T> badRequest(T body) {
        return new HttpResponse<>(400,body);
    }
    
    public static <T> HttpResponse<T> serverError(T body) {
        return new HttpResponse<>(500,body);
    }
}

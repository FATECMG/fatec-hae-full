package com.serverless.handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.common.infra.HttpCorsHeader;
import com.core.statistic.controller.GetStatisticController;

import static com.core.statistic.factory.StatisticFactory.CreateGetStatisticController;

import com.serverless.ApiGatewayResponse;
import org.apache.log4j.Logger;

import java.util.Map;

public class GetStatisticHandler implements RequestHandler<Map<String, Object>, ApiGatewayResponse> {

    private static final Logger LOG = Logger.getLogger(GetStatisticHandler.class);
    private final GetStatisticController controller = CreateGetStatisticController();

    @Override
    public ApiGatewayResponse handleRequest(Map<String, Object> input, Context context) {
        LOG.info("Received GET/ statistic request");
        var response = controller.handle();
        return ApiGatewayResponse.builder()
                .setStatusCode(response.getStatus())
                .setObjectBody(response.getBody())
                .setHeaders(HttpCorsHeader.get())
                .build();
    }
}

package com.serverless.handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.common.infra.HttpCorsHeader;
import com.core.statistic.controller.PostStatisticController;
import com.serverless.ApiGatewayResponse;
import org.apache.log4j.Logger;

import java.util.Map;

import static com.core.statistic.factory.StatisticFactory.CreatePostStatisticController;

public class PostStatisticHandler implements RequestHandler<Map<String, Object>, ApiGatewayResponse> {

    private static final Logger LOG = Logger.getLogger(PostStatisticHandler.class);
    private final PostStatisticController controller = CreatePostStatisticController();

    @Override
    public ApiGatewayResponse handleRequest(Map<String, Object> input, Context context) {
        LOG.info("Received POST/ statistic request");
        var response = controller.handle();
        return ApiGatewayResponse.builder()
                .setStatusCode(response.getStatus())
                .setObjectBody(response.getBody())
                .setHeaders(HttpCorsHeader.get())
                .build();
    }
}

package com.core.statistic.controller;

import com.common.infra.HttpResponse;
import com.core.statistic.exception.StatisticsNotReadyException;
import com.core.statistic.usecases.GetStatistics;
import lombok.AllArgsConstructor;

import static com.common.infra.HttpResponse.*;

@AllArgsConstructor
public class GetStatisticController {

    private final GetStatistics useCase;

    public HttpResponse<?> handle() {
        try {
            return ok(useCase.execute());
        } catch (Exception e) {
            if(e instanceof StatisticsNotReadyException)
                return badRequest(e.getMessage());

            return serverError(e.getStackTrace());
        }
    }
}

package com.core.statistic.controller;

import com.common.infra.HttpResponse;
import com.common.infra.HttpSimpleMessage;
import com.core.statistic.exception.StatisticsNotReadyException;
import com.core.statistic.usecases.UpdateStatistics;
import lombok.AllArgsConstructor;

import static com.common.infra.HttpResponse.*;

@AllArgsConstructor
public class PostStatisticController {

    private final UpdateStatistics useCase;


    public HttpResponse<?> handle() {
        try {
            useCase.execute();
            return ok(new HttpSimpleMessage("Estatísticas atualizadas com sucesso!"));
        } catch (Exception e) {
            if(e instanceof StatisticsNotReadyException)
                return badRequest(e.getMessage());

            return serverError(e.getStackTrace());
        }
    }
}

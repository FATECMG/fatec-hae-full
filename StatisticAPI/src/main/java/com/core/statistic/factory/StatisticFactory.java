package com.core.statistic.factory;

import com.core.statistic.controller.GetStatisticController;
import com.core.statistic.controller.PostStatisticController;
import com.core.statistic.domain.Statistic;
import com.core.statistic.usecases.GetStatistics;
import com.core.statistic.usecases.UpdateStatistics;
import com.core.statistic.usecases.actions.UpdateAction;
import com.core.statistic.usecases.actions.UpdateActionComposite;

import static com.common.infra.MongoSingleton.getMongoProjectInstance;
import static com.common.infra.MongoSingleton.getMongoStatisticInstance;

public class StatisticFactory {

    public static GetStatistics CreateGetStatisticUseCase() {
        final var repository = getMongoStatisticInstance();
        return new GetStatistics(repository);
    }

    public static GetStatisticController CreateGetStatisticController() {
        final var useCase = CreateGetStatisticUseCase();
        return new GetStatisticController(useCase);
    }

    public static UpdateStatistics CreateUpdateStatisticUseCase() {
        final var statisticRepository = getMongoStatisticInstance();
        final var projectRepository = getMongoProjectInstance();
        final UpdateAction<Statistic> updateActions = new UpdateActionComposite();
        return new UpdateStatistics(statisticRepository, projectRepository, updateActions);
    }

    public static PostStatisticController CreatePostStatisticController() {
        final var useCase = CreateUpdateStatisticUseCase();
        return new PostStatisticController(useCase);
    }
}

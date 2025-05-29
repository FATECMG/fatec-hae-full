package com.core.statistic.usecases;

import com.core.project.infra.IMongoProjectRepository;
import com.core.statistic.domain.Statistic;
import com.core.statistic.domain.StatisticStatus;
import com.core.statistic.infra.IMongoStatisticRepository;
import com.core.statistic.usecases.actions.UpdateAction;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class UpdateStatistics {

    private final IMongoStatisticRepository statisticRepository;
    private final IMongoProjectRepository projectRepository;
    private final UpdateAction<Statistic> actions;

    public void execute() {
        final var projects = projectRepository.getProjects();
        statisticRepository.updateStatus(StatisticStatus.UPDATING);
        final var updatedStatistic = actions.update(projects);
        statisticRepository.updateStatistic(updatedStatistic);
        statisticRepository.updateStatus(StatisticStatus.READY);
    }
}

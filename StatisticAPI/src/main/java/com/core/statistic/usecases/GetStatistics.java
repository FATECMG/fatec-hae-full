package com.core.statistic.usecases;

import com.core.statistic.domain.Statistic;
import com.core.statistic.exception.StatisticsNotReadyException;
import com.core.statistic.infra.IMongoStatisticRepository;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class GetStatistics {

    private final IMongoStatisticRepository repository;

    public Statistic execute() {
        if(this.isStatisticBeingUpdated()) {
            throw new StatisticsNotReadyException();
        }
        return repository.getStatistic();
    }

    private boolean isStatisticBeingUpdated() {
        return repository.isStatisticBeingUpdated();
    }
}

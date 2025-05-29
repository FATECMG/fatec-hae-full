package com.core.statistic.infra;

import com.core.statistic.domain.Statistic;
import com.core.statistic.domain.StatisticStatus;

public interface IMongoStatisticRepository {

    Statistic getStatistic();
    boolean isStatisticBeingUpdated();
    void updateStatus(StatisticStatus status);
    void updateStatistic(Statistic statistic);
}

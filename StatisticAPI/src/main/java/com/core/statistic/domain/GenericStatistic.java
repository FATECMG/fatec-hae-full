package com.core.statistic.domain;

import lombok.Data;

import java.util.List;

@Data
public class GenericStatistic<T> {

    private int total;
    private List<T> statistics;

    public GenericStatistic<T> withTotal(int total) {
        this.total = total;
        return this;
    }

    public GenericStatistic<T> withStatistics(List<T> statistics) {
        this.statistics = statistics;
        return this;
    }
}

package com.core.statistic.domain;

import lombok.Getter;

@Getter
public enum StatisticStatus {

    READY("READY"),
    UPDATING("UPDATING");

    private final String value;

    StatisticStatus(String status) {
        this.value = status;
    }
}

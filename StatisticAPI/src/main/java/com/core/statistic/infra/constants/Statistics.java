package com.core.statistic.infra.constants;

import lombok.Getter;

@Getter
public enum Statistics {

    GENERAL("general"),
    BY_TOPIC("byTopic"),
    BY_COURSE("byCourse"),
    BY_NOTICE("byNotice");


    public final String value;

    Statistics(String value) {
        this.value = value;
    }
}
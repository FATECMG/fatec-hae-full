package com.core.statistic.infra.constants;

import lombok.Getter;

@Getter
public enum ByTopic {

    TOPIC_NAME("topicName"),
    TOTAL_PROJECTS("totalProjects");

    public final String value;

    ByTopic(String value) {
        this.value = value;
    }
}

package com.core.statistic.infra.constants;

import lombok.Getter;

@Getter
public enum ByCourse {

    COURSE_NAME("courseName"),
    TOTAL_PROJECTS("totalProjects"),
    APPROVED_PROJECTS("approvedProjects"),
    REJECTED_PROJECTS("rejectedProjects"),
    PENDING_PROJECTS("pendingProjects");

    public final String value;

    ByCourse(String value) {
        this.value = value;
    }
}
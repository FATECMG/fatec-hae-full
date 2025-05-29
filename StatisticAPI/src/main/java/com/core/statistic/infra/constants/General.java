package com.core.statistic.infra.constants;

import lombok.Getter;

@Getter
public enum General {

    TOTAL_PROJECTS("totalProjects"),
    APPROVED_PROJECTS("approvedProjects"),
    REJECTED_PROJECTS("rejectedProjects"),
    PENDING_PROJECTS("pendingProjects"),
    DRAFT_PROJECTS("draftProjects"),
    PROJECTS_WITH_REPORT("projectsWithReport"),
    PROJECTS_WITHOUT_REPORT("projectsWithoutReport");

    public final String value;

    General(String value) {
        this.value = value;
    }
}
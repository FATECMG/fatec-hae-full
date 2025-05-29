package com.core.statistic.domain;

import lombok.Data;

@Data
public class ProjectStatistic {

    private int totalProjects;
    private int projectsWithReport;
    private int projectsWithoutReport;
    private int approvedProjects;
    private int rejectedProjects;
    private int pendingProjects;
    private int draftProjects;
}

package com.core.statistic.domain;

import lombok.Data;

@Data
public class CourseStatistic {

    private String courseName;
    private int totalProjects;
    private int approvedProjects;
    private int rejectedProjects;
    private int pendingProjects;
}

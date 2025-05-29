package com.core.statistic.usecases.actions;

import com.core.project.domain.Project;
import com.core.statistic.domain.ProjectStatistic;

import java.util.List;

public class UpdateGeneralAction implements UpdateAction<ProjectStatistic> {

    @Override
    public ProjectStatistic update(List<Project> list) {
        final var generalStatistic = new ProjectStatistic();
        generalStatistic.setTotalProjects(list.size());
        generalStatistic.setProjectsWithReport(0);
        generalStatistic.setProjectsWithoutReport(0);
        generalStatistic.setApprovedProjects(this.getApprovedProjects(list));
        generalStatistic.setRejectedProjects(this.getRejectedProjects(list));
        generalStatistic.setDraftProjects(this.getDraftProjects(list));
        generalStatistic.setPendingProjects(this.getPendingProjects(list));
        return generalStatistic;
    }

    private int getApprovedProjects(List<Project> list) {
        return list.stream().filter(Project::isApproved).toList().size();
    }

    private int getRejectedProjects(List<Project> list) {
        return list.stream().filter(Project::isRejected).toList().size();
    }

    private int getDraftProjects(List<Project> list) {
        return list.stream().filter(Project::isDraft).toList().size();
    }

    private int getPendingProjects(List<Project> list) {
        return list.stream().filter(Project::isPending).toList().size();
    }
}

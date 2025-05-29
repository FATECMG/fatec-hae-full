package com.core.statistic.usecases.actions;

import com.core.project.domain.Project;
import com.core.statistic.domain.CourseStatistic;
import com.core.statistic.domain.GenericStatistic;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class UpdateCourseAction implements UpdateAction<GenericStatistic<CourseStatistic>> {

    @Override
    public GenericStatistic<CourseStatistic> update(List<Project> list) {
        final var uniqueCourses = list.stream()
                                      .map(Project::getCourse)
                                      .distinct()
                                      .toList();


        return this.generateCourseStatistics(uniqueCourses, list);
    }

    private GenericStatistic<CourseStatistic> generateCourseStatistics(List<String> uniqueCourses, List<Project> list) {
        final int total = uniqueCourses.size();
        final List<CourseStatistic> noticeStatistics = new ArrayList<>();

        uniqueCourses.forEach(eachCourse -> {
            final var noticeStatistic = new CourseStatistic();
            noticeStatistic.setCourseName(eachCourse);
            noticeStatistic.setTotalProjects(this.getTotalProjects(eachCourse, list));
            noticeStatistic.setApprovedProjects(this.getTotalApprovedProjects(eachCourse, list));
            noticeStatistic.setRejectedProjects(this.getTotalRejectedProjects(eachCourse, list));
            noticeStatistic.setPendingProjects(this.getPendingProjects(eachCourse, list));
            noticeStatistics.add(noticeStatistic);
        });
        return new GenericStatistic<CourseStatistic>()
                .withTotal(total)
                .withStatistics(noticeStatistics);
    }

    private int getTotalProjects(String course, List<Project> projects) {
        return projects.stream()
                .filter(project -> Objects.equals(project.getCourse(), course))
                .toList()
                .size();
    }

    private int getTotalApprovedProjects(String course, List<Project> projects) {
        return projects.stream()
                .filter(project -> Objects.equals(project.getCourse(), course) && project.isApproved())
                .toList()
                .size();
    }

    private int getTotalRejectedProjects(String course, List<Project> projects) {
        return projects.stream()
                .filter(project -> Objects.equals(project.getCourse(), course) && project.isRejected())
                .toList()
                .size();
    }

    private int getPendingProjects(String course, List<Project> projects) {
        return projects.stream()
                .filter(project -> Objects.equals(project.getCourse(), course) && project.isPending())
                .toList()
                .size();
    }
}

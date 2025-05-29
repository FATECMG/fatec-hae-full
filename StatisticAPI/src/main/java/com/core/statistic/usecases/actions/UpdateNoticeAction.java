package com.core.statistic.usecases.actions;

import com.core.project.domain.Notice;
import com.core.project.domain.Project;
import com.core.statistic.domain.GenericStatistic;
import com.core.statistic.domain.NoticeStatistic;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class UpdateNoticeAction implements UpdateAction<GenericStatistic<NoticeStatistic>> {

    @Override
    public GenericStatistic<NoticeStatistic> update(List<Project> list) {
        final var uniqueNotices = list.stream()
                                    .map(Project::getNotice)
                                    .distinct()
                                    .toList();

        return this.generateNoticeStatistics(uniqueNotices, list);
    }

    private GenericStatistic<NoticeStatistic> generateNoticeStatistics(List<Notice> uniqueNotices, List<Project> list) {
        final int total = uniqueNotices.size();
        final List<NoticeStatistic> noticeStatistics = new ArrayList<>();

        uniqueNotices.forEach(eachNotice -> {
            final var noticeStatistic = new NoticeStatistic();
            noticeStatistic.setNoticeId(eachNotice.getId());
            noticeStatistic.setNoticeTitle(eachNotice.getTitle());
            noticeStatistic.setTotalProjects(this.getTotalProjects(eachNotice.getId(), list));
            noticeStatistic.setApprovedProjects(this.getTotalApprovedProjects(eachNotice.getId(), list));
            noticeStatistic.setRejectedProjects(this.getTotalRejectedProjects(eachNotice.getId(), list));
            noticeStatistic.setTotalHours(0);
            noticeStatistic.setApprovedHours(0);
            noticeStatistic.setPendingJudgementHours(0);
            noticeStatistic.setFreeHours(0);
            noticeStatistics.add(noticeStatistic);
        });
        return new GenericStatistic<NoticeStatistic>()
                .withTotal(total)
                .withStatistics(noticeStatistics);
    }

    private int getTotalProjects(String noticeId, List<Project> projects) {
        return projects.stream().filter(project -> Objects.equals(project.getNotice().getId(), noticeId)).toList().size();
    }

    private int getTotalApprovedProjects(String noticeId, List<Project> projects) {
        return projects.stream().filter(project -> Objects.equals(project.getNotice().getId(), noticeId) && project.isApproved()).toList().size();
    }

    private int getTotalRejectedProjects(String noticeId, List<Project> projects) {
        return projects.stream().filter(project -> Objects.equals(project.getNotice().getId(), noticeId) && project.isRejected()).toList().size();
    }
}

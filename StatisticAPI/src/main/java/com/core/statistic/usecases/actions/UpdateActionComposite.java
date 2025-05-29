package com.core.statistic.usecases.actions;

import com.core.project.domain.Project;
import com.core.statistic.domain.*;
import org.bson.Document;

import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;

import java.util.Date;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public class UpdateActionComposite implements UpdateAction<Statistic> {

    private final UpdateAction[] actions;

    public UpdateActionComposite() {
        this.actions = this.createActions();
    }

    @Override
    public Statistic update(List<Project> projects) {
        CompletableFuture<ProjectStatistic> generalFuture = CompletableFuture.supplyAsync(() -> (ProjectStatistic) actions[0].update(projects));
        CompletableFuture<GenericStatistic<NoticeStatistic>> noticeFuture = CompletableFuture.supplyAsync(() -> (GenericStatistic<NoticeStatistic>) actions[1].update(projects));
        CompletableFuture<GenericStatistic<TopicStatistic>> topicFuture = CompletableFuture.supplyAsync(() -> (GenericStatistic<TopicStatistic>) actions[2].update(projects));
        CompletableFuture<GenericStatistic<CourseStatistic>> courseFuture = CompletableFuture.supplyAsync(() -> (GenericStatistic<CourseStatistic>) actions[3].update(projects));

        CompletableFuture.allOf(generalFuture, noticeFuture, topicFuture, courseFuture).join();

        final var generalStatistic = generalFuture.join();
        final var noticeStatistic = noticeFuture.join();
        final var topicStatistic = topicFuture.join();
        final var courseStatistic = courseFuture.join();

        return this.generateStatistic(generalStatistic, noticeStatistic, topicStatistic, courseStatistic);
    }

    private UpdateAction<Document>[] createActions() {
        UpdateAction[] actions = new UpdateAction[4];
        actions[0] = new UpdateGeneralAction();
        actions[1] = new UpdateNoticeAction();
        actions[2] = new UpdateTopicAction();
        actions[3] = new UpdateCourseAction();
        return actions;
    }

    private Statistic generateStatistic(ProjectStatistic general, GenericStatistic<NoticeStatistic> notice, GenericStatistic<TopicStatistic> topic, GenericStatistic<CourseStatistic> course) {
        final var statistics = new Statistic();
        ZonedDateTime utc = new Date().toInstant().atZone(ZoneOffset.UTC);
        ZonedDateTime brazil = utc.withZoneSameInstant(ZoneId.of("America/Sao_Paulo"));
        statistics.setUpdatedAt(brazil.toString());
        statistics.setStatus(StatisticStatus.UPDATING);
        statistics.setGeneral(general);
        statistics.setNoticeStatistics(notice);
        statistics.setTopicStatistics(topic);
        statistics.setCourseStatistics(course);
        return statistics;
    }
}

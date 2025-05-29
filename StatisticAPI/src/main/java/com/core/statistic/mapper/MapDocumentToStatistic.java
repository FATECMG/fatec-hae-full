package com.core.statistic.mapper;

import com.core.statistic.domain.*;
import com.core.statistic.domain.Statistic;
import com.core.statistic.infra.constants.*;
import org.bson.Document;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;

public class MapDocumentToStatistic {

    public static Statistic map(Document document) {
        var statistic = new Statistic();

        var status = document.getString(FieldName.STATUS.getValue());
        statistic.setStatus(convertStringToStatus(status));

        var date = document.getString("updatedAt");
        statistic.setUpdatedAt(date);

        var dbStatistic = document.get(FieldName.STATISTIC.getValue(), Document.class);

        var dbGeneral = dbStatistic.get(Statistics.GENERAL.getValue(), Document.class);
        statistic.setGeneral(convertDbGeneralToProjectStatistic(dbGeneral));

        var dbByNotice = dbStatistic.get(Statistics.BY_NOTICE.getValue(), Document.class);
        statistic.setNoticeStatistics(convertDbByNoticeToProjectStatistic(dbByNotice));

        var dbByCourse = dbStatistic.get(Statistics.BY_COURSE.getValue(), Document.class);
        statistic.setCourseStatistics(convertDbByCourseToProjectStatistic(dbByCourse));

        var dbByTopic = dbStatistic.get(Statistics.BY_TOPIC.getValue(), Document.class);
        statistic.setTopicStatistics(convertDbByTopicToProjectStatistic(dbByTopic));

        return statistic;
    }

    private static StatisticStatus convertStringToStatus(String status) {
        return StatisticStatus.valueOf(status);
    }

    private static ProjectStatistic convertDbGeneralToProjectStatistic(Document document) {
        var statistic = new ProjectStatistic();

        statistic.setTotalProjects(document.getInteger(General.TOTAL_PROJECTS.getValue()));

        statistic.setApprovedProjects(document.getInteger(General.APPROVED_PROJECTS.getValue()));
        statistic.setRejectedProjects(document.getInteger(General.REJECTED_PROJECTS.getValue()));
        statistic.setPendingProjects(document.getInteger(General.PENDING_PROJECTS.getValue()));
        statistic.setDraftProjects(document.getInteger(General.DRAFT_PROJECTS.getValue()));

        statistic.setProjectsWithReport(document.getInteger(General.PROJECTS_WITH_REPORT.getValue()));
        statistic.setProjectsWithoutReport(document.getInteger(General.PROJECTS_WITHOUT_REPORT.getValue()));

        return statistic;
    }

    private static GenericStatistic<NoticeStatistic> convertDbByNoticeToProjectStatistic(Document dbByNotice) {
        final var statisticList = dbByNotice.getList(FieldName.STATISTIC.getValue(), Document.class)
                .stream()
                .map(each -> {
                    var noticeStatistic = new NoticeStatistic();

                    noticeStatistic.setNoticeId(each.getString(ByNotice.NOTICE_ID.getValue()));
                    noticeStatistic.setNoticeTitle(each.getString(ByNotice.NOTICE_TITLE.getValue()));

                    noticeStatistic.setTotalProjects(each.getInteger(ByNotice.TOTAL_PROJECTS.getValue()));
                    noticeStatistic.setApprovedProjects(each.getInteger(ByNotice.APPROVED_PROJECTS.getValue()));
                    noticeStatistic.setRejectedProjects(each.getInteger(ByNotice.REJECTED_PROJECTS.getValue()));

                    noticeStatistic.setTotalHours(each.getInteger(ByNotice.TOTAL_HOURS.getValue()));
                    noticeStatistic.setFreeHours(each.getInteger(ByNotice.FREE_HOURS.getValue()));
                    noticeStatistic.setPendingJudgementHours(each.getInteger(ByNotice.PENDING_JUDGEMENT_HOURS.getValue()));
                    noticeStatistic.setApprovedHours(each.getInteger(ByNotice.APPROVED_HOURS.getValue()));

                    return noticeStatistic;
                })
                .toList();
        
        var totalNotices = dbByNotice.getInteger(FieldName.TOTAL.getValue());
        return new GenericStatistic<NoticeStatistic>()
                .withStatistics(statisticList)
                .withTotal(totalNotices);
    }

    private static GenericStatistic<CourseStatistic> convertDbByCourseToProjectStatistic(Document dbByCourse) {
        var statisticList =  dbByCourse.getList(FieldName.STATISTIC.getValue(), Document.class).stream()
                .map(each -> {
                    var courseStatistic = new CourseStatistic();

                    courseStatistic.setCourseName(each.getString(ByCourse.COURSE_NAME.getValue()));

                    courseStatistic.setTotalProjects(each.getInteger(ByCourse.TOTAL_PROJECTS.getValue()));
                    courseStatistic.setApprovedProjects(each.getInteger(ByCourse.APPROVED_PROJECTS.getValue()));
                    courseStatistic.setRejectedProjects(each.getInteger(ByCourse.REJECTED_PROJECTS.getValue()));
                    courseStatistic.setPendingProjects(each.getInteger(ByCourse.PENDING_PROJECTS.getValue()));

                    return courseStatistic;
                })
                .toList();
        var totalCourses = dbByCourse.getInteger(FieldName.TOTAL.getValue());
        return new GenericStatistic<CourseStatistic>()
                .withStatistics(statisticList)
                .withTotal(totalCourses);
    }

    private static GenericStatistic<TopicStatistic> convertDbByTopicToProjectStatistic(Document dbByTopic) {
        var statisticList = dbByTopic.getList(FieldName.STATISTIC.getValue(), Document.class).stream()
                .map(each -> {
                    var topicStatistic = new TopicStatistic();

                    topicStatistic.setTopicName(each.getString(ByTopic.TOPIC_NAME.getValue()));
                    topicStatistic.setTotalProjects(each.getInteger(ByTopic.TOTAL_PROJECTS.getValue()));

                    return topicStatistic;
                })
                .toList();
        var totalTopics = dbByTopic.getInteger(FieldName.TOTAL.getValue());
        return new GenericStatistic<TopicStatistic>()
                .withStatistics(statisticList)
                .withTotal(totalTopics);
    }

}

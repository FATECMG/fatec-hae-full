package com.core.statistic.mapper;

import com.core.statistic.domain.*;
import com.core.statistic.infra.constants.*;
import org.bson.Document;

import java.util.ArrayList;
import java.util.List;

public class MapStatisticToDocument {

    public static Document map(Statistic statistic) {
        Document document = new Document();

        document.put(FieldName.UPDATED_AT.getValue(), statistic.getUpdatedAt());
        document.put(FieldName.STATUS.getValue(), statistic.getStatus().getValue());
        document.put(FieldName.STATISTIC.getValue(), convertStatisticToDocument(statistic));
        return document;
    }

    private static Document convertStatisticToDocument(Statistic statistic) {
        Document document = new Document();

        document.put(Statistics.GENERAL.getValue(), convertProjectStatisticToDocument(statistic.getGeneral()));
        document.put(Statistics.BY_TOPIC.getValue(), convertTopicStatisticToDocument(statistic.getTopicStatistics()));
        document.put(Statistics.BY_NOTICE.getValue(), convertNoticeStatisticToDocument(statistic.getNoticeStatistics()));
        document.put(Statistics.BY_COURSE.getValue(), convertCourseStatisticToDocument(statistic.getCourseStatistics()));
        return document;
    }

    private static Document convertProjectStatisticToDocument(ProjectStatistic projectStatistic) {
        final var document = new Document();

        document.put(General.TOTAL_PROJECTS.getValue(), projectStatistic.getTotalProjects());
        document.put(General.PROJECTS_WITH_REPORT.getValue(), projectStatistic.getProjectsWithReport());
        document.put(General.PROJECTS_WITHOUT_REPORT.getValue(), projectStatistic.getProjectsWithoutReport());
        document.put(General.APPROVED_PROJECTS.getValue(), projectStatistic.getApprovedProjects());
        document.put(General.REJECTED_PROJECTS.getValue(), projectStatistic.getRejectedProjects());
        document.put(General.DRAFT_PROJECTS.getValue(), projectStatistic.getDraftProjects());
        document.put(General.PENDING_PROJECTS.getValue(), projectStatistic.getPendingProjects());
        return document;
    }

    private static Document convertTopicStatisticToDocument(GenericStatistic<TopicStatistic> topicStatistics) {
        Document mainDocument = new Document();
        final List<Document> statistics = new ArrayList<>();

        topicStatistics.getStatistics().forEach(eachTopic -> {
            final var topicStatistic = new Document();
            topicStatistic.put(ByTopic.TOPIC_NAME.getValue(), eachTopic.getTopicName());
            topicStatistic.put(ByTopic.TOTAL_PROJECTS.getValue(), eachTopic.getTotalProjects());
            statistics.add(topicStatistic);
        });
        mainDocument.put(FieldName.STATISTIC.getValue(), statistics);
        mainDocument.put(FieldName.TOTAL.getValue(), topicStatistics.getTotal());

        return mainDocument;
    }

    private static Document convertNoticeStatisticToDocument(GenericStatistic<NoticeStatistic> noticeStatistics) {
        Document mainDocument = new Document();
        final List<Document> statistics = new ArrayList<>();

        noticeStatistics.getStatistics().forEach(eachNotice -> {
            final var noticeStatistic = new Document();
            noticeStatistic.put(ByNotice.NOTICE_ID.getValue(), eachNotice.getNoticeId());
            noticeStatistic.put(ByNotice.NOTICE_TITLE.getValue(), eachNotice.getNoticeTitle());
            noticeStatistic.put(ByNotice.TOTAL_PROJECTS.getValue(), eachNotice.getTotalProjects());
            noticeStatistic.put(ByNotice.APPROVED_PROJECTS.getValue(),eachNotice.getApprovedProjects());
            noticeStatistic.put(ByNotice.REJECTED_PROJECTS.getValue(), eachNotice.getRejectedProjects());
            noticeStatistic.put(ByNotice.TOTAL_HOURS.getValue(), eachNotice.getTotalHours());
            noticeStatistic.put(ByNotice.APPROVED_HOURS.getValue(), eachNotice.getApprovedHours());
            noticeStatistic.put(ByNotice.PENDING_JUDGEMENT_HOURS.getValue(), eachNotice.getPendingJudgementHours());
            noticeStatistic.put(ByNotice.FREE_HOURS.getValue(), eachNotice.getFreeHours());
            statistics.add(noticeStatistic);
        });
        mainDocument.put(FieldName.STATISTIC.getValue(), statistics);
        mainDocument.put(FieldName.TOTAL.getValue(), noticeStatistics.getTotal());

        return mainDocument;
    }

    private static Document convertCourseStatisticToDocument(GenericStatistic<CourseStatistic> courseStatistics) {
        Document mainDocument = new Document();
        List<Document> statistics = new ArrayList<>();

        courseStatistics.getStatistics().forEach(eachCourse -> {
            final var courseStatistic = new Document();
            courseStatistic.put(ByCourse.COURSE_NAME.getValue(), eachCourse.getCourseName());
            courseStatistic.put(ByCourse.TOTAL_PROJECTS.getValue(), eachCourse.getTotalProjects());
            courseStatistic.put(ByCourse.APPROVED_PROJECTS.getValue(), eachCourse.getApprovedProjects());
            courseStatistic.put(ByCourse.REJECTED_PROJECTS.getValue(), eachCourse.getRejectedProjects());
            courseStatistic.put(ByCourse.PENDING_PROJECTS.getValue(), eachCourse.getPendingProjects());
            statistics.add(courseStatistic);
        });
        mainDocument.put(FieldName.STATISTIC.getValue(), statistics);
        mainDocument.put(FieldName.TOTAL.getValue(), courseStatistics.getTotal());

        return mainDocument;
    }
}

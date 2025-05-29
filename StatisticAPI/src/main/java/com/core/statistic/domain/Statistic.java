package com.core.statistic.domain;

import lombok.Data;

@Data
public class Statistic {

    private StatisticStatus status;
    private String updatedAt;
    private ProjectStatistic general;

    private GenericStatistic<NoticeStatistic> noticeStatistics;
    private GenericStatistic<TopicStatistic> topicStatistics;
    private GenericStatistic<CourseStatistic> courseStatistics;
}

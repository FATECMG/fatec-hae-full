package com.core.statistic.domain;

import lombok.Data;

@Data
public class NoticeStatistic {
    private String noticeId;
    private String noticeTitle;
    private int totalProjects;
    private int approvedProjects;
    private int rejectedProjects;
    private int totalHours;
    private int approvedHours;
    private int pendingJudgementHours;
    private int freeHours;
}

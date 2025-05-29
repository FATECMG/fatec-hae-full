package com.core.statistic.infra.constants;

import lombok.Getter;

@Getter
public enum ByNotice {

    NOTICE_ID("noticeId"),
    NOTICE_TITLE("noticeTitle"),
    TOTAL_PROJECTS("totalProjects"),
    APPROVED_PROJECTS("approvedProjects"),
    REJECTED_PROJECTS("rejectedProjects"),
    TOTAL_HOURS("totalHours"),
    APPROVED_HOURS("approvedHours"),
    PENDING_JUDGEMENT_HOURS("pendingJudgmentHours"),
    FREE_HOURS("freeHours");

    public final String value;

    ByNotice(String value) {
        this.value = value;
    }
}
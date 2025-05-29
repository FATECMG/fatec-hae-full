package com.core.project.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = false)
public class Project {

    @EqualsAndHashCode.Include
    private String id;

    private Notice notice;
    private Author author;
    private String title;
    private List<String> topicsOfInterest;
    private Hours hours;
    private String status;
    private String course;

    public boolean isApproved() {
        return this.status.equals(Status.APPROVED.getValue());
    }

    public boolean isRejected() {
        return this.status.equals(Status.REJECTED.getValue());
    }

    public boolean isDraft() {
        return this.status.equals(Status.DRAFT.getValue());
    }

    public boolean isPending() {
        return !this.isApproved() && !this.isRejected() && !this.isDraft();
    }
}

package com.core.project.infra.constants;

import lombok.Getter;

@Getter
public enum NoticeEnum {
    ID("id"),
    TITLE("title");

    private final String value;

    NoticeEnum(String value) {
        this.value = value;
    }
}
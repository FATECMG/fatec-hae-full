package com.core.project.infra.constants;

import lombok.Getter;

@Getter
public enum AuthorEnum {
    ID("id"),
    NAME("name");

    private final String value;

    AuthorEnum(String value) {
        this.value = value;
    }
}

package com.core.project.infra.constants;

import lombok.Getter;

@Getter
public enum HoursEnum {
    APPROVED("approved"),
    PROPOSED("proposed");

    private final String value;

    HoursEnum(String value) {
        this.value = value;
    }
}
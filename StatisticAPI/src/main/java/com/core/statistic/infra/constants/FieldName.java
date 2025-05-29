package com.core.statistic.infra.constants;

import lombok.Getter;

@Getter
public enum FieldName {

    STATUS("status"),
    STATISTIC("statistics"),
    UPDATED_AT("updatedAt"),
    TOTAL("total");

    public final String value;

    FieldName(String value) {
        this.value = value;
    }
}

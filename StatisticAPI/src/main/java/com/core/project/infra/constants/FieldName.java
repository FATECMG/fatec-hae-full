package com.core.project.infra.constants;

import lombok.Getter;

@Getter
public enum FieldName {
        ID("id"),
        STATUS("status"),
        TOPICS_OF_INTEREST("topicsOfInterest"),
        NOTICE("notice"),
        AUTHOR("author"),
        HOURS("hours");

        private final String value;

    FieldName(String value) {
            this.value = value;
        }


}

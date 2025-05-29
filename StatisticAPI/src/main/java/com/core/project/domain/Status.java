package com.core.project.domain;

import lombok.Getter;

@Getter
public enum Status {

    APPROVED("APROVADO"),
    REJECTED("REJEITADO"),
    DRAFT("RASCUNHO");

    private final String value;

    Status(String value) {
        this.value = value;
    }
}

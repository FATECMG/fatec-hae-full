package com.core.statistic.exception;

import com.common.constants.ErrorMessages;

public class StatisticsNotReadyException extends RuntimeException {

    public StatisticsNotReadyException() {
        super(ErrorMessages.STATISTICS_NOT_READY);
    }
}

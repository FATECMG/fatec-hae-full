package com.core.statistic.infra.filter;

import org.bson.conversions.Bson;

import static com.mongodb.client.model.Filters.in;

public class StatisticFilter {

    public static Bson in = in("status", "UPDATING", "READY");
}

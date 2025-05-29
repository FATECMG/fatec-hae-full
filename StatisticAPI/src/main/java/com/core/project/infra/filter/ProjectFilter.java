package com.core.project.infra.filter;

import org.bson.conversions.Bson;

import static com.mongodb.client.model.Filters.eq;

public class ProjectFilter {

    public static Bson activeFilter = eq("active", true);
}

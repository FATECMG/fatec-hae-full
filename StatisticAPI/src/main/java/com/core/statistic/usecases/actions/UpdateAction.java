package com.core.statistic.usecases.actions;

import com.core.project.domain.Project;

import java.util.List;

public interface UpdateAction<T> {

    T update(List<Project> list);
}

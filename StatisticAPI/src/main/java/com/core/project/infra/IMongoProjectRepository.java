package com.core.project.infra;

import com.core.project.domain.Project;

import java.util.List;

public interface IMongoProjectRepository {

    List<Project> getProjects();
}

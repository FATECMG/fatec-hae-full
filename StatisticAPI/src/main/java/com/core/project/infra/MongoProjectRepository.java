package com.core.project.infra;

import com.common.infra.MongoSingleton;
import com.mongodb.client.MongoCollection;
import com.core.project.domain.Project;
import com.core.project.infra.filter.ProjectFilter;
import com.core.project.mapper.MapDocumentToProject;

import org.bson.Document;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class MongoProjectRepository implements IMongoProjectRepository {

    private final MongoCollection<Document> projectCollection;
    private final MongoCollection<Document> noticeCollection;

    private MongoProjectRepository() {
        this.projectCollection = MongoSingleton.getProjectCollection();
        this.noticeCollection = MongoSingleton.getNoticeCollection();
    }

    public static MongoProjectRepository Create() {
        return new MongoProjectRepository();
    }

    @Override
    public List<Project> getProjects() {
        List<Project> projectList = new ArrayList<>();

        projectCollection.find()
                .filter(ProjectFilter.activeFilter)
                .map(MapDocumentToProject::map)
                .forEach(projectList::add);

        return this.innerJoinNotice(projectList);
    }

    private List<Project> innerJoinNotice(List<Project> projects) {
        projects.forEach(project -> {
            final var notice = Objects.requireNonNull(noticeCollection.find(new Document("id", project.getNotice().getId())).first());
            project.setCourse(notice.get("course", Document.class).getString("name"));
        });
        return projects;
    }
}

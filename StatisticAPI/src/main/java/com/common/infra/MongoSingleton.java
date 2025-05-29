package com.common.infra;

import com.common.constants.Environment;
import com.core.project.infra.IMongoProjectRepository;
import com.core.project.infra.MongoProjectRepository;
import com.core.statistic.infra.IMongoStatisticRepository;
import com.core.statistic.infra.MongoStatisticRepository;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

public class MongoSingleton {

    private static IMongoProjectRepository projectInstance;
    private static IMongoStatisticRepository stasticInstance;
    private static MongoDatabase database;
    private static MongoCollection<Document> projectCollection;
    private static MongoCollection<Document> statisticCollection;
    private static MongoCollection<Document> noticeCollection;


    public static IMongoProjectRepository getMongoProjectInstance() {
        if (projectInstance == null) {
            projectInstance = MongoProjectRepository.Create();
        }
        return projectInstance;
    }

    public static IMongoStatisticRepository getMongoStatisticInstance() {
        if (projectInstance == null) {
            stasticInstance = MongoStatisticRepository.Create();
        }
        return stasticInstance;
    }

    private static MongoDatabase getDatabase() {
        if(database == null) {
            database = MongoClients.create(Environment.MONGO_URI)
                                    .getDatabase(Environment.MONGO_DB_NAME);
        }
        return database;
    }

    public static MongoCollection<Document> getProjectCollection() {
        if (projectCollection == null) {
            projectCollection = getDatabase().getCollection("projects");
        }
        return projectCollection;
    }

    public static MongoCollection<Document> getStatisticCollection() {
        if (statisticCollection == null) {
            statisticCollection = getDatabase().getCollection("statistic");
        }
        return statisticCollection;
    }

    public static MongoCollection<Document> getNoticeCollection() {
        if (noticeCollection == null) {
            noticeCollection = getDatabase().getCollection("notices");
        }
        return noticeCollection;
    }
}

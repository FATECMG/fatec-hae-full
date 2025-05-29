package com.core.statistic.infra;

import com.core.statistic.domain.Statistic;
import com.core.statistic.domain.StatisticStatus;
import com.common.infra.MongoSingleton;

import com.core.statistic.infra.constants.FieldName;
import com.core.statistic.infra.filter.StatisticFilter;
import com.core.statistic.mapper.MapDocumentToStatistic;
import com.core.statistic.mapper.MapStatisticToDocument;
import com.mongodb.client.MongoCollection;
import org.bson.Document;


public class MongoStatisticRepository implements IMongoStatisticRepository {

    private final MongoCollection<Document> statisticCollection;

    private MongoStatisticRepository() {
        this.statisticCollection = MongoSingleton.getStatisticCollection();
    }

    public static IMongoStatisticRepository Create() {
        return new MongoStatisticRepository();
    }

    @Override
    public void updateStatus(StatisticStatus status) {
        Document statistic = this.getDocumentStatistic();
        statistic.put(FieldName.STATUS.getValue(), status.getValue());
        this.updateDocumentStatistic(statistic);
    }

    @Override
    public void updateStatistic(Statistic statistic) {
        Document statistics = MapStatisticToDocument.map(statistic);
        this.updateDocumentStatistic(statistics);
    }

    @Override
    public Statistic getStatistic() {
        return MapDocumentToStatistic.map(this.getDocumentStatistic());
    }

    @Override
    public boolean isStatisticBeingUpdated() {
        final var statistic = this.getDocumentStatistic();
        final var status = statistic.getString(FieldName.STATUS.getValue());
        return status.equals(StatisticStatus.UPDATING.getValue());
    }

    private void updateDocumentStatistic(Document statistic) {
        Document update = new Document("$set", statistic);
        statisticCollection.updateOne(StatisticFilter.in, update);
    }

    private Document getDocumentStatistic() {
        return statisticCollection.find().first();
    }
}

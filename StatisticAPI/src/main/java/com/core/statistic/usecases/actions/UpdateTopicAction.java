package com.core.statistic.usecases.actions;

import com.core.project.domain.Project;
import com.core.statistic.domain.GenericStatistic;
import com.core.statistic.domain.TopicStatistic;

import java.util.ArrayList;
import java.util.List;

public class UpdateTopicAction implements UpdateAction<GenericStatistic<TopicStatistic>> {

    @Override
    public GenericStatistic<TopicStatistic> update(List<Project> list) {
        final var uniqueTopics = list.stream()
                                     .map(Project::getTopicsOfInterest)
                                     .flatMap(List::stream)
                                     .distinct()
                                     .toList();

        return this.generateTopicStatistics(uniqueTopics, list);
    }

    private GenericStatistic<TopicStatistic> generateTopicStatistics(List<String> uniqueTopics, List<Project> list) {
        final int total = uniqueTopics.size();
        final List<TopicStatistic> topicStatistics = new ArrayList<>();

        uniqueTopics.forEach(eachTopic -> {
            final var topicStatistic = new TopicStatistic();
            topicStatistic.setTopicName(eachTopic);
            topicStatistic.setTotalProjects(this.getTotalProjects(eachTopic, list));
            topicStatistics.add(topicStatistic);
        });
        return new GenericStatistic<TopicStatistic>()
                .withTotal(total)
                .withStatistics(topicStatistics);
    }

    private int getTotalProjects(String topicName, List<Project> projects) {
        return projects.stream().filter(project -> project.getTopicsOfInterest().contains(topicName)).toList().size();
    }
}

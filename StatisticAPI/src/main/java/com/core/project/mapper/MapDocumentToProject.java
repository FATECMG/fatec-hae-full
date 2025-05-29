package com.core.project.mapper;

import com.core.project.domain.Author;
import com.core.project.domain.Hours;
import com.core.project.domain.Notice;
import com.core.project.domain.Project;
import com.core.project.infra.constants.AuthorEnum;
import com.core.project.infra.constants.FieldName;
import com.core.project.infra.constants.HoursEnum;
import com.core.project.infra.constants.NoticeEnum;
import org.bson.Document;

public class MapDocumentToProject {

    public static Project map(Document document) {
        Project projectDocument = new Project();

        projectDocument.setId(document.getString(FieldName.ID.getValue()));
        projectDocument.setStatus(document.getString(FieldName.STATUS.getValue()));
        projectDocument.setTopicsOfInterest(document.getList(FieldName.TOPICS_OF_INTEREST.getValue(), String.class));

        var dbNotice = document.get(FieldName.NOTICE.getValue(), Document.class);
        var dbAuthor = document.get(FieldName.AUTHOR.getValue(), Document.class);
        var dbHours = document.get(FieldName.HOURS.getValue(), Document.class);

        var notice = new Notice();
        notice.setId(dbNotice.getString(NoticeEnum.ID.getValue()));
        notice.setTitle(dbNotice.getString(NoticeEnum.TITLE.getValue()));

        var author = new Author();
        author.setId(dbAuthor.getString(AuthorEnum.ID.getValue()));
        author.setName(dbAuthor.getString(AuthorEnum.NAME.getValue()));

        var hours = new Hours();
        hours.setApproved(dbHours.getString(HoursEnum.APPROVED.getValue()));
        hours.setProposed(dbHours.getString(HoursEnum.PROPOSED.getValue()));

        projectDocument.setNotice(notice);
        projectDocument.setAuthor(author);
        projectDocument.setHours(hours);

        return projectDocument;
    }
}

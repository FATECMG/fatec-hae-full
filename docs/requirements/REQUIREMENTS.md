# Requirements

This document presents the sofware functional and non-functional requirements.

## Tasks

(0)
* Study AWS Lambda with Typescript;
* Study Serverless framework;
* Study Clean Architecture with AWS Lambda (w/ Typescript)
(1)
* Detail the requirements (both functional and non-functional);
* Create a draft of the domain model (yUML).
(2)
* Develop a first CRUD using Clean Architecture (Typescript AWS Lambda + React)

## Architecture

* Backend: Typescript (AWS Lambda) - serverless FaaS (Serverless framework) - DynamoDB/S3
* Frontend: React/Typescript (S3/Cloudfront)

## Functional requirements

* Manage schools (number, name, place);
* Manage courses (acronym, name, shifts);
* As a coordinator, I want to define areas of interest for the projects so that professors can prioritize such areas.
* Manage extra activities types by school/course (name, hours, ...);
* Manage general directors, coordinators, professor, and administrative director (name, phone, e-mail, roles, courses, and password);
* Manage selection process (description, dates of interest, announcements);
* Manage own projects;
* Manage projects;
* Notify users about updates;
* View reports and statuses.
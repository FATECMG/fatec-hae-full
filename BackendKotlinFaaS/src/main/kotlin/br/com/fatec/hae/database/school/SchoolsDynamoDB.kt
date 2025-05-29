package br.com.fatec.hae.database.school

import School
import SchoolId
import br.com.fatec.hae.core.school.Schools
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec
import com.amazonaws.services.dynamodbv2.model.*
import com.amazonaws.services.dynamodbv2.model.AttributeValue
import java.util.*

class SchoolsDynamoDB(private val dynamoDBClient: AmazonDynamoDB) : Schools {
    private val mapper: DynamoDBMapper = DynamoDBMapper(dynamoDBClient)

    override fun save(school: School) {
        mapper.save(school)
    }

    override fun delete(school: School) {
        mapper.delete(school)
    }

    override fun delete(id: SchoolId) {
        mapper.delete<School>(School(id))
    }

    override fun findBySearchTerm(filter: String, exclusiveStartKey: UUID, pageSize: Int): List<School> {
        mapper.query(School::class.java,
            DynamoDBQueryExpression<School>()
            .withFilterExpression("contains(code, :searchTerm) or contains(name, :searchTerm) or contains(description, :searchTerm)")
            .withExpressionAttributeValues(mapOf(":searchTerm" to AttributeValue(filter)))
            .withLimit(pageSize)
//            .withExclusiveStartKey(mapOf("id" to filter, "range" to exclusiveStartKey))
            )
        val result = dynamoDBClient.query(School::class.java, queryExpression)
        return result.items
    }

}

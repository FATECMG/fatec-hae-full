package br.com.fatec.hae.database.school

import School
import reactor.core.publisher.Mono
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedAsyncClient
import software.amazon.awssdk.enhanced.dynamodb.Key
import software.amazon.awssdk.enhanced.dynamodb.TableSchema
import org.slf4j.Logger
import org.slf4j.LoggerFactory

class SchoolsDynamoDBV2(
    private val client: DynamoDbEnhancedAsyncClient,
    private val tableName: String
) {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)
    private val table = client.table(tableName, tableSchema)

    fun save(school: SchoolDynamoDB): Mono<SchoolDynamoDB> {
        return Mono
            .fromFuture(table.putItem(school))
            .map { SchoolDynamoDB }
            .doOnError { logger.error("Exception while saving School information - $it") }
    }

    fun retrieveCustomer(customerId: String): Mono<CustomerPersist> {
        val key = Key.builder().partitionValue(customerId).build()

        return Mono.fromFuture(table.getItem(key))
            .doOnError { logger.error("Exception while retrieving Customer information - $it") }
    }

    companion object {
        private val tableSchema = TableSchema.fromBean(CustomerPersist::class.java)
    }
}
}
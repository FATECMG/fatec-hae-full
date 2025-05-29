package br.com.fatec.hae.core.school

import School
import SchoolId

interface Schools {
    fun save(school: School)
    fun delete(school: School)
    fun delete(id: SchoolId)
    fun findById(id: String): List<School?>
    fun findBySearchTerm(filter: String, page: Int, pageSize: Int): List<School>
    fun findAll(): List<School>
}
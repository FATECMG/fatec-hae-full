import java.util.UUID

data class Teacher(
    val id: UUID,
    val school: School,
    val registration: String,
    val name: String,

    val phones: List<Phone> = emptyList(),
    val address: Address? = null,
    val personalEmail: String? = null,
    val institutionalEmail: String? = null,
    val courses: MutableList<Course> = mutableListOf()
) {
    init {
        require(registration.isNotBlank()) { "Registration must not be blank" }
        require(name.isNotBlank()) { "Name must not be blank" }
    }

    fun addCourse(course: Course) {
        require(course.school == this.school) { "Course must belong to the same school" }
        if (course !in courses) {
            courses.add(course)
            course.coordinator = this
        }
    }

    fun removeCourse(course: Course) {
        if (course in courses) {
            courses.remove(course)
            course.coordinator = null
        }
    }
}

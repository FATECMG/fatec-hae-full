import java.util.*

class Course(
        private val school: School,
        private val code: String,
        private val name: String,
        private val shift: String
) {

    private val teachers = mutableSetOf<Teacher>()
    private val students = mutableSetOf<Student>()

    init {
        validateCode()
        validateName()
        validateShift()
    }

    fun getCode() = code
    fun getName() = name
    fun getShift() = shift
    fun getTeachers() = teachers
    fun getStudents() = students

    fun addTeacher(teacher: Teacher) {
        if (!teachers.contains(teacher)) {
            teachers.add(teacher)
        }
    }

    fun removeTeacher(teacher: Teacher) {
        teachers.remove(teacher)
    }

    fun addStudent(student: Student) {
        if (!students.contains(student)) {
            students.add(student)
        }
    }

    fun removeStudent(student: Student) {
        students.remove(student)
    }

    private fun validateCode() {
        require(code.isNotBlank()) { "Code must not be blank" }
        require(code.length <= 10) { "Code must have at most 10 characters" }
    }

    private fun validateName() {
        require(name.isNotBlank()) { "Name must not be blank" }
        require(name.length <= 100) { "Name must have at most 100 characters" }
    }

    private fun validateShift() {
        require(shift.isNotBlank()) { "Shift must not be blank" }
        require(shift.length <= 30) { "Shift must have at most 30 characters" }
    }
    
}

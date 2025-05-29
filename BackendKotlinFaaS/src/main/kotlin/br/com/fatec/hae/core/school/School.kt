import java.util.UUID
import br.com.fatec.hae.core.course.Course

class School(
    private val id: SchoolId,
    private var code: String,
    private var name: String,
    private var description: String?
) {
    private val teachers = mutableListOf<Teacher>()
    private val courses = mutableListOf<Course>()
    private val selectionProcesses = mutableListOf<SelectionProcess>()

    init {
        require(code.isNotBlank()) { "The code can't be blank" }
        require(name.isNotBlank()) { "The name can't be blank" }

        this.code = code.trim().substring(0, minOf(code.length, 10))
        this.name = name.trim().substring(0, minOf(name.length, 100))
        this.description = description!!.trim().substring(0, minOf(description!!.length, 200))
    }

    fun getId() = id
    fun getCode() = code
    fun getName() = name
    fun getDescription() = description
    fun getTeachers() = teachers.toList()
    fun getCourses() = courses.toList()

    fun addCourse(course: Course) {
        if (course.school != null && course.school != this) {
            course.school!!.removeCourse(course)
        }
        courses.add(course)
        course.school = this
    }

    fun removeCourse(course: Course) {
        if(course.school == this) {
            courses.remove(course)
            course.school = null
        }
    }

    fun numberOfCourses(): Int = courses.size

    fun addTeacher(teacher: Teacher) {
      if (teacher.school != null && teacher.school != this) {
          teacher.school!!.removeTeacher(teacher)
      }
      teachers.add(teacher)
      teacher.school = this
    }

    fun removeTeacher(teacher: Teacher) {
        if(teacher.school == this) {
            teachers.remove(teacher)
            teacher.school = null
        }
    }

    fun numberOfTeachers(): Int = teachers.size

    fun addSelectionProcess(selectionProcess: SelectionProcess) {
        if (selectionProcess.school != null && selectionProcess.school != this) {
            selectionProcess.school!!.removeSelectionProcess(selectionProcess)
        }
        selectionProcesses.add(selectionProcess)
        selectionProcess.school = this
    }

    fun removeSelectionProcess(selectionProcess: SelectionProcess) {
        if(selectionProcess.school == this) {
            selectionProcesses.remove(selectionProcess)
            selectionProcess.school = null
        }
    }

    fun numberOfSelectionProcesses(): Int = selectionProcesses.size
}
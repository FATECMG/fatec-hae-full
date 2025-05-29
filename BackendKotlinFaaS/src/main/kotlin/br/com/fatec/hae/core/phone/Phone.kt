import javax.persistence.*
import javax.validation.constraints.NotBlank

@Entity
data class Phone(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @NotBlank
    @Column(nullable = false, unique = true)
    val number: String
) {
    init {
        require(number.isNotBlank()) { "Number must not be blank" }
    }
}

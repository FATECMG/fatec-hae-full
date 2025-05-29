import javax.persistence.*
import javax.validation.constraints.NotBlank
import javax.validation.constraints.Pattern

@Entity
data class Address(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @NotBlank
    @Column(nullable = false)
    @Pattern(regexp = "\\d{9}")
    val zipCode: String,

    val complement: String? = null,

    @NotBlank
    @Column(nullable = false)
    val number: String
) {
    init {
        require(zipCode.isNotBlank()) { "Zip code must not be blank" }
        require(number.isNotBlank()) { "Number must not be blank" }
    }
}

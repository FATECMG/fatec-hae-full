package br.com.common.core.address

class ReducedBRAddress(
    zipCode: String,
    number: String,
    complement: String?
) {
    val zipCode: String
    val number: String
    val complement: String?

    companion object {
        val ZIP_CODE_REGEX = Regex("^[0-9]{8}$")
    }

    init {
        val parsedZipCode = zipCode.replace("[^0-9]".toRegex(), "")
        val parsedNumber = number.trim()
        val parsedComplement = complement?.trim()

        require(parsedZipCode.matches(ZIP_CODE_REGEX)) { "Invalid zipcode" }
        require(parsedNumber.isNotBlank()) { "Number required" }

        this.zipCode = parsedZipCode
        this.number = parsedNumber
        this.complement = parsedComplement
    }
}
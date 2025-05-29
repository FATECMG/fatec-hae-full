package br.com.common.core.phone

import br.com.common.core.email.Email.Companion.REGEX

class Phone(number: String) {
    val number: String

    companion object {
        val REGEX = Regex("^[0-9]{2}9?[0-9]{8}\$")
    }

    init {
        val parsedNumber = number.replace("[^0-9]".toRegex(), "")
        require(REGEX.matches(parsedNumber)) { "The phone is invalid" }
        this.number = parsedNumber
    }
}
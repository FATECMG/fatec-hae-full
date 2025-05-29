package br.com.common.core.email

import br.com.common.core.phone.Phone.Companion.REGEX

class Email(address: String) {
    val address: String

    companion object {
        val REGEX = Regex("^[a-zA-Z0-9.!#\$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
    }

    init {
        val parsedAddress = address.trim()
        require(REGEX.matches(parsedAddress)) { "Invalid e-mail" }
        this.address = parsedAddress
    }
}

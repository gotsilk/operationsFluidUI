package operations.superuser

class Person {

    String username
    String passwd
    boolean enabled

    static constraints = {
        username(blank: false, unique: true)
        passwd(blank: false)
        enabled()
    }
}

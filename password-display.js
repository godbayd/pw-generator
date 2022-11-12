import { generatePassword } from './password-generator'

class PasswordDisplay {
    $display = document.querySelector('.password')
    constructor(app) {
        this.app = app
    }
    render() {
        const password = generatePassword(this.app.state)()
        this.$display.innerText = password
    }
}

export default PasswordDisplay

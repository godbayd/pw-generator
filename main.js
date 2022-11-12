import './style.css'
import NumberInput from './number-input'
import PasswordDisplay from './password-display'
import CheckboxInput from './checkbox-input'
import { getMinPwLength } from './password-generator'

class App {
    pwLengthInput = new NumberInput(this, 'pwLength')
    minSpecialsInput = new NumberInput(this, 'minSpecials')
    minDigitsInput = new NumberInput(this, 'minDigits')
    passwordH2 = new PasswordDisplay(this)

    bounds = {
        minDigits: { min: 0, max: 9 },
        minSpecials: { min: 0, max: 9 },
        pwLength: { min: 5, max: 128 }
    }

    state = {
        avoidAmbiguous: false,
        digits: true,
        lowercase: true,
        minDigits: 0,
        minSpecials: 0,
        pwLength: 5,
        specials: true,
        uppercase: true,
    }

    init() {
        this.minDigitsInput.init()
        this.minSpecialsInput.init()
        this.pwLengthInput.init()
        this.initializeToggleInputs()
        this.renderPassword()
    }

    setToggleState(name, value) {
        this.state[name] = value
        this.adjustPwLength()
        this.renderPassword(this.state)
    }

    initializeToggleInputs() {
        const names = [
            'avoidAmbiguous',
            'digits',
            'lowercase',
            'specials',
            'uppercase'
        ];
        for (const name of names)
            new CheckboxInput(this, name).init()
    }

    renderPassword() {
        this.passwordH2.render()
    }

    setPwLength(value) {
        if (value <= this.bounds.pwLength.max && value >= this.bounds.pwLength.min) {
            this.state.pwLength = value
            this.renderPassword()
        }
    }

    adjustPwLength() {
        const minPwlength = getMinPwLength(this.state)
        if (minPwlength >= this.state.pwLength) {
            this.state.pwLength += 1
            this.pwLengthInput.updateValue(this.state)
        }
    }

    setMinDigits(value) { return this.setMin('minDigits', value) }

    setMinSpecials(value) { return this.setMin('minSpecials', value) }

    setMin(key, value) {
        if (value <= this.bounds[key].max && value >= this.bounds[key].min) {
            if (value > this.state[key]) this.adjustPwLength()
            this.state[key] = value
            this.renderPassword()
        }
    }
}

window.onload = e => {
    const app = new App()
    app.init()
}



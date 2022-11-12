class CheckboxInput {
    handleChange = this.handleChange.bind(this)

    constructor(app, name) {
        this.app = app
        this.name = name
        this.$input = document.querySelector(`input[name="${this.name}"]`)
    }

    handleChange(e) {
        this.app.setToggleState(this.name, e.currentTarget.checked)
        console.log(this.app.state)
    }

    init() {
        this.$input.addEventListener('change', this.handleChange)
    }
}

export default CheckboxInput

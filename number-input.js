class NumberInput {
    handleChange = this.handleChange.bind(this)
    handleFinalize = this.handleFinalize.bind(this)

    constructor(app, name) {
        this.app = app
        this.name = name
        this.setMethodKey = ({
            minDigits: 'setMinDigits',
            minSpecials: 'setMinSpecials',
            pwLength: 'setPwLength',
        })[this.name]
        this.$input = document.querySelector(`input[name="${this.name}"]`)
    }

    init() {
        this.$input.addEventListener('change', this.handleChange)
        this.$input.addEventListener('blur', this.handleFinalize)
        this.$input.addEventListener('keyup', this.handleFinalize)
    }

    handleChange(e) {
        e.preventDefault()
        console.log('on change')
        const { valueAsNumber } = e.currentTarget
        if (Math.abs(valueAsNumber - this.app.state[this.name]) === 1) {
            this.app[this.setMethodKey](valueAsNumber)
        }
    }

    handleFinalize(e) {
        e.preventDefault()
        console.log('handleFinalize')
        if (e.key && e.key !== 'Enter') return
        const { valueAsNumber } = e.currentTarget
        if (this.app.state[this.name] !== valueAsNumber) {
            this.app[this.setMethodKey](valueAsNumber)
        }
    }

    updateValue(state) {
        const value = state[this.name]
        this.$input.value = value
    }
}

export default NumberInput

import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="calculator"
export default class extends Controller {
  static outlets = ["log"]
  static targets = ["result", "display"]
  static values = {
    eval: String,
    display: String,
  }

  connect() {
    console.log("connecting calculator")

    this.allClear()
  }

  disconnect() {
    console.log("disconnecting calculator")
  }

  appendDigit({ params: { digit } }) {
    this.displayValue += digit
    this.evalValue += digit
  }

  appendOperand({ params: { operandToDisplay, operandToEval } }) {
    this.updateResult()

    this.displayValue += operandToDisplay
    this.evalValue += operandToEval
  }

  allClear() {
    this.displayValue = ""
    this.evalValue = ""

    this.updateResult()
  }

  displayValueChanged() {
    this.updateDisplay()
  }

  updateResult() {
    if(this.evalValue === "") {
      this.resultTarget.innerHTML = "0"
      return
    }

    try {
      this.resultTarget.innerHTML = eval(this.evalValue)
    } catch {
    }
  }

  updateDisplay() {
    this.displayTarget.innerHTML = this.displayValue || "0"
  }

  calculate() {
    const displayValueWas = this.displayValue

    try {
      this.evalValue = eval(this.evalValue)
      this.displayValue = this.evalValue
      this.updateResult()
    } catch {
      this.displayTarget.innerHTML = "ERROR!"
    }

    this.logOutlets.forEach(logOutlet => {
      logOutlet.addLogLine([displayValueWas, this.displayValue].join(" = "))
    })
  }
}

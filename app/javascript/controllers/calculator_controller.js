import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="calculator"
export default class extends Controller {
  static outlets = ["log"]
  static targets = ["display", "eval"]
  static values = {
    eval: String,
    display: String,
  }

  connect() {
    console.log("connecting calculator")
  }

  disconnect() {
    console.log("disconnecting calculator")
  }

  appendDigit({ params: { digit } }) {
    this.displayValue += digit
    this.evalValue += digit
  }

  appendOperand({ params: { operandToDisplay, operandToEval } }) {
    this.displayValue += operandToDisplay
    this.evalValue += operandToEval
  }

  allClear() {
    this.displayValue = ""
    this.evalValue = ""
  }

  displayValueChanged() {
    this.displayTarget.innerHTML = this.displayValue || "0"
  }

  evalValueChanged() {
    this.evalTarget.value = this.evalValue || "0"
  }
}

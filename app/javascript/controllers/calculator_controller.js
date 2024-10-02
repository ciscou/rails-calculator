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
    this.justHitEnter = true
    console.log("connecting calculator")
  }

  disconnect() {
    console.log("disconnecting calculator")
  }

  appendDigit({ params: { digit } }) {
    if(this.justHitEnter) {
      this.justHitEnter = false
      this.displayValue = ""
      this.evalValue = ""
    }

    this.displayValue += digit
    this.evalValue += digit
  }

  appendDot() {
    if(this.justHitEnter) {
      this.justHitEnter = false
      this.displayValue = "0"
      this.evalValue = "0"
    }

    this.displayValue += "."
    this.evalValue += "."
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

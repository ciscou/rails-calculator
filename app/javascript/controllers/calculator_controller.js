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
      this.displayValue = "0"
      this.evalValue = "0"
    }

    this.displayValue += "."
    this.evalValue += "."
  }

  appendOpenParen() {
    this.displayValue += "("
    this.evalValue += "("
  }

  appendCloseParen() {
    this.displayValue += ")"
    this.evalValue += ")"
  }

  appendOperand({ params: { operandToDisplay, operandToEval } }) {
    this.displayValue += operandToDisplay
    this.evalValue += operandToEval
  }

  delete() {
    this.displayValue = this.displayValue.slice(0, -1)
    this.evalValue = this.evalValue.slice(0, -1)
  }

  allClear() {
    this.displayValue = ""
    this.evalValue = ""
  }

  displayValueChanged() {
    this.justHitEnter = false
    this.displayTarget.innerHTML = this.displayValue || "0"
  }

  evalValueChanged() {
    this.justHitEnter = false
    this.evalTarget.value = this.evalValue || "0"
  }
}

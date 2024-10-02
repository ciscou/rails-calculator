import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="log"
export default class extends Controller {
  addLogLine(line) {
    const li = document.createElement("li")
    li.innerHTML = [new Date().toISOString(), line].join(": ")
    this.element.prepend(li)
  }
}

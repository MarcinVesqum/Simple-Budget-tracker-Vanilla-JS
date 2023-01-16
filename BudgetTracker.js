export default class BudgetTracker {
    constructor(querySelectorString) {
        this.root = document.querySelector(querySelectorString)
        this.root.innerHTML = BudgetTracker.html()

        this.root.querySelector(".new-entry").addEventListener("click", () => {
            this.onNewEntryBtnClick()
        })
        // initial data from localStorage
        this.load()
    }
    static html() {
        return `
            <table class="budget-tracker-entries-dev">
            <thead>
            <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
            </tr>
            </thead>
            <tbody class="entries">
                <tr>
                    <td>
                        <input class="input input-date" type="date">
                    </td>
                    <td>
                        <input class="input input-descripton" type="text" placeholder="Add a description (e.g. wages, bills, etc.)">
                    </td>
                    <td>
                        <select class="input input-type">
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </td>
                    <td>
                        <input class="input input-amount" type="number" value="1000">
                    </td>
                    <td>
                        <button class="delete-entry" type="button">&#10005;</button>
                    </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                <td colspan="5" class="controls">
                    <button class="new-entry" type="button">New Entry</button>
                </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                <td colspan="5" class="summary">
                    <strong>Total:</strong>
                    <span class="total">0.00 zł</span>
                </td>
                </tr>
            </tfoot>
            </table>
        `
    }
    static entryHtml() {
        return `
            <tr>
                <td>
                    <input class="input input-date" type="date">
                </td>
                <td>
                    <input class="input input-descripton" type="text" placeholder="Add a description (e.g. wages, bills, etc.)">
                </td>
                <td>
                    <select class="input input-type">
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </td>
                <td>
                    <input class="input input-amount" type="number">
                </td>
                <td>
                    <button class="delete-entry" type="button">&#10005;</button>
                </td>
            </tr>
        `
    }

    load() {
        const entries = JSON.parse(localStorage.getItem("budget-tracker-entries-dev") || "[]")
       
        for (const entry of entries) {
            this.addEntry(entry)
        }

        this.updateSummary()
    }

    updateSummary() {
        const total = this.getEnrtyRows().reduce((total, row) => {
            const amount = row.querySelector(".input-amount").value
            const isExpense = row.querySelector(".input-type").value === "expense"
            const modifier = isExpense ? -1 : 1

            return total + (amount * modifier)
        }, 0)
        const totalFormatted = new Intl.NumberFormat("pl-PL", {
            style: "currency",
            currency: "PLN"
        }).format(total)
        this.root.querySelector(".total").textContent = totalFormatted
    }

    save() {
        const data = this.getEnrtyRows().map(row => {
            return {
                date: row.querySelector(".input-date")?.value || new Date().toISOString().replace(/T.*/, ""),
                description: row.querySelector(".input-description")?.value || "",
                type: row.querySelector(".input-type")?.value || "income",
                amount: parseFloat(row.querySelector(".input-amount")?.value) || 0,
            }
        })
        localStorage.setItem("budget-tracker-entries-dev", JSON.stringify(data))
        this.updateSummary()
    }

    addEntry(entry = {}) {
        this.root.querySelector(".entries").insertAdjacentHTML("beforeend", BudgetTracker.entryHtml())

        const row = this.root.querySelector(".entries tr:last-of-type")

        row.querySelector(".input-date").value = entry.date || new Date().toISOString().replace(/T.*/, "")
        row.querySelector(".input-descripton").value = entry.description || ""
        row.querySelector(".input-type").value = entry.type || "income"
        row.querySelector(".input-amount").value = entry.amount || 0
        row.querySelector(".delete-entry").addEventListener("click", e => {
            this.onDeleteEntryBtnClick(e)
        })
        row.querySelectorAll(".input").forEach(input => {
            input.addEventListener("change", () => this.save())
        })

        
    }

    getEnrtyRows() {
        return Array.from(this.root.querySelectorAll(".entries tr"))
    }
    onNewEntryBtnClick() {
        this.addEntry()
    }

    onDeleteEntryBtnClick(e) {
        e.target.closest("tr").remove()
        this.save()
    }
}
(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function n(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerpolicy&&(r.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?r.credentials="include":t.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(t){if(t.ep)return;t.ep=!0;const r=n(t);fetch(t.href,r)}})();class i{constructor(e){this.root=document.querySelector(e),this.root.innerHTML=i.html(),this.root.querySelector(".new-entry").addEventListener("click",()=>{this.onNewEntryBtnClick()}),this.load()}static html(){return`
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
        `}static entryHtml(){return`
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
        `}load(){const e=JSON.parse(localStorage.getItem("budget-tracker-entries-dev")||"[]");for(const n of e)this.addEntry(n);this.updateSummary()}updateSummary(){const e=this.getEnrtyRows().reduce((o,t)=>{const r=t.querySelector(".input-amount").value,l=t.querySelector(".input-type").value==="expense"?-1:1;return o+r*l},0),n=new Intl.NumberFormat("pl-PL",{style:"currency",currency:"PLN"}).format(e);this.root.querySelector(".total").textContent=n}save(){const e=this.getEnrtyRows().map(n=>{var o,t,r,s;return{date:((o=n.querySelector(".input-date"))==null?void 0:o.value)||new Date().toISOString().replace(/T.*/,""),description:((t=n.querySelector(".input-description"))==null?void 0:t.value)||"",type:((r=n.querySelector(".input-type"))==null?void 0:r.value)||"income",amount:parseFloat((s=n.querySelector(".input-amount"))==null?void 0:s.value)||0}});localStorage.setItem("budget-tracker-entries-dev",JSON.stringify(e)),this.updateSummary()}addEntry(e={}){this.root.querySelector(".entries").insertAdjacentHTML("beforeend",i.entryHtml());const n=this.root.querySelector(".entries tr:last-of-type");n.querySelector(".input-date").value=e.date||new Date().toISOString().replace(/T.*/,""),n.querySelector(".input-descripton").value=e.description||"",n.querySelector(".input-type").value=e.type||"income",n.querySelector(".input-amount").value=e.amount||0,n.querySelector(".delete-entry").addEventListener("click",o=>{this.onDeleteEntryBtnClick(o)}),n.querySelectorAll(".input").forEach(o=>{o.addEventListener("change",()=>this.save())})}getEnrtyRows(){return Array.from(this.root.querySelectorAll(".entries tr"))}onNewEntryBtnClick(){this.addEntry()}onDeleteEntryBtnClick(e){e.target.closest("tr").remove(),this.save()}}new i("#app");

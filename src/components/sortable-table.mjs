/**
 * Progressively enhanced sortable table component.
 *
 * Allow each column to be sorted by clicking on the header. The component should add a sort indicator (like an arrow) to the header of the sorted column.
 *
 * example:
 * ```html
 * <sortable-table>
 *   <table>
 *     <thead>
 *       <tr>
 *         <th>Name</th>
 *         <th>Age</th>
 *         <th>Country</th>
 *       </tr>
 *     </thead>
 *     <tbody>
 *       <tr>
 *         <td>John Doe</td>
 *         <td>30</td>
 *         <td>USA</td>
 *       </tr>
 *       <tr>
 *         <td>Jane Smith</td>
 *         <td>25</td>
 *         <td>Canada</td>
 *       </tr>
 *     </tbody>
 *   </table>
 * </sortable-table>
 * ```
 */
export default class SortableTable extends HTMLElement {
  constructor() {
    super()
    this._sortedIdx = null
    this._asc = true
  }

  connectedCallback() {
    this._init()
  }

  disconnectedCallback() {
    const table = this.querySelector('table')
    if (!table) return
    const headers = Array.from(table.querySelectorAll('th'))
    headers.forEach((th, idx) => {
      th.style.cursor = ''
      th.removeEventListener('click', () => this._sortByColumn(idx))
    })
  }

  _init() {
    const table = this.querySelector('table')
    if (!table) return
    const thead = table.querySelector('thead')
    if (!thead) return
    const headers = Array.from(thead.querySelectorAll('th'))
    headers.forEach((th, idx) => {
      th.style.cursor = 'pointer'
      th.addEventListener('click', () => this._sortByColumn(idx))
    })
  }

  /**
   * @param idx {number} - The index of the column to sort by.
   */
  _sortByColumn(idx) {
    const table = this.querySelector('table')
    if (!table) return
    const tbody = table.querySelector('tbody')
    if (!tbody) return
    const rows = Array.from(tbody.querySelectorAll('tr'))
    const isNumber = rows.every((row) => {
      const cell = row.children[idx]
      if (!cell.textContent) return false
      return cell && !isNaN(Number(cell.textContent.trim()))
    })

    // Determine sort direction
    if (this._sortedIdx === idx) {
      this._asc = !this._asc
    } else {
      this._asc = true
      this._sortedIdx = idx
    }

    const sortedRows = rows.sort((a, b) => {
      const aText = a.children[idx]?.textContent?.trim() ?? ''
      const bText = b.children[idx]?.textContent?.trim() ?? ''
      if (isNumber) {
        return this._asc
          ? Number(aText) - Number(bText)
          : Number(bText) - Number(aText)
      }
      return this._asc ? aText.localeCompare(bText) : bText.localeCompare(aText)
    })

    // Re-append sorted rows
    sortedRows.forEach((row) => tbody.appendChild(row))

    // Update header arrows
    this._updateHeaderArrows(idx)
  }

  /**
   * @param sortedIdx {number} - The index of the sorted column.
   */
  _updateHeaderArrows(sortedIdx) {
    const table = this.querySelector('table')
    if (!table) return
    const headers = Array.from(table.querySelectorAll('thead th'))
    headers.forEach((th, idx) => {
      // Remove any existing arrows
      th.textContent =
        th.textContent?.replace(/[\u2191\u2193]$/, '').trim() ?? ''
      if (idx === sortedIdx) {
        th.textContent += this._asc ? ' \u2193' : ' \u2191' // ↓ or ↑
      }
    })
  }
}

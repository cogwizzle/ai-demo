import SortableTable from './sortable-table.mjs'
import { expect, fixture, html } from '@open-wc/testing'

/** @type {HTMLElement | undefined} */
let table

const randomPrefix = () => Math.random().toString(36).substring(2, 15)

/**
 * @param {string} title
 */
function addRow(title) {
  const row = document.createElement('tr')
  const cell = document.createElement('td')
  cell.textContent = title
  row.appendChild(cell)
  table?.querySelector('tbody')?.appendChild(row)
}

async function setup() {
  customElements.define('sortable-table', SortableTable)
  const document = await fixture(
    html`<sortable-table>
      <table>
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </sortable-table>`
  )
  table = document.querySelector('table') ?? undefined
  if (!table) {
    throw new Error('Table element not found')
  }
  Array.from({ length: 100 }).forEach((_, index) => {
    addRow(`${randomPrefix()} ${index + 1}`)
  })
}

/**
 * @param {number} [ms] - The number of milliseconds to wait
 */
async function wait(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

before(setup)

describe('Sortable Table Tests', () => {
  it('should have 100 rows', () => {
    const rows = table?.querySelectorAll('tbody tr')
    if (!rows) {
      throw new Error('Rows not found in the table')
    }
    expect(rows.length).to.equal(100)
  })

  it('should sort rows alphabetically when clicked', async () => {
    // Simulate a click on the header to sort
    const header = table?.querySelector('thead th')
    if (!header) {
      throw new Error('Header not found in the table')
    }
    if ('click' in header === false) {
      throw new Error('Header does not support click event')
    }
    if (typeof header.click !== 'function') {
      throw new Error('Header click method is not a function')
    }
    header?.click()

    // Wait for sorting to complete
    await wait(100)

    const rows = table?.querySelectorAll('tbody tr')
    if (!rows) {
      throw new Error('Rows not found in the table after sorting')
    }
    // For all 100 rows, check if they are sorted
    const sortedRows = Array.from(rows).map((cell) => cell.textContent)
    const expectedSortedRows = sortedRows.slice().sort()
    expect(sortedRows).to.deep.equal(expectedSortedRows)
  })
})

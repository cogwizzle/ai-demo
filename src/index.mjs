import SortableTable from './components/sortable-table.mjs'

if ('customElements' in window) {
  if (!customElements.get('sortable-table')) {
    customElements.define('sortable-table', SortableTable)
  }
}

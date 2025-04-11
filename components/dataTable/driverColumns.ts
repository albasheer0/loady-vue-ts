import type { ColumnDef } from '@tanstack/vue-table'
import type { Driver } from '@/data/schema'
import { h } from 'vue'
import DataTableColumnHeader from './DataTableColumnHeader.vue'
import DriverRowActions from './DriverRowActions.vue'

export const columns: ColumnDef<Driver>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => h(DataTableColumnHeader<Driver>, { column, title: 'ID' }),
    cell: ({ row }) => h('div', { class: 'w-[60px] md:w-[80px]' }, row.getValue('id')),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => h(DataTableColumnHeader<Driver>, { column, title: 'Name' }),
    cell: ({ row }) => h('div', { class: 'max-w-[120px] md:max-w-[200px] truncate font-medium' }, row.getValue('name')),
  },
  {
    accessorKey: 'location',
    header: ({ column }) => h(DataTableColumnHeader<Driver>, { column, title: 'Location' }),
    cell: ({ row }) => h('div', { class: 'max-w-[100px] md:max-w-[150px] truncate' }, row.getValue('location')),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => h(DriverRowActions, { row }),
  },
] 
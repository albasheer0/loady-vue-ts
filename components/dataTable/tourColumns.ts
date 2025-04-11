import type { ColumnDef } from '@tanstack/vue-table'
import type { Tour, TourStatus } from '@/data/schema'
import { h } from 'vue'
import DataTableColumnHeader from './DataTableColumnHeader.vue'
import TourRowActions from './TourRowActions.vue'
import { Badge } from '../ui/badge'
import type { BadgeVariants } from '../ui/badge'
import { useDriverStore } from '@/stores/driverStore'

export const columns: ColumnDef<Tour>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => h(DataTableColumnHeader<Tour>, { column, title: 'ID' }),
    cell: ({ row }) => h('div', { class: 'w-[60px] md:w-[80px]' }, row.getValue('id')),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'customerName',
    header: ({ column }) => h(DataTableColumnHeader<Tour>, { column, title: 'Customer' }),
    cell: ({ row }) => h('div', { class: 'max-w-[120px] md:max-w-[200px] truncate font-medium' }, row.getValue('customerName')),
  },
  {
    accessorKey: 'shipmentDate',
    header: ({ column }) => h(DataTableColumnHeader<Tour>, { column, title: 'Date' }),
    cell: ({ row }) => {
      const date = new Date(row.getValue('shipmentDate'));
      const formattedDate = date.toLocaleDateString('en-GB');
      return h('div', { class: 'w-[80px] md:w-[100px]' }, formattedDate);
    },
  },
  {
    accessorKey: 'locationFrom',
    header: ({ column }) => h(DataTableColumnHeader<Tour>, { column, title: 'From' }),
    cell: ({ row }) => h('div', { class: 'max-w-[80px] md:max-w-[120px] truncate' }, row.getValue('locationFrom')),
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'locationTo',
    header: ({ column }) => h(DataTableColumnHeader<Tour>, { column, title: 'To' }),
    cell: ({ row }) => h('div', { class: 'max-w-[80px] md:max-w-[120px] truncate' }, row.getValue('locationTo')),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => h(DataTableColumnHeader<Tour>, { column, title: 'Status' }),
    cell: ({ row }) => {
      const status = row.getValue('status') as TourStatus;
      let variant: BadgeVariants['variant'] = 'secondary';
      switch (status) {
        case 'Scheduled':
          variant = 'default';
          break;
        case 'In Progress':
          variant = 'warning';
          break;
        case 'Completed':
          variant = 'success';
          break;
        case 'Cancelled':
          variant = 'destructive';
          break;
      }
      return h(Badge, { variant, class: 'w-[100px] md:w-[120px] truncate' }, status);
    },
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'driverId',
    header: ({ column }) => h(DataTableColumnHeader<Tour>, { column, title: 'Driver' }),
    cell: ({ row }) => {
      const driverStore = useDriverStore();
      const driverId = row.getValue('driverId') as string;
      const driver = driverStore.getDriverById(driverId);
      const driverName = driver ? driver.name : 'Unassigned';
      return h('div', { class: 'max-w-[100px] md:max-w-[150px] truncate' }, driverName);
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => h(TourRowActions, { row }),
  },
] 
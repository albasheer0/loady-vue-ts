<script setup lang="ts" generic="TData">
import type { Table } from '@tanstack/vue-table'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { computed } from 'vue'

interface DataTableToolbarProps {
  table: Table<TData>
}

const props = defineProps<DataTableToolbarProps>()

const isFiltered = computed(() => props.table.getState().columnFilters.length > 0)
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-1 items-center space-x-2">
      <Button
        v-if="isFiltered"
        variant="ghost"
        class="h-8 px-2 lg:px-3"
        @click="table.resetColumnFilters()"
      >
        Reset
        <Icon name="i-lucide-cross-circle" class="ml-2 h-4 w-4" />
      </Button>
    </div>
  </div>
</template>

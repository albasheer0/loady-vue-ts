<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <td
    :class="
      cn(
        'p-2 md:p-4 align-middle break-words [&:has([role=checkbox])]:pr-0',
        props.class,
      )
    "
  >
    <slot />
  </td>
</template>

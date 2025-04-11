<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { predefinedLocations } from '@/data/predefined'
import type { FormContext } from 'vee-validate'

const props = defineProps<{
  form: FormContext<any>,
  name: string,
  label: string,
  onLocationChange?: (value: string) => void
}>()
</script>

<template>
  <FormField :name="name" v-slot="{ componentField, field }">
    <FormItem>
      <FormLabel>{{ label }}</FormLabel>
      <FormControl>
        <Select 
          :value="field.value"
          @update:model-value="(value) => {
            field.onChange(value);
            if (onLocationChange) onLocationChange(value);
          }"
        >
          <SelectTrigger>
            <SelectValue :placeholder="'Select ' + label.toLowerCase()" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="location in predefinedLocations" :key="location.value" :value="location.value">
              {{ location.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template> 
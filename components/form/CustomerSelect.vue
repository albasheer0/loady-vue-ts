<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { predefinedCustomers } from '@/data/predefined'
import type { FormContext } from 'vee-validate'

defineProps<{
  form: FormContext<any>
}>()
</script>

<template>
  <FormField name="customerName" v-slot="{ componentField, field }">
    <FormItem>
      <FormLabel>Customer Name</FormLabel>
      <FormControl>
        <Select 
          v-bind="componentField"
          :value="field.value"
          @update:model-value="field.onChange"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a customer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="customer in predefinedCustomers" :key="customer.value" :value="customer.value">
              {{ customer.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template> 
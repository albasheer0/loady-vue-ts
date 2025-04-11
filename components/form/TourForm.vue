<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import CustomerSelect from './CustomerSelect.vue'
import LocationSelect from './LocationSelect.vue'
import { computed, ref } from 'vue'
import { useDriverStore } from '@/stores/driverStore'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import type { FormContext } from 'vee-validate'
import * as z from 'zod'


const formSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  shipmentDate: z.string().min(1, 'Shipment date is required'),
  locationFrom: z.string().min(1, 'Pickup location is required'),
  locationTo: z.string().min(1, 'Delivery location is required'),
  driverId: z.string().min(1, 'Driver is required')
})

type FormValues = z.infer<typeof formSchema>

const props = defineProps<{
  form: FormContext<Partial<FormValues>>,
  isSubmitting?: boolean,
  onSubmit: (values: FormValues) => Promise<void>,
  onCancel?: () => void,
  submitLabel?: string
}>()

const driverStore = useDriverStore()

// Location field synchronization for filtering drivers
const locationFrom = ref('')

// Filtered drivers based on location
const filteredDrivers = computed(() => {
  return driverStore.getDriversByLocation(locationFrom.value)
})

// Update location and filter drivers
const handleLocationFromChange = (value: string) => {
  locationFrom.value = value
  props.form.setFieldValue('locationFrom', value)
  props.form.setFieldValue('driverId', '') // Reset driver when location changes
}

// Handle form submission
const handleSubmit = async (e: Event) => {
  e.preventDefault()
  const result = await props.form.validate()
  
  if (!result.valid) return
  
  const values: FormValues = {
    customerName: result.values?.customerName || '',
    shipmentDate: result.values?.shipmentDate || '',
    locationFrom: result.values?.locationFrom || '',
    locationTo: result.values?.locationTo || '',
    driverId: result.values?.driverId || ''
  }
  
  await props.onSubmit(values)
  props.form.resetForm()
  locationFrom.value = ''
}
</script>

<template>
  <form @submit="handleSubmit">
    <div class="grid gap-4 py-4">
      <CustomerSelect :form="form" />
      
      <FormField name="shipmentDate" v-slot="{ field, errorMessage }">
        <FormItem>
          <FormLabel>Shipment Date</FormLabel>
          <FormControl>
            <Input 
              type="date" 
              :value="field.value"
              @update:model-value="field.onChange"
              :min="new Date().toISOString().split('T')[0]"
            />
          </FormControl>
          <FormMessage>{{ errorMessage }}</FormMessage>
        </FormItem>
      </FormField>

      <div class="grid grid-cols-2 gap-4">
        <FormField name="locationFrom" v-slot="{ field, errorMessage }">
          <FormItem>
            <FormControl>
              <LocationSelect 
                :form="form" 
                name="locationFrom" 
                label="Pickup Location"
                :onLocationChange="handleLocationFromChange"
              />
            </FormControl>
            <FormMessage>{{ errorMessage }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField name="locationTo" v-slot="{ field, errorMessage }">
          <FormItem>
            <FormControl>
              <LocationSelect 
                :form="form" 
                name="locationTo" 
                label="Delivery Location"
              />
            </FormControl>
            <FormMessage>{{ errorMessage }}</FormMessage>
          </FormItem>
        </FormField>
      </div>

      <FormField name="driverId" v-slot="{ field, errorMessage }">
        <FormItem>
          <FormLabel>Driver</FormLabel>
          <FormControl>
            <Select 
              :value="field.value"
              @update:model-value="field.onChange"
              :disabled="!filteredDrivers.length"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a driver" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="driver in filteredDrivers" :key="driver.id" :value="driver.id">
                  {{ driver.name }} ({{ driver.location }})
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <div v-if="!filteredDrivers.length && locationFrom" class="text-sm text-yellow-600">
            No drivers available for this location.
          </div>
          <FormMessage>{{ errorMessage }}</FormMessage>
        </FormItem>
      </FormField>
    </div>

    <DialogFooter>
      <Button v-if="onCancel"  type="button" variant="outline" @click="onCancel" :disabled="isSubmitting">
        Cancel
      </Button>
      <Button class="mb-3" type="submit" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background"></span>
        {{ submitLabel || 'Submit' }}
      </Button>
    </DialogFooter>
  </form>
</template> 
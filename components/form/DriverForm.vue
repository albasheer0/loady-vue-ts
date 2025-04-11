<script setup lang="ts">
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import type { FormContext } from 'vee-validate'
import * as z from 'zod'
import { predefinedLocations } from '@/data/predefined'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required')
})

type FormValues = z.infer<typeof formSchema>

const props = defineProps<{
  form: FormContext<FormValues>,
  isSubmitting?: boolean,
  onSubmit: (values: FormValues) => Promise<void>,
  onCancel?: () => void,
  submitLabel?: string
}>()

// Handle form submission
const handleSubmit = async (e: Event) => {
  e.preventDefault()
  const result = await props.form.validate()
  
  if (!result.valid || !result.values) return
  
  const values: FormValues = {
    name: result.values.name || '',
    location: result.values.location || ''
  }
  
  await props.onSubmit(values)
}
</script>

<template>
  <form @submit="handleSubmit">
    <div class="grid gap-4 py-4">
      <FormField
      name="name"
      v-slot="{ field, errorMessage }"
      >
      <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input 
            :model-value="field.value"
              :value="field.value"
              @update:model-value="field.onChange"
              placeholder="John Doe" 
            />
          </FormControl>
          <FormMessage>{{ errorMessage }}</FormMessage>
        </FormItem>
      </FormField>

      <FormField
        name="location"
        v-slot="{ field, errorMessage }"
      >
        <FormItem>
          <FormLabel>Location</FormLabel>
          <FormControl>
            <Select 
              :model-value="field.value"
              @update:model-value="field.onChange"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem 
                  v-for="location in predefinedLocations" 
                  :key="location.value" 
                  :value="location.value"
                >
                  {{ location.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage>{{ errorMessage }}</FormMessage>
        </FormItem>
      </FormField>
    </div>

    <DialogFooter>
      <Button 
        v-if="onCancel" 
        type="button" 
        variant="outline" 
        @click="props.onCancel" 
        :disabled="props.isSubmitting"
      >
        Cancel
      </Button>
      <Button class="mb-3" type="submit" :disabled="props.isSubmitting">
        <span 
          v-if="props.isSubmitting" 
          class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background"
        />
        {{ props.submitLabel || 'Submit' }}
      </Button>
    </DialogFooter>
  </form>
</template> 
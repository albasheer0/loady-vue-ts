<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { Driver } from '../../data/schema'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { ref, watch } from 'vue'
import { driverSchema } from '../../data/schema'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { useDriverStore } from '../../stores/driverStore'
import { useToast } from '../../components/ui/toast/use-toast'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import DriverForm from '../form/DriverForm.vue'

interface DriverRowActionsProps {
  row: Row<Driver>
}
const props = defineProps<DriverRowActionsProps>()

// Get the driver store
const driverStore = useDriverStore()

// Initialize toast
const { toast } = useToast()

// Edit dialog state
const editDialogOpen = ref(false)

// Delete dialog state
const deleteDialogOpen = ref(false)

// Edit form setup
const editForm = useForm<{ name: string, location: string }>({
  validationSchema: toTypedSchema(driverSchema.omit({ id: true })),
  initialValues: {
    ...props.row.original,
  }
})

// Reset form values when dialog opens
watch(editDialogOpen, (isOpen) => {
  if (isOpen) {
    // Set initial values when dialog opens
    editForm.setValues({
      ...props.row.original,
    })
  } else {
    // Reset form when dialog closes
    editForm.resetForm()
  }
})

// Loading states
const isUpdating = ref(false)
const isDeleting = ref(false)

// Function to update driver
const updateDriver = async (values: { name: string, location: string }) => {
  try {
    isUpdating.value = true
    await driverStore.updateDriver(props.row.original.id, values)
    
    editDialogOpen.value = false
    
    toast({
      title: 'Success',
      description: 'Driver updated successfully',
    })
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to update driver',
      variant: 'destructive'
    })
  } finally {
    isUpdating.value = false
  }
}

// Function to delete driver
const deleteDriver = async () => {
  isDeleting.value = true
  try {
    await driverStore.deleteDriver(props.row.original.id)
    
    deleteDialogOpen.value = false
    
    toast({
      title: 'Success',
      description: 'Driver deleted successfully',
    })
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to delete driver',
      variant: 'destructive'
    })
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <!-- Row actions dropdown menu -->
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        class="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
      >
        <Icon name="i-lucide-ellipsis" class="h-4 w-4" />
        <span class="sr-only">Open menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[160px]">
      <DropdownMenuItem @click="editDialogOpen = true">Edit</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="deleteDialogOpen = true" class="text-red-600">
        Delete
        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <!-- Edit dialog -->
  <Dialog v-model:open="editDialogOpen">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit driver</DialogTitle>
      </DialogHeader>
      <DriverForm
        :form="editForm"
        :is-submitting="isUpdating"
        :on-submit="updateDriver"
        :on-cancel="() => editDialogOpen = false"
        submit-label="Save changes"
      />
    </DialogContent>
  </Dialog>

  <!-- Delete confirmation dialog -->
  <Dialog v-model:open="deleteDialogOpen">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Delete driver</DialogTitle>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <p>Are you sure you want to delete this driver?</p>
        <p class="font-medium">{{ props.row.original.name }}</p>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" @click="deleteDialogOpen = false" :disabled="isDeleting">Cancel</Button>
        <Button type="button" variant="destructive" @click="deleteDriver" :disabled="isDeleting">
          <span v-if="isDeleting" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background"></span>
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template> 
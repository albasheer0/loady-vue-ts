<script setup lang="ts">
import { h, ref } from 'vue'
import type { Row } from '@tanstack/vue-table'
import type { Tour, TourStatus } from '@/data/schema'
import { Button } from '../ui/button'
import { DotsHorizontalIcon } from '@radix-icons/vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '../ui/dropdown-menu'
import { useTourStore } from '@/stores/tourStore'
import { useToast } from '@/components/ui/toast/use-toast'
import { tourStatuses, tourSchema } from '@/data/schema'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import TourForm from '../form/TourForm.vue'

const props = defineProps<{
  row: Row<Tour>
}>()

// Get the stores
const tourStore = useTourStore()
const { toast } = useToast()

// Edit dialog state
const editDialogOpen = ref(false)

// Loading states
const isUpdating = ref(false)
const isUpdatingStatus = ref(false)
const isDeleting = ref(false)

// Edit form
const editForm = useForm({
  validationSchema: toTypedSchema(tourSchema),
  initialValues: {
    ...props.row.original,  },
})

// Function to update tour
const updateTour = async (values: any) => {
  isUpdating.value = true
  try {
    await tourStore.updateTour(props.row.original.id, values)
    
    editDialogOpen.value = false
    
    toast({
      title: 'Success',
      description: 'Tour updated successfully',
    })
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to update tour',
      variant: 'destructive'
    })
  } finally {
    isUpdating.value = false
  }
}

// Function to update tour status
const updateStatus = async (status: TourStatus) => {
  isUpdatingStatus.value = true
  try {
    await tourStore.updateTourStatus(props.row.original.id, status)
    toast({
      title: 'Success',
      description: 'Tour status updated successfully',
    })
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to update tour status',
      variant: 'destructive'
    })
  } finally {
    isUpdatingStatus.value = false
  }
}

// Function to delete tour
const deleteTour = async () => {
  isDeleting.value = true
  try {
    await tourStore.deleteTour(props.row.original.id)
    toast({
      title: 'Success',
      description: 'Tour deleted successfully',
    })
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to delete tour',
      variant: 'destructive'
    })
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="flex justify-end">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" class="h-8 w-8 p-0">
          <span class="sr-only">Open menu</span>
          <DotsHorizontalIcon class="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem 
                v-for="status in tourStatuses" 
                :key="status" 
                @click="updateStatus(status)" 
                :disabled="isUpdatingStatus"
              >
                <span class="capitalize">{{ status }}</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          class="text-red-600" 
          @click="deleteTour"
          :disabled="isDeleting"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <!-- Edit dialog -->
    <Dialog v-model:open="editDialogOpen">
      <DialogContent class="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit tour</DialogTitle>
        </DialogHeader>
        <TourForm 
          :form="editForm"
          :isSubmitting="isUpdating"
          :onSubmit="updateTour"
          :onCancel="() => editDialogOpen = false"
          submitLabel="Save changes"
        />
      </DialogContent>
    </Dialog>
  </div>
</template> 
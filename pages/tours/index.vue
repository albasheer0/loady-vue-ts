<script setup lang="ts">
import { columns } from '@/components/dataTable/tourColumns'
import DataTable from '@/components/dataTable/DataTable.vue'
import { Button } from '@/components/ui/button'
import { ref, computed, onMounted } from 'vue'
import { PlusIcon } from '@radix-icons/vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { tourSchema, type Tour, type Driver } from '@/data/schema'
import { useTourStore } from '@/stores/tourStore'
import { useDriverStore } from '@/stores/driverStore'
import { useToast } from '@/components/ui/toast/use-toast'
import TourForm from '@/components/form/TourForm.vue'


// Initialize toast
const { toast } = useToast()
useSeoMeta({
  title: 'Tours',
  description: 'Tours CRUD',
})
// Get the stores
const tourStore = useTourStore()
const driverStore = useDriverStore()

// Fetch data when component mounts
onMounted(async () => {
  try {
    await Promise.all([
      driverStore.fetchDrivers(),
      tourStore.fetchTours()
    ])
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to load data',
      variant: 'destructive'
    })
  }
})

// New tour dialog state
const addDialogOpen = ref(false)

// Search functionality
const searchQuery = ref('')
const filteredTours = computed(() => {
  if (!searchQuery.value) return tourStore.tours;
  
  const query = searchQuery.value.toLowerCase();
  return tourStore.tours.filter(tour => 
    tour.customerName.toLowerCase().includes(query) || 
    tour.locationFrom.toLowerCase().includes(query) ||
    tour.locationTo.toLowerCase().includes(query)
  );
})

// Location from value for filtering drivers
const locationFromValue = ref('')

// Filtered drivers based on location from
const filteredDrivers = computed(() => {
  if (!locationFromValue.value) return [];
  
  // Use partial match for location instead of exact match
  return driverStore.getDriversByLocation(locationFromValue.value);
})

// Filtered drivers based on location from
const hasAvailableDrivers = computed(() => filteredDrivers.value.length > 0)

// New tour form
const addForm = useForm({
  validationSchema: toTypedSchema(tourSchema.omit({ id: true }).required()),
  initialValues: {
    customerName: '',
    shipmentDate: '',
    locationFrom: '',
    locationTo: '',
    driverId: '',
    status: 'Scheduled' as const,
  }
})

// Loading state
const isSubmitting = ref(false)

// Add a new tour
const addTour = async (values: any) => {
  try {
    // Set loading state
    isSubmitting.value = true

    // Check if a driver is available for the selected location
    if (locationFromValue.value && !hasAvailableDrivers.value) {
      toast({
        title: 'Validation Error',
        description: 'No drivers available for the selected location',
        variant: 'destructive'
      })
      isSubmitting.value = false
      return
    }

    await tourStore.addTour({
      ...values,
      status: 'Scheduled' // Ensure status is set for new tours
    })
    
    addDialogOpen.value = false
    addForm.resetForm()
    locationFromValue.value = ''
    
    toast({
      title: 'Success',
      description: 'Tour added successfully',
    })
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to add tour',
      variant: 'destructive'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="flex h-full flex-1 flex-col space-y-8 p-4 md:p-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">
          Tours
        </h2>
        <p class="text-muted-foreground">
          Manage your shipment tours
        </p>
      </div>
      <Button size="sm" @click="addDialogOpen = true">
        <PlusIcon class="mr-2 h-4 w-4" />
        Add Tour
      </Button>
    </div>
    
    <!-- Search bar -->
    <div class="flex items-center space-x-2">
      <Input 
        v-model="searchQuery"
        placeholder="Search tours by customer, from or to location..." 
        class="w-full md:max-w-sm"
      />
    </div>
    
    <!-- Loading state -->
    <div v-if="tourStore.isLoading" class="flex justify-center items-center py-8">
      <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="tourStore.error" class="p-4 border border-destructive text-destructive rounded-md">
      {{ tourStore.error }}
      <Button variant="outline" size="sm" class="ml-2" @click="tourStore.fetchTours">
        Retry
      </Button>
    </div>
    
    <!-- Data table -->
    <DataTable v-else :data="filteredTours" :columns="columns" />

    <!-- Add tour dialog -->
    <Dialog v-model:open="addDialogOpen">
      <DialogContent class="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add new tour</DialogTitle>
        </DialogHeader>
        <TourForm 
          :form="addForm"
          :isSubmitting="isSubmitting"
          :onSubmit="addTour"
          :onCancel="() => addDialogOpen = false"
          submitLabel="Add Tour"
        />
      </DialogContent>
    </Dialog>
  </div>
</template> 
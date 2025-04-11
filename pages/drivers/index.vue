<script setup lang="ts">
import { columns } from '@/components/dataTable/driverColumns'
import DataTable from '@/components/dataTable/DataTable.vue'
import { Button } from '@/components/ui/button'
import { ref, computed, onMounted } from 'vue'
import { PlusIcon } from '@radix-icons/vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { driverSchema } from '@/data/schema'
import { useDriverStore } from '@/stores/driverStore'
import { useToast } from '@/components/ui/toast/use-toast'
import DriverForm from '@/components/form/DriverForm.vue'

// Initialize toast
const { toast } = useToast()
useSeoMeta({
  title: 'Drivers',
  description: 'Drivers CRUD',
})
// Get the driver store
const driverStore = useDriverStore()

// Fetch drivers when component mounts
onMounted(async () => {
  try {
    await driverStore.fetchDrivers()
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to load drivers',
      variant: 'destructive'
    })
  }
})

// New driver dialog state
const addDialogOpen = ref(false)

// Search functionality
const searchQuery = ref('')
const filteredDrivers = computed(() => {
  if (!searchQuery.value) return driverStore.drivers;
  
  const query = searchQuery.value.toLowerCase();
  return driverStore.drivers.filter(driver => 
    driver.name.toLowerCase().includes(query) || 
    driver.location.toLowerCase().includes(query)
  );
})

// Form setup
const addForm = useForm<{ name: string, location: string }>({
  validationSchema: toTypedSchema(driverSchema.omit({ id: true }).required()),
  initialValues: {
    name: '',
    location: ''
  }
})

// Loading state
const isSubmitting = ref(false)

// Add a new driver
const addDriver = async (values: { name: string, location: string }) => {
  try {
    isSubmitting.value = true
    await driverStore.addDriver(values)
    
    addDialogOpen.value = false
    addForm.resetForm()
    
    toast({
      title: 'Success',
      description: 'Driver added successfully',
    })
  } catch (error) {
    if (error instanceof Error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add driver',
        variant: 'destructive'
      })
    }
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
          Drivers
        </h2>
        <p class="text-muted-foreground">
          Manage your drivers and their locations
        </p>
      </div>
      <Button size="sm" @click="addDialogOpen = true">
        <PlusIcon class="mr-2 h-4 w-4" />
        Add Driver
      </Button>
    </div>
    
    <!-- Search bar -->
    <div class="flex items-center space-x-2">
      <Input 
        v-model="searchQuery"
        placeholder="Search drivers by name or location..." 
        class="w-full md:max-w-sm"
      />
    </div>
    
    <!-- Add driver dialog -->
    <Dialog v-model:open="addDialogOpen">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new driver</DialogTitle>
        </DialogHeader>
        <DriverForm
          :form="addForm"
          :is-submitting="isSubmitting"
          :on-submit="addDriver"
          :on-cancel="() => addDialogOpen = false"
          submit-label="Add Driver"
        />
      </DialogContent>
    </Dialog>

    <!-- Loading state -->
    <div v-if="driverStore.isLoading" class="flex justify-center items-center py-8">
      <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="driverStore.error" class="p-4 border border-destructive text-destructive rounded-md">
      {{ driverStore.error }}
      <Button variant="outline" size="sm" class="ml-2" @click="driverStore.fetchDrivers">
        Retry
      </Button>
    </div>
    
    <!-- Data table -->
    <DataTable v-else :data="filteredDrivers" :columns="columns" />
  </div>
</template> 
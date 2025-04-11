import { defineStore } from 'pinia'
import { faker } from '@faker-js/faker'
import type { Tour, Driver, TourStatus } from '../data/schema'
import { useDriverStore } from './driverStore'
import { nanoid } from 'nanoid'
import { ref, computed } from 'vue'
import { predefinedLocations, predefinedCustomers } from '../data/predefined'
import { tourStatuses } from '../data/schema'

// Modify generateTours to accept driver data/functions as arguments
const generateTours = (
  count: number = 46, 
  allDrivers: Driver[], 
  getDriversByLocation: (location: string) => Driver[] 
): Tour[] => {
  // Remove useDriverStore() call from here
  // const driverStore = useDriverStore()
  // const allDrivers = driverStore.drivers
  
  if (!allDrivers || allDrivers.length === 0) {
    console.warn("generateTours called with no drivers available.");
    return []; // Return empty or handle error appropriately
  }

  return Array.from({ length: count }, (_, i) => {
    const locationFrom = predefinedLocations[i % predefinedLocations.length]
    const locationTo = predefinedLocations[(i + 1) % predefinedLocations.length]
    const customer = predefinedCustomers[i % predefinedCustomers.length]
    
    // Use the passed-in function
    const driversFromLocation = getDriversByLocation(locationFrom.value)
    const randomDriver = driversFromLocation.length > 0 
      ? driversFromLocation[Math.floor(Math.random() * driversFromLocation.length)]
      : allDrivers[Math.floor(Math.random() * allDrivers.length)]
    
    const randomStatus = tourStatuses[Math.floor(Math.random() * tourStatuses.length)];

    return {
      id: `tour-${i + 1}`,
      customerName: customer.value,
      shipmentDate: faker.date.between({ from: new Date('2024-01-01'), to: new Date('2024-12-31') }).toISOString().split('T')[0],
      locationFrom: locationFrom.value,
      locationTo: locationTo.value,
      driverId: randomDriver.id,
      status: randomStatus,
    }
  })
}

export const useTourStore = defineStore('tours', () => {
  // State
  const tours = ref<Tour[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)

  // Get driver store instance *inside* the store setup
  const driverStore = useDriverStore();

  // Make initializeStore async to await driver fetching
  const initializeStore = async () => { 
    if (!isInitialized.value) {
      try {
        isLoading.value = true; // Indicate loading while initializing
        // Ensure drivers are fetched first
        await driverStore.fetchDrivers(); 
        
        // Check if drivers were fetched successfully before generating tours
        if (driverStore.drivers && driverStore.drivers.length > 0) {
          // Pass driver data and getter function to generateTours
          tours.value = generateTours(
            46, // Default count
            driverStore.drivers, 
            driverStore.getDriversByLocation
          );
        } else {
          // Handle case where drivers failed to load or are empty
          console.warn('TourStore: Drivers not available after fetch, cannot generate initial tours.');
          error.value = "Failed to load driver data for tour generation.";
          // tours.value will remain empty
        }
        isInitialized.value = true
      } catch (fetchError) {
        console.error("TourStore: Error fetching drivers during initialization:", fetchError);
        error.value = "Failed to initialize tour data due to driver fetch error.";
      } finally {
        isLoading.value = false;
      }
    }
  }

  // Getters
  const getTourById = (id: string) => {
    return tours.value.find(tour => tour.id === id)
  }

  const getToursByDriver = (driverId: string) => {
    return tours.value.filter(tour => tour.driverId === driverId)
  }

  // Actions
  const fetchTours = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      // Ensure store is initialized (await initialization)
      await initializeStore();
      
      // Simulate network delay (if needed, or remove if init handles data)
      // await new Promise(resolve => setTimeout(resolve, 500))
      // In a real app, this might fetch *updates* or verify data
      // tours.value = await api.getTours()
    } catch (e) {
      // Error handling might be redundant if initializeStore handles it
      if (!error.value) { // Only set error if init didn't already
        error.value = 'Failed to fetch tours'
        console.error(e)
      }
    } finally {
      isLoading.value = false
    }
  }

  const addTour = async (tourData: Omit<Tour, 'id' | 'status'>) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Create new tour
      const newTour: Tour = {
        id: `tour-${nanoid(6)}`,
        ...tourData,
        status: 'Scheduled',
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Add to state (in real app, this would be after API confirms creation)
      tours.value.unshift(newTour)
      
      return newTour
    } catch (e) {
      error.value = 'Failed to add tour'
      console.error(e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const updateTour = async (id: string, tourData: Partial<Omit<Tour, 'id'>>) => {
    isLoading.value = true
    error.value = null
    
    try {
      const tourIndex = tours.value.findIndex(t => t.id === id)
      if (tourIndex === -1) {
        throw new Error('Tour not found')
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update tour in state
      const updatedTour = {
        ...tours.value[tourIndex],
        ...tourData
      }
      
      tours.value[tourIndex] = updatedTour
      return updatedTour
    } catch (e) {
      error.value = 'Failed to update tour'
      console.error(e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  // Action to update only the tour status
  const updateTourStatus = async (id: string, status: TourStatus) => {
    isLoading.value = true
    error.value = null
    try {
      const tourIndex = tours.value.findIndex(t => t.id === id)
      if (tourIndex === -1) {
        throw new Error('Tour not found')
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300))

      // Update status in state
      tours.value[tourIndex].status = status
      return tours.value[tourIndex]
    } catch (e) {
      error.value = 'Failed to update tour status'
      console.error(e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const deleteTour = async (id: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Remove from state
      tours.value = tours.value.filter(t => t.id !== id)
      return true
    } catch (e) {
      error.value = 'Failed to delete tour'
      console.error(e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    tours,
    isLoading,
    error,
    fetchTours,
    getTourById,
    getToursByDriver,
    addTour,
    updateTour,
    deleteTour,
    initializeStore,
    updateTourStatus
  }
}) 
import { defineStore } from 'pinia'
import { faker } from '@faker-js/faker'
import type { Driver } from '../data/schema'
import { nanoid } from 'nanoid'
import { ref } from 'vue'
import { predefinedLocations } from '../data/predefined'

// Generate random drivers
const generateDrivers = (count: number = 26): Driver[] => {
  return Array.from({ length: count }, (_, i) => {
    const location = predefinedLocations[i % predefinedLocations.length]
    return {
      id: `driver-${i + 1}`,
      name: faker.person.fullName(),
      location: location.value,
    }
  })
}

export const useDriverStore = defineStore('drivers', () => {
  // State
  const drivers = ref<Driver[]>(generateDrivers())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const getDriverById = (id: string) => {
    return drivers.value.find(driver => driver.id === id)
  }

  const getDriversByLocation = (location: string) => {
    if (!location) return []
    const lowercaseLocation = location.toLowerCase()
    return drivers.value.filter(driver => 
      driver.location.toLowerCase().includes(lowercaseLocation)
    )
  }

  // Actions
  const fetchDrivers = async () => {
    // Simulate API call
    isLoading.value = true
    error.value = null
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      // In a real app, this would be an API call
      // drivers.value = await api.getDrivers()
    } catch (e) {
      error.value = 'Failed to fetch drivers'
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  const addDriver = async (driverData: Omit<Driver, 'id'>) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Validate data
      const { name, location } = driverData
      
      // Create new driver
      const newDriver: Driver = {
        id: `driver-${nanoid(6)}`,
        name,
        location
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Add to state (in real app, this would be after API confirms creation)
      drivers.value.unshift(newDriver)
      
      return newDriver
    } catch (e) {
      error.value = 'Failed to add driver'
      console.error(e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const updateDriver = async (id: string, driverData: Partial<Omit<Driver, 'id'>>) => {
    isLoading.value = true
    error.value = null
    
    try {
      const driverIndex = drivers.value.findIndex(d => d.id === id)
      if (driverIndex === -1) {
        throw new Error('Driver not found')
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update driver in state
      const updatedDriver = {
        ...drivers.value[driverIndex],
        ...driverData
      }
      
      drivers.value[driverIndex] = updatedDriver
      return updatedDriver
    } catch (e) {
      error.value = 'Failed to update driver'
      console.error(e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const deleteDriver = async (id: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Remove from state
      drivers.value = drivers.value.filter(d => d.id !== id)
      return true
    } catch (e) {
      error.value = 'Failed to delete driver'
      console.error(e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    drivers,
    isLoading,
    error,
    getDriverById,
    getDriversByLocation,
    fetchDrivers,
    addDriver,
    updateDriver,
    deleteDriver
  }
}) 
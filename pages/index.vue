<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
</script>

<template>
  <div class="w-full flex flex-col gap-8 p-8">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-2xl font-bold tracking-tight">
        Logistics Management System
      </h2>
    </div>
    
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
 
      
      <!-- Drivers Card -->
      <Card>
        <CardHeader>
          <CardTitle>Driver Management</CardTitle>
          <CardDescription>
            Manage your drivers and their locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            Add, update, and view all drivers in your system. Monitor their assigned locations.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <NuxtLink to="/drivers">Manage Drivers</NuxtLink>
          </Button>
        </CardFooter>
      </Card>
      
      <!-- Tours Card -->
      <Card>
        <CardHeader>
          <CardTitle>Tour Management</CardTitle>
          <CardDescription>
            Manage your shipment tours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            Create and manage tours with automatic driver assignment based on location.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <NuxtLink to="/tours">Manage Tours</NuxtLink>
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

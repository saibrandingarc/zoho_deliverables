<template>
    <div>
      <HotTable
        :data="tableData"
        :colHeaders="colHeaders"
        :columns="columnsConfig"
        :settings="hotSettings"
        :licenseKey="'non-commercial-and-evaluation'"
        :key="tableKey"
        ref="hotTableRef"
      />
      <button @click="submitData">Submit Data</button>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { HotTable } from '@handsontable/vue3';
  import Handsontable from 'handsontable';
  import axios from 'axios';
  
  // Initial JSON object
  const initialData = reactive({
    Owner: {
      name: 'Sai Krishna',
      id: '3293516000107633001',
      email: 'sai@brandingarc.com'
    },
    Status_Website_Refresh: null,
    Staff_SEO: 'Govind Bharti',
    Quarter: '3',
    Company: {
      name: 'Pork Chop Express',
      id: '3293516000108143104'
    },
    id: "3293516000075231054"
  });
  
  // Convert JSON object to Handsontable format
  const tableData = ref<any[]>([
    Object.keys(initialData).map((key) => initialData[key])
  ]);
  
  const colHeaders = ref(Object.keys(initialData));
  
  const columnsConfig = ref(
    Object.keys(initialData).map((key) => ({
      data: key,
      type: 'text', // Change type according to your needs
      width: 150
    }))
  );
  
  // Handsontable settings
  const hotSettings = ref({
    contextMenu: true,
    manualColumnResize: true,
    stretchH: 'all',
    afterChange(changes: any, source: string) {
      if (source === 'edit') {
        // Handle changes here if needed
        console.log('Table Edited:', changes);
      }
    }
  });
  
  const tableKey = ref(0);
  
  const hotTableRef = ref<any>(null);
  
  // Function to submit data
  const submitData = () => {
    if (hotTableRef.value) {
      const hotInstance = hotTableRef.value.hotInstance;
      if (hotInstance) {
        const data = hotInstance.getData(); // Get the edited data
  
        // Map the Handsontable data back to JSON format
        const updatedData = data.reduce((acc: any, row: any[]) => {
          colHeaders.value.forEach((key, index) => {
            acc[key] = row[index];
          });
          return acc;
        }, {});
  
        console.log('Updated Data:', updatedData);
  
        // Submit the updatedData to your API
        axios
          .post('/your-api-endpoint', updatedData)
          .then((response) => {
            console.log('Data submitted successfully:', response.data);
          })
          .catch((error) => {
            console.error('Error submitting data:', error);
          });
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  
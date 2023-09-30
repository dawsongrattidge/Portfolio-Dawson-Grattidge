async function fetchDevices() {
    try {
      const response = await fetch('/api/fetch_devices.php');
      if (response.ok) {
        const devices = await response.json();
        console.log('Devices:', devices);
        // Do something with the devices data
      } else {
        console.error('Failed to fetch devices:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  }
  
  // Call the function to fetch devices data
  fetchDevices();
  

  async function fetchDeviceData() {
    try {
      const response = await fetch('/api/fetch_device_data.php');
      if (response.ok) {
        const deviceData = await response.json();
        console.log('Device Data:', deviceData);
        // Do something with the device data
      } else {
        console.error('Failed to fetch device data:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching device data:', error);
    }
  }
  
  // Call the function to fetch device data
  fetchDeviceData();
  
// Quick test to update a showcase image link
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testUpdate() {
  try {
    // First, get all images
    const getResponse = await fetch('http://192.168.0.107:5000/api/showcase');
    const getData = await getResponse.json();
    
    if (getData.data && getData.data.length > 0) {
      const firstImage = getData.data[0];
      console.log('First image:', firstImage.title, 'Current link:', firstImage.link);
      
      // Update the first image with a new link
      const formData = new FormData();
      formData.append('title', firstImage.title);
      formData.append('link', 'https://google.com');
      
      const updateResponse = await fetch(`http://192.168.0.107:5000/api/showcase/${firstImage._id}`, {
        method: 'PUT',
        body: formData
      });
      
      const updateData = await updateResponse.json();
      console.log('Update response:', updateData);
      
      if (updateData.success) {
        console.log('✅ Link updated successfully to:', updateData.data.link);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testUpdate();

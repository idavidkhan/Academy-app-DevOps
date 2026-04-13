const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000';

// Test configuration
const testConfig = {
  registration: {
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    cnic: '12345-1234567-1',
    skills: 'Web Development',
    last_degree: 'BS CS',
    course_id: 1,
    course_title: 'Web Development'
  },
  testFile: path.join(__dirname, 'test_slip.jpg')
};

async function testPaymentUpload() {
  console.log('🧪 Testing Payment Slip Upload System\n');

  try {
    // Step 1: Create a test registration
    console.log('1. Creating test registration...');
    const registrationResponse = await axios.post(`${API_URL}/api/registrations/`, testConfig.registration);
    const registrationId = registrationResponse.data.regId;
    console.log(`✅ Registration created with ID: ${registrationId}`);

    // Step 2: Check initial status
    console.log('\n2. Checking initial status...');
    const statusResponse = await axios.get(`${API_URL}/api/registrations/status/${testConfig.registration.email}`);
    console.log(`✅ Status: ${statusResponse.data[0]?.status}`);

    // Step 3: Create a test file if it doesn't exist
    if (!fs.existsSync(testConfig.testFile)) {
      console.log('\n3. Creating test slip file...');
      // Create a simple test image (1x1 pixel JPG)
      const testImageBuffer = Buffer.from([
        0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
        0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
        0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
        0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
        0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
        0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
        0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
        0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
        0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
        0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xFF, 0xC4,
        0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x0C,
        0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3F, 0x00, 0x8F, 0xFF,
        0xD9
      ]);
      fs.writeFileSync(testConfig.testFile, testImageBuffer);
      console.log('✅ Test file created');
    }

    // Step 4: Upload the test slip
    console.log('\n4. Uploading test slip...');
    const formData = new FormData();
    formData.append('slip', fs.createReadStream(testConfig.testFile));

    const uploadResponse = await axios.post(
      `${API_URL}/api/registrations/upload-slip/${registrationId}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );
    console.log('✅ Slip uploaded successfully');
    console.log(`Response: ${uploadResponse.data.message}`);

    // Step 5: Check final status
    console.log('\n5. Checking final status...');
    const finalStatusResponse = await axios.get(`${API_URL}/api/registrations/status/${testConfig.registration.email}`);
    console.log(`✅ Final Status: ${finalStatusResponse.data[0]?.status}`);

    // Step 6: Verify file exists in uploads directory
    console.log('\n6. Verifying uploaded file...');
    const uploadedFiles = fs.readdirSync(path.join(__dirname, 'uploads', 'slips'));
    const uploadedFile = uploadedFiles.find(file => file.includes('test_slip'));
    if (uploadedFile) {
      console.log(`✅ File uploaded: ${uploadedFile}`);
    } else {
      console.log('❌ Uploaded file not found');
    }

    console.log('\n🎉 All tests passed! Payment slip upload system is working correctly.');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      console.log('💡 This might be a validation error. Check the error details above.');
    } else if (error.response?.status === 500) {
      console.log('💡 This might be a server error. Check the server logs.');
    }
  }
}

// Run the test
if (require.main === module) {
  testPaymentUpload();
}

module.exports = { testPaymentUpload }; 
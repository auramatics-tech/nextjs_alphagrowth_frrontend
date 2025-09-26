// Test script to verify LinkedIn API integration
// Run this in browser console on localhost:3000/identities

async function testLinkedInAPI() {
    console.log('Testing LinkedIn API integration...');
    
    // Test 1: Check if API client is working
    try {
        const response = await fetch('/api/test', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log('API client test:', response.status);
    } catch (error) {
        console.log('API client error (expected):', error.message);
    }
    
    // Test 2: Check localStorage token
    const token = localStorage.getItem('_token');
    console.log('Auth token present:', !!token);
    
    // Test 3: Check if identityService is available
    if (window.identityService) {
        console.log('identityService available');
    } else {
        console.log('identityService not available - need to import');
    }
    
    console.log('Test completed. Check console for any errors.');
}

// Function to manually test LinkedIn connection
async function testLinkedInConnection(identityId) {
    console.log('Testing LinkedIn connection for identity:', identityId);
    
    const testCredentials = {
        identity_id: identityId,
        data: {
            email: 'test@example.com',
            password: 'testpassword',
            location: 'Test Location'
        },
        type: 'LINKEDIN'
    };
    
    try {
        const response = await fetch('http://localhost:7001/pub/v1/linkedin-connections/save-credentials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('_token')}`
            },
            body: JSON.stringify(testCredentials)
        });
        
        const data = await response.json();
        console.log('LinkedIn connection response:', data);
        
        if (data.data?.id) {
            console.log('Connection ID received:', data.data.id);
            return data.data.id;
        }
    } catch (error) {
        console.error('LinkedIn connection error:', error);
    }
}

// Function to test status polling
async function testStatusPolling(connectionId) {
    console.log('Testing status polling for ID:', connectionId);
    
    try {
        const response = await fetch(`http://localhost:7001/pub/v1/linkedin-connections/check-connection-status/${connectionId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('_token')}`
            }
        });
        
        const data = await response.json();
        console.log('Status polling response:', data);
        return data;
    } catch (error) {
        console.error('Status polling error:', error);
    }
}

// Export functions for manual testing
window.testLinkedInAPI = testLinkedInAPI;
window.testLinkedInConnection = testLinkedInConnection;
window.testStatusPolling = testStatusPolling;

console.log('LinkedIn API test functions loaded. Use:');
console.log('- testLinkedInAPI() - Basic API test');
console.log('- testLinkedInConnection("identity-id") - Test connection');
console.log('- testStatusPolling("connection-id") - Test polling');



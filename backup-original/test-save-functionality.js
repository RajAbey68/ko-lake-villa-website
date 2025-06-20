/**
 * Test Save Functionality - Debug gallery image updates
 */

async function testSaveFunctionality() {
  console.log("=== Testing Gallery Save Functionality ===");

  try {
    // First, get a list of gallery images to find one to test with
    const galleryResponse = await fetch('/api/gallery');
    const galleryData = await galleryResponse.json();
    
    if (!galleryData.success || !galleryData.data || galleryData.data.length === 0) {
      console.error("No gallery images found to test with");
      return;
    }

    // Find a video with lake in the filename or description
    const testImage = galleryData.data.find(img => 
      img.mediaType === 'video' && 
      (img.imageUrl.toLowerCase().includes('lake') || 
       img.description?.toLowerCase().includes('lake'))
    ) || galleryData.data[0]; // Fallback to first item

    console.log("Testing with image:", testImage);

    // Test the admin PATCH endpoint
    const updateData = {
      category: "koggala-lake",
      description: "Updated: Beautiful lake views from Ko Lake Villa - test save",
      tags: "koggala lake, water views, villa"
    };

    console.log("Sending update with data:", updateData);

    const updateResponse = await fetch(`/api/admin/gallery/${testImage.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    const updateResult = await updateResponse.json();
    console.log("Update response:", updateResult);

    if (updateResponse.ok) {
      console.log("✅ Save functionality working!");
      
      // Verify the change persisted
      const verifyResponse = await fetch(`/api/gallery/${testImage.id}`);
      const verifyResult = await verifyResponse.json();
      console.log("Verification - updated image:", verifyResult);
      
    } else {
      console.error("❌ Save failed:", updateResult);
    }

  } catch (error) {
    console.error("Test error:", error);
  }
}

// Run the test
testSaveFunctionality();
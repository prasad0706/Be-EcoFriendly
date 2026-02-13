// GET /api/delivery/check?pincode=400001
exports.checkDelivery = async (req, res) => {
  try {
    const { pincode } = req.query;

    if (!pincode || !/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 6-digit pincode'
      });
    }

    // This is a mock logic as requested. 
    // In a real app, you'd check against a database of serviceable pincodes.
    const estimatedDays = Math.floor(Math.random() * 5) + 2; // 2 to 7 days
    const isSpecialPincode = pincode.startsWith('11') || pincode.startsWith('40') || pincode.startsWith('56');

    res.status(200).json({
      success: true,
      data: {
        pincode,
        estimatedDays,
        estimatedDate: new Date(Date.now() + estimatedDays * 24 * 60 * 60 * 1000),
        freeDelivery: true, // Mocking free delivery for now
        codAvailable: isSpecialPincode ? true : (parseInt(pincode) % 2 === 0), // Mock COD availability
        serviceable: true
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

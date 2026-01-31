import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../common/Button';
import * as XLSX from 'xlsx';

const BulkUploadModal = ({ isOpen, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      toast.error('Please select an Excel or CSV file');
      return;
    }

    setSelectedFile(file);
    setErrors([]);
    parseExcelFile(file);
  };

  const parseExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          toast.error('Excel file is empty');
          return;
        }

        // Validate required columns
        const requiredColumns = ['name', 'description', 'price', 'category', 'stock'];
        const validationErrors = [];

        jsonData.forEach((row, index) => {
          const rowNum = index + 2; // +2 because of header row and 1-based indexing
          const rowErrors = [];

          // Check required fields
          requiredColumns.forEach(col => {
            if (!row[col] || row[col].toString().trim() === '') {
              rowErrors.push(`${col} is required`);
            }
          });

          // Validate price and stock are numbers
          if (row.price && isNaN(parseFloat(row.price))) {
            rowErrors.push('Price must be a valid number');
          }
          if (row.stock && isNaN(parseInt(row.stock))) {
            rowErrors.push('Stock must be a valid number');
          }

          // Validate category
          const validCategories = ['Reusable Products', 'Organic Foods', 'Eco-Friendly Home', 'Sustainable Fashion', 'Zero Waste', 'Natural Beauty', 'Green Tech', 'Other'];
          if (row.category && !validCategories.includes(row.category)) {
            rowErrors.push(`Invalid category. Allowed: ${validCategories.join(', ')}`);
          }

          if (rowErrors.length > 0) {
            validationErrors.push({ row: rowNum, errors: rowErrors });
          }
        });

        if (validationErrors.length > 0) {
          setErrors(validationErrors);
          toast.error(`Found ${validationErrors.length} rows with errors`);
          return;
        }

        // Format data for preview
        const formattedData = jsonData.map(row => ({
          name: row.name?.toString().trim() || '',
          description: row.description?.toString().trim() || '',
          price: parseFloat(row.price),
          originalPrice: row.originalPrice ? parseFloat(row.originalPrice) : 0,
          category: row.category?.toString().trim() || '',
          stock: parseInt(row.stock),
          featured: row.featured?.toString().toLowerCase() === 'true' || false,
          tags: row.tags ? row.tags.toString().split(',').map(t => t.trim()).filter(Boolean) : [],
          images: [] // Images won't be uploaded in bulk - only product data
        }));

        setPreviewData(formattedData);
        setErrors([]);
        toast.success(`Loaded ${formattedData.length} products for preview`);
      } catch (error) {
        console.error('Error parsing file:', error);
        toast.error('Error parsing Excel file. Please check the format.');
        setSelectedFile(null);
        setPreviewData(null);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleUpload = async () => {
    if (!previewData || previewData.length === 0) {
      toast.error('No products to upload');
      return;
    }

    setIsLoading(true);
    try {
      await onUpload(previewData);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload products');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewData(null);
    setErrors([]);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Bulk Upload Products</h2>
              <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* File Upload Section */}
              {!previewData && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 1: Select Excel File</h3>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Required Columns:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>name</strong> - Product name</li>
                      <li>• <strong>description</strong> - Product description</li>
                      <li>• <strong>price</strong> - Price in rupees (number)</li>
                      <li>• <strong>category</strong> - Reusable Products, Organic Foods, Eco-Friendly Home, Sustainable Fashion, Zero Waste, Natural Beauty, Green Tech, Other</li>
                      <li>• <strong>stock</strong> - Stock quantity (number)</li>
                    </ul>
                    <h4 className="text-sm font-medium text-gray-700 mt-4 mb-2">Optional Columns:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>originalPrice</strong> - Original price in rupees</li>
                      <li>• <strong>featured</strong> - true or false</li>
                      <li>• <strong>tags</strong> - Comma separated tags</li>
                    </ul>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="bulk-upload-file"
                    />
                    <label
                      htmlFor="bulk-upload-file"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <Upload className="h-12 w-12 text-gray-500 mb-2" />
                      <span className="text-lg font-medium text-gray-700">Click to upload Excel file</span>
                      <span className="text-sm text-gray-500 mt-1">Supported formats: .xlsx, .xls, .csv</span>
                    </label>
                  </div>

                  {selectedFile && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">{selectedFile.name}</p>
                        <p className="text-xs text-green-600">File selected successfully</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewData(null);
                        }}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Preview Section */}
              {previewData && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 2: Preview Products</h3>
                  
                  {errors.length > 0 && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-red-800 mb-2">Validation Errors Found:</h4>
                          <ul className="text-sm text-red-700 space-y-1">
                            {errors.map((error, idx) => (
                              <li key={idx}>Row {error.row}: {error.errors.join(', ')}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 border-b">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold text-gray-800">#</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-800">Name</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-800">Category</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-800">Price</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-800">Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((product, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                            <td className="px-4 py-3 text-gray-900 font-medium max-w-xs truncate">{product.name}</td>
                            <td className="px-4 py-3 text-gray-600">{product.category}</td>
                            <td className="px-4 py-3 text-gray-900">₹{product.price.toFixed(2)}</td>
                            <td className="px-4 py-3 text-gray-600">{product.stock}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">
                      Ready to upload <strong>{previewData.length}</strong> products
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Actions */}
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              
              {previewData ? (
                <Button
                  onClick={handleUpload}
                  disabled={isLoading || previewData.length === 0}
                  className={isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  {isLoading ? 'Uploading...' : `Upload Products (${previewData.length})`}
                </Button>
              ) : (
                <Button
                  disabled={!selectedFile}
                  onClick={() => {}}
                  className={!selectedFile ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  {selectedFile ? 'File Selected' : 'Select File First'}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BulkUploadModal;

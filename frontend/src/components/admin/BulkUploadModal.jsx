import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, AlertCircle, FileSpreadsheet } from 'lucide-react';
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

        const requiredColumns = ['name', 'description', 'price', 'category', 'stock'];
        const validationErrors = [];

        jsonData.forEach((row, index) => {
          const rowNum = index + 2;
          const rowErrors = [];

          requiredColumns.forEach(col => {
            if (!row[col] || row[col].toString().trim() === '') {
              rowErrors.push(`${col} is required`);
            }
          });

          if (row.price && isNaN(parseFloat(row.price))) {
            rowErrors.push('Price must be a valid number');
          }
          if (row.stock && isNaN(parseInt(row.stock))) {
            rowErrors.push('Stock must be a valid number');
          }

          const validCategories = ['Reusable Products', 'Organic Foods', 'Eco-Friendly Home', 'Sustainable Fashion', 'Zero Waste', 'Natural Beauty', 'Green Tech', 'Other'];
          if (row.category && !validCategories.includes(row.category)) {
            rowErrors.push(`Invalid category.`);
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

        const formattedData = jsonData.map(row => ({
          name: row.name?.toString().trim() || '',
          description: row.description?.toString().trim() || '',
          price: parseFloat(row.price),
          originalPrice: row.originalPrice ? parseFloat(row.originalPrice) : 0,
          category: row.category?.toString().trim() || '',
          stock: parseInt(row.stock),
          featured: row.featured?.toString().toLowerCase() === 'true' || false,
          tags: row.tags ? row.tags.toString().split(',').map(t => t.trim()).filter(Boolean) : [],
          images: []
        }));

        setPreviewData(formattedData);
        setErrors([]);
        toast.success(`Loaded ${formattedData.length} products`);
      } catch (error) {
        toast.error('Error parsing file');
        setSelectedFile(null);
        setPreviewData(null);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleUpload = async () => {
    if (!previewData || previewData.length === 0) return;
    setIsLoading(true);
    try {
      await onUpload(previewData);
      resetForm();
      onClose();
    } catch (error) {
      toast.error('Product import failed');
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
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Import Products</h2>
              <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {!previewData ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Instructions</h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Required Columns</p>
                          <div className="flex flex-wrap gap-2">
                            {['name', 'description', 'price', 'category', 'stock'].map(c => (
                              <span key={c} className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600">{c}</span>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Optional Columns</p>
                          <div className="flex flex-wrap gap-2">
                            {['originalPrice', 'featured', 'tags'].map(c => (
                              <span key={c} className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600">{c}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative border-2 border-dashed border-gray-200 rounded-[2.5rem] p-10 hover:border-primary/50 transition-colors text-center flex flex-col items-center justify-center">
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileSelect}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="p-4 bg-primary/10 rounded-2xl text-primary mb-4">
                        <Upload className="h-8 w-8" />
                      </div>
                      <h4 className="font-bold text-gray-900">Choose Excel File</h4>
                      <p className="text-xs text-gray-400 mt-2 font-medium">Drop your file here or click to browse</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Preview Data</h3>
                    <button onClick={resetForm} className="text-xs font-bold text-primary hover:underline">Change File</button>
                  </div>

                  {errors.length > 0 && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start space-x-3 text-red-600">
                      <AlertCircle className="h-5 w-5 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold">Validation errors found in {errors.length} rows</p>
                        <p className="text-xs opacity-80 mt-1">Please correct your file and try again.</p>
                      </div>
                    </div>
                  )}

                  <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="px-4 py-3 font-bold text-gray-400 uppercase">Product</th>
                          <th className="px-4 py-3 font-bold text-gray-400 uppercase">Category</th>
                          <th className="px-4 py-3 font-bold text-gray-400 uppercase">Price</th>
                          <th className="px-4 py-3 font-bold text-gray-400 uppercase">Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {previewData.slice(0, 10).map((p, i) => (
                          <tr key={i}>
                            <td className="px-4 py-3 font-bold text-gray-900 truncate max-w-[200px]">{p.name}</td>
                            <td className="px-4 py-3 text-gray-500">{p.category}</td>
                            <td className="px-4 py-3 font-bold">{p.price.toFixed(2)}</td>
                            <td className="px-4 py-3 font-bold">{p.stock}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {previewData.length > 10 && (
                      <div className="px-4 py-2 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase text-center border-t border-gray-100">
                        Showing first 10 rows of {previewData.length} total
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="px-8 py-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button onClick={handleCancel} className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-900">Cancel</button>
              {previewData && (
                <Button onClick={handleUpload} loading={isLoading} disabled={errors.length > 0}>
                  Import {previewData.length} Products
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

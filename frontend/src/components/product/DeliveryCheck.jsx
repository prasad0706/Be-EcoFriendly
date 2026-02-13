import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Truck, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import Button from '../common/Button';

const DeliveryCheck = () => {
  const [pincode, setPincode] = useState('');
  const [checkTriggered, setCheckTriggered] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['deliveryCheck', pincode],
    queryFn: async () => {
      const response = await api.get(`/delivery/check?pincode=${pincode}`);
      return response.data.data;
    },
    enabled: false, // Don't run automatically
  });

  const handleCheck = (e) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setCheckTriggered(true);
      refetch();
    }
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        Check Delivery
      </h3>
      
      <form onSubmit={handleCheck} className="flex gap-2 mb-4">
        <input
          type="text"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter Pincode"
          className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium text-sm"
        />
        <Button 
          type="submit" 
          disabled={pincode.length !== 6 || isLoading}
          className="px-6 py-3 rounded-xl text-sm"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Check'}
        </Button>
      </form>

      {checkTriggered && !isLoading && data && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <div className="mt-1 bg-green-100 p-1 rounded-full">
              <CheckCircle2 className="h-3 w-3 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                Delivery by {new Date(data.estimatedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </p>
              <p className="text-xs text-gray-500 font-medium">
                Standard Shipping: {data.estimatedDays} Days
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-200">
            {data.freeDelivery && (
              <div className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-accent" />
                <span className="text-[10px] font-black text-accent uppercase tracking-tighter">Free Delivery</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              {data.codAvailable ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-red-400" />
              )}
              <span className={`text-[10px] font-black uppercase tracking-tighter ${data.codAvailable ? 'text-primary' : 'text-red-400'}`}>
                {data.codAvailable ? 'COD Available' : 'COD Not Available'}
              </span>
            </div>
          </div>
        </div>
      )}

      {isError && (
        <p className="text-xs font-bold text-red-500 mt-2">
          {error.response?.data?.message || 'Something went wrong. Try again.'}
        </p>
      )}
    </div>
  );
};

export default DeliveryCheck;

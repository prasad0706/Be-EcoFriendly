// Skeleton loaders for different content types
export const CardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="bg-gray-200 h-64 w-full" />
    <div className="p-4 space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-8 bg-gray-200 rounded w-full" />
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="border-b animate-pulse">
    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-8" /></td>
    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-32" /></td>
    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-24" /></td>
    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20" /></td>
    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16" /></td>
  </tr>
);

export const ProductDetailSkeleton = () => (
  <div className="min-h-screen bg-white animate-pulse">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image skeleton */}
        <div className="bg-gray-200 rounded-lg h-96 w-full" />
        
        {/* Details skeleton */}
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/5" />
          </div>
          <div className="h-12 bg-gray-200 rounded w-full" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Stats grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>
      ))}
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-64 bg-gray-200 rounded" />
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-64 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

export const FormSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6 space-y-4 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-1/4 mb-6" />
    {[...Array(5)].map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    ))}
    <div className="h-10 bg-gray-200 rounded w-1/4 pt-4" />
  </div>
);

export const GridSkeleton = ({ columns = 3 }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6 animate-pulse`}>
    {[...Array(6)].map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const ListSkeleton = () => (
  <div className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
    <table className="w-full">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-8" /></th>
          <th className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-24" /></th>
          <th className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20" /></th>
          <th className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16" /></th>
          <th className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20" /></th>
        </tr>
      </thead>
      <tbody>
        {[...Array(5)].map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </tbody>
    </table>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="max-w-4xl mx-auto animate-pulse">
    <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const CheckoutSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
    {/* Order Summary */}
    <div className="lg:col-span-2">
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Sidebar */}
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        ))}
        <div className="pt-4 h-10 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface ReturnOrder {
  id: string;
  shopify_order_number: string;
  customer_email: string;
  status: string;
  tracking_number: string;
  items: any[];
}

export default function Dashboard() {
  const { user } = useAuth();
  const [returns, setReturns] = useState<ReturnOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:8000/returns?shop_email=${user.email}`)
        .then(res => res.json())
        .then(data => {
          setReturns(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CREATED': return 'bg-gray-100 text-gray-800';
      case 'IN_TRANSIT': return 'bg-blue-100 text-blue-800';
      case 'DELIVERED': return 'bg-[#7bc144] text-white'; // Bring Grøn
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Henter data...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Aktive Retursager
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Her ser du alle retursager oprettet for {user?.name}.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ordre #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kunde</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Varer</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {returns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Ingen retursager fundet endnu.
                  </td>
                </tr>
              ) : (
                returns.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.shopify_order_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {order.tracking_number}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.items.length} stk.
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
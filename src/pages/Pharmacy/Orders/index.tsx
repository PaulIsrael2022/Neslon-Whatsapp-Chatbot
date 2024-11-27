import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import CustomerOrders from './CustomerOrders';
import StockOrders from './StockOrders';
import { Package, Truck } from 'lucide-react';

export default function PharmacyOrders() {
  const [activeTab, setActiveTab] = useState('customer');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage customer prescriptions and stock orders
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="customer" className="flex items-center">
            <Package className="h-4 w-4 mr-2" />
            Customer Orders
          </TabsTrigger>
          <TabsTrigger value="stock" className="flex items-center">
            <Truck className="h-4 w-4 mr-2" />
            Stock Orders
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          {activeTab === 'customer' ? <CustomerOrders /> : <StockOrders />}
        </div>
      </Tabs>
    </div>
  );
}
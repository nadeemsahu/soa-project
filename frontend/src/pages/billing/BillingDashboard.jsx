import React, { useState } from 'react';
import { useApex } from '../../context/ApexContext';

const BillingDashboard = () => {
  const { bills, payBill } = useApex();
  const [filter, setFilter] = useState('All');

  const filteredBills = bills.filter(b => {
    if (filter === 'Pending') return b.status === 'Pending';
    if (filter === 'Paid') return b.status === 'Paid';
    return true;
  });

  const totalRevenue = bills.reduce((acc, b) => acc + (b.amount || 0), 0);
  const pendingRevenue = bills.filter(b => b.status === 'Pending').reduce((acc, b) => acc + (b.amount || 0), 0);
  const collectedRevenue = bills.filter(b => b.status === 'Paid').reduce((acc, b) => acc + (b.amount || 0), 0);

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="bg-surface-container-low border-b border-outline-variant px-6 py-4 shrink-0 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-label-sm font-semibold bg-primary-container text-on-primary tracking-wider uppercase">
              Financial Operations
            </span>
            <span className="text-label-sm font-label-sm text-secondary">Revenue Cycle Management Node</span>
          </div>
          <h1 className="text-headline-sm font-headline-sm text-primary font-semibold">Hospital Billing & Claims Administration</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded bg-surface border border-outline-variant text-label-sm font-label-sm text-on-surface">
            <span className="w-2 h-2 rounded-full bg-[#1B433E] animate-pulse"></span>
            <span>Kafka Consumer: <strong className="font-semibold text-primary">appointment-completed</strong></span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="p-6 pb-2 grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        <div className="bg-surface border border-outline-variant rounded p-4 shadow-sm">
          <div className="text-label-sm font-label-sm uppercase tracking-wider text-secondary">Total Invoiced</div>
          <div className="text-headline-md font-headline-md font-bold text-primary mt-1">${totalRevenue.toFixed(2)}</div>
          <div className="text-label-sm font-label-sm text-outline mt-0.5">{bills.length} Total Claims</div>
        </div>

        <div className="bg-surface border border-outline-variant rounded p-4 shadow-sm">
          <div className="text-label-sm font-label-sm uppercase tracking-wider text-secondary">Pending Collections</div>
          <div className="text-headline-md font-headline-md font-bold text-error mt-1">${pendingRevenue.toFixed(2)}</div>
          <div className="text-label-sm font-label-sm text-error mt-0.5">{bills.filter(b => b.status === 'Pending').length} Pending Invoices</div>
        </div>

        <div className="bg-surface border border-outline-variant rounded p-4 shadow-sm">
          <div className="text-label-sm font-label-sm uppercase tracking-wider text-secondary">Settled & Collected</div>
          <div className="text-headline-md font-headline-md font-bold text-[#1E7B45] mt-1">${collectedRevenue.toFixed(2)}</div>
          <div className="text-label-sm font-label-sm text-[#1E7B45] mt-0.5">{bills.filter(b => b.status === 'Paid').length} Paid Invoices</div>
        </div>

        <div className="bg-surface border border-outline-variant rounded p-4 shadow-sm">
          <div className="text-label-sm font-label-sm uppercase tracking-wider text-secondary">Auto-Generation Engine</div>
          <div className="text-headline-sm font-headline-sm font-semibold text-primary mt-1">Choreographed</div>
          <div className="text-label-sm font-label-sm text-secondary mt-0.5">Automated via Kafka Event</div>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        <div className="bg-surface border border-outline-variant rounded shadow-sm flex-1 flex flex-col overflow-hidden">
          {/* Filter Bar */}
          <div className="px-6 py-3 border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mr-2">Filter Claims:</span>
              {['All', 'Pending', 'Paid'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilter(opt)}
                  className={`px-3 py-1 rounded text-label-sm font-label-sm font-medium transition-colors ${
                    filter === opt
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface border border-outline-variant text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {opt} ({opt === 'All' ? bills.length : bills.filter(b => b.status === opt).length})
                </button>
              ))}
            </div>
            <div className="text-label-sm font-label-sm text-secondary">
              Authoritative Billing Service
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-surface-container-low text-on-surface-variant text-label-sm font-label-sm uppercase tracking-wider border-b border-outline-variant z-10">
                <tr>
                  <th className="py-3 px-4 font-semibold">Claim / Invoice #</th>
                  <th className="py-3 px-4 font-semibold">Service Date</th>
                  <th className="py-3 px-4 font-semibold">Description</th>
                  <th className="py-3 px-4 font-semibold text-right">Claim Amount</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold text-center">Staff Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-body-sm font-body-sm">
                {filteredBills.map((bill) => {
                  const isPaid = bill.status === 'Paid';
                  return (
                    <tr key={bill.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3.5 px-4 font-tabular-data font-semibold text-primary">
                        #{bill.id}
                      </td>
                      <td className="py-3.5 px-4 text-on-surface-variant">
                        {new Date(bill.date).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-on-surface font-medium">
                        {bill.description}
                      </td>
                      <td className="py-3.5 px-4 text-right font-tabular-data font-bold text-on-surface">
                        ${Number(bill.amount).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-label-sm font-label-sm font-medium ${
                          isPaid
                            ? 'bg-[#EBF7EE] text-[#1E7B45] border border-[#C6EBD0]'
                            : 'bg-[#FFF4E5] text-[#9A5B13] border border-[#F5D5A5]'
                        }`}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {!isPaid ? (
                          <button
                            onClick={() => payBill(bill.id)}
                            className="px-3 py-1 bg-primary hover:bg-primary-container text-on-primary rounded text-label-sm font-label-sm font-medium transition-colors cursor-pointer shadow-none"
                          >
                            Approve & Settle
                          </button>
                        ) : (
                          <span className="text-label-sm font-label-sm text-secondary font-medium flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-[16px] text-[#1E7B45]">check_circle</span>
                            Settled
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingDashboard;

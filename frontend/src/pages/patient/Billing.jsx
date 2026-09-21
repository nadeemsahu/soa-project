import React, { useState } from 'react';
import { useApex } from '../../context/ApexContext';

const Billing = () => {
  const { user, bills, payBill } = useApex();
  const [selectedBillId, setSelectedBillId] = useState(bills[0]?.id);

  const selectedBill = bills.find(b => b.id === selectedBillId);

  const handlePay = () => {
    if (selectedBillId) {
      payBill(selectedBillId);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Operational Metric Banner */}
      <div className="bg-surface-container-low border-b border-outline-variant px-6 py-3 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-headline-sm font-headline-sm text-primary font-semibold">My Bills & Statements</h1>
            <p className="text-label-sm font-label-sm text-secondary">Review your outstanding balances and payment history</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-surface-container-lowest border border-outline-variant rounded px-3 py-1.5">
              <div className="text-label-sm font-label-sm text-on-surface-variant">Outstanding Balance</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-body-lg font-tabular-data font-bold text-primary">
                  ${bills.filter(b => b.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
                </span>
                <span className="text-label-sm font-label-sm text-error">
                  {bills.filter(b => b.status === 'Pending').length} Pending
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Master Claims Table Area */}
        <div className="flex-1 overflow-auto flex flex-col">
          <div className="bg-surface px-6 py-2.5 border-b border-outline-variant flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-label-sm font-label-sm text-on-surface-variant mr-1 uppercase tracking-wider">Filter Status:</span>
              <button className="px-2.5 py-1 rounded text-label-sm font-label-sm bg-primary text-on-primary font-medium">All ({bills.length})</button>
              <button className="px-2.5 py-1 rounded text-label-sm font-label-sm bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors">Pending ({bills.filter(b => b.status === 'Pending').length})</button>
              <button className="px-2.5 py-1 rounded text-label-sm font-label-sm bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors">Paid ({bills.filter(b => b.status === 'Paid').length})</button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-surface-container-low text-on-surface-variant text-label-sm font-label-sm uppercase tracking-wider border-b border-outline-variant z-10">
                <tr>
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">Invoice ID</th>
                  <th className="py-3 px-4 font-semibold">Service Date</th>
                  <th className="py-3 px-4 font-semibold">Description</th>
                  <th className="py-3 px-4 font-semibold text-right whitespace-nowrap">Total Amount</th>
                  <th className="py-3 px-4 font-semibold text-center whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-body-sm font-body-sm">
                {bills.map((bill) => {
                  const isSelected = bill.id === selectedBillId;
                  const isPending = bill.status === 'Pending';
                  return (
                    <tr 
                      key={bill.id} 
                      onClick={() => setSelectedBillId(bill.id)}
                      className={`cursor-pointer transition-colors ${isSelected ? 'bg-surface-container-lowest border-l-2 border-primary hover:bg-surface-container-high' : 'bg-surface hover:bg-surface-container-lowest border-l-2 border-transparent'}`}
                    >
                      <td className="py-3 px-4 font-tabular-data font-semibold text-primary whitespace-nowrap">
                        {bill.id.toUpperCase()}
                      </td>
                      <td className="py-3 px-4 font-tabular-data text-on-surface-variant whitespace-nowrap">
                        {new Date(bill.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-on-surface leading-tight">{bill.description}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-tabular-data font-bold text-primary whitespace-nowrap">
                        ${bill.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className={`inline-block text-label-sm font-label-sm px-2.5 py-0.5 rounded font-medium ${isPending ? 'bg-[#FDF2F1] text-[#A63228] border border-[#f3c8c4]' : 'bg-primary-fixed text-on-primary-fixed border border-primary-fixed-dim'}`}>
                          {bill.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Inspection Panel */}
        {selectedBill && (
          <aside className="w-[430px] h-full bg-surface-container-low border-l border-outline-variant flex flex-col justify-between shrink-0 select-none">
            <div className="p-space-md border-b border-outline-variant bg-surface shrink-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-label-sm font-label-sm uppercase tracking-wider text-secondary font-semibold">Diagnostic Invoice Review</span>
                <span className="bg-surface-container px-2 py-0.5 rounded text-[11px] font-tabular-data text-on-surface-variant border border-outline-variant">CMS-1500 Compliant</span>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-headline-sm font-headline-sm font-bold text-primary">{user.name}</h2>
                  <p className="text-label-sm font-label-sm text-on-surface-variant font-tabular-data">MRN: {user.id}</p>
                </div>
                {selectedBill.status === 'Pending' && (
                  <span className="inline-block bg-[#FDF2F1] text-[#A63228] border border-[#f3c8c4] text-label-sm font-label-sm px-2 py-0.5 rounded font-semibold">
                    Action Required
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="bg-surface-container-lowest border border-outline-variant rounded p-4 shadow-none">
                <div className="border-b border-outline-variant pb-3 mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-headline-sm font-headline-sm font-extrabold text-primary tracking-tight">ApexCare Health</p>
                      <p className="text-label-sm font-label-sm text-secondary">Metro General Hospital Division</p>
                    </div>
                    <div className="text-right">
                      <div className="text-label-sm font-label-sm text-on-surface-variant">STATEMENT OF SERVICES</div>
                      <div className="text-label-sm font-tabular-data font-semibold text-primary">{selectedBill.id.toUpperCase()}</div>
                      <div className="text-[11px] font-tabular-data text-outline">Date: {new Date(selectedBill.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant mb-1 font-semibold">Itemized Charge Schedule</div>
                  <table className="w-full text-left border-collapse text-label-sm">
                    <thead className="border-b border-outline-variant text-[10px] uppercase text-outline">
                      <tr>
                        <th className="py-1">Description</th>
                        <th className="py-1 text-right">Fee</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant text-body-sm">
                      <tr>
                        <td className="py-2">{selectedBill.description}</td>
                        <td className="py-2 text-right font-tabular-data">${selectedBill.amount.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-outline-variant pt-2.5 space-y-1.5 text-label-sm font-label-sm">
                  <div className="border-t border-outline-variant pt-1.5 flex justify-between items-baseline">
                    <span className="text-body-sm font-body-sm font-bold text-primary">Patient Responsibility:</span>
                    <span className="text-headline-sm font-tabular-data font-bold text-primary">${selectedBill.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-space-md border-t border-outline-variant bg-surface space-y-2 shrink-0">
              <div className="space-y-2.5">
                {selectedBill.status === 'Pending' ? (
                  <button onClick={handlePay} className="w-full bg-primary hover:bg-[#23534D] text-on-primary font-label-md text-label-md h-10 px-4 rounded flex items-center justify-center gap-2 transition-colors duration-150 shadow-none border border-transparent font-medium cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">credit_card</span>
                    <span>Pay ${selectedBill.amount.toFixed(2)}</span>
                  </button>
                ) : (
                  <div className="w-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md h-10 px-4 rounded flex items-center justify-center gap-2 font-medium">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>Paid in Full</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2.5">
                  <button className="w-full bg-surface-container-lowest hover:bg-surface-container text-primary border border-outline-variant font-label-md text-label-md h-9 px-3 rounded flex items-center justify-center gap-1.5 transition-colors duration-150 font-medium cursor-pointer">
                    <span className="material-symbols-outlined text-[16px]">mail</span>
                    <span>Email Receipt</span>
                  </button>
                  <button className="w-full bg-surface-container-lowest hover:bg-surface-container text-primary border border-outline-variant font-label-md text-label-md h-9 px-3 rounded flex items-center justify-center gap-1.5 transition-colors duration-150 font-medium cursor-pointer">
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default Billing;

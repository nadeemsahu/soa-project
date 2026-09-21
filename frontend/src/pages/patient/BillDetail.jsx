import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApex } from '../../context/ApexContext';

const BillDetail = () => {
  const { billId } = useParams();
  const navigate = useNavigate();
  const { bills, payBill, user } = useApex();
  
  const bill = bills.find(b => b.id === billId);

  if (!bill) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-headline-md text-error">Invoice not found</h2>
        <button onClick={() => navigate('/bills')} className="mt-4 text-primary underline">Return to billing</button>
      </div>
    );
  }

  const isPaid = bill.status === 'Paid';

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="bg-surface-container-low border-b border-outline-variant px-6 py-3 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/bills')}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-high text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <h1 className="text-headline-sm font-headline-sm text-primary font-semibold">Invoice #{bill.id}</h1>
            <p className="text-label-sm font-label-sm text-secondary">Date: {new Date(bill.date).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded text-label-sm font-label-sm font-medium text-on-surface hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[16px]">print</span>
            Print
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded text-label-sm font-label-sm font-medium text-on-surface hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[16px]">download</span>
            PDF
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex justify-center">
        <div className="w-full max-w-3xl">
          <div className="bg-surface border border-outline-variant shadow-sm mb-6">
            
            {/* Invoice Header */}
            <div className="p-8 border-b border-outline-variant bg-surface-container-lowest flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded bg-primary-container flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined text-[24px]">monitor_heart</span>
                </div>
                <div>
                  <div className="text-headline-sm font-headline-sm font-semibold tracking-tight text-primary">ApexCare</div>
                  <div className="text-label-sm font-label-sm text-secondary">Metro General Hospital</div>
                </div>
              </div>
              
              <div className="text-right text-body-sm text-on-surface-variant leading-relaxed">
                <p>123 Medical Center Blvd</p>
                <p>Suite 400</p>
                <p>Metropolis, NY 10001</p>
                <p className="mt-1 text-primary font-medium">billing@apexcare.org</p>
              </div>
            </div>

            {/* Patient & Bill Info */}
            <div className="p-8 border-b border-outline-variant flex justify-between bg-surface">
              <div>
                <div className="text-[10px] font-label-sm uppercase tracking-wider text-outline mb-1">Billed To</div>
                <div className="text-body-md font-body-md font-semibold text-primary">{user.name}</div>
                <div className="text-body-sm font-body-sm text-on-surface-variant">Patient ID: {user.id}</div>
                <div className="text-body-sm font-body-sm text-on-surface-variant">{user.email}</div>
              </div>
              
              <div className="text-right flex flex-col items-end">
                <div className="text-[10px] font-label-sm uppercase tracking-wider text-outline mb-1">Amount Due</div>
                <div className="text-headline-lg font-headline-lg text-primary font-bold leading-none mb-2">
                  ${bill.amount.toFixed(2)}
                </div>
                {isPaid ? (
                  <span className="inline-flex items-center gap-1 bg-[#F4FBF7] text-[#1E7B45] border border-[#d1eeda] text-label-sm font-label-sm px-2.5 py-0.5 rounded font-bold">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span> Paid
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-[#FFF4E5] text-[#9A5B13] border border-[#F5D5A5] text-label-sm font-label-sm px-2.5 py-0.5 rounded font-bold">
                    <span className="material-symbols-outlined text-[14px]">error</span> Pending
                  </span>
                )}
              </div>
            </div>

            {/* Line Items */}
            <div className="p-0">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    <th className="p-4 text-label-sm font-label-sm uppercase tracking-wider text-secondary font-semibold">Description</th>
                    <th className="p-4 text-label-sm font-label-sm uppercase tracking-wider text-secondary font-semibold">Service Date</th>
                    <th className="p-4 text-label-sm font-label-sm uppercase tracking-wider text-secondary font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/60">
                  <tr className="bg-surface hover:bg-surface-container-lowest transition-colors">
                    <td className="p-4 text-body-sm font-body-sm text-on-surface font-medium">{bill.description || 'Consultation Service'}</td>
                    <td className="p-4 text-body-sm font-body-sm text-on-surface-variant">{new Date(bill.date).toLocaleDateString()}</td>
                    <td className="p-4 text-body-sm font-body-sm text-on-surface text-right">${bill.amount.toFixed(2)}</td>
                  </tr>
                  {/* Empty rows for layout */}
                  <tr className="bg-surface"><td className="p-4">&nbsp;</td><td className="p-4"></td><td className="p-4"></td></tr>
                  <tr className="bg-surface"><td className="p-4">&nbsp;</td><td className="p-4"></td><td className="p-4"></td></tr>
                </tbody>
                <tfoot className="border-t-2 border-outline-variant/60 bg-surface-container-lowest">
                  <tr>
                    <td colSpan="2" className="p-4 text-right text-label-md font-label-md uppercase tracking-wider text-secondary font-semibold">Total Balance</td>
                    <td className="p-4 text-right text-headline-sm font-headline-sm text-primary font-bold">${bill.amount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Payment Section */}
            {!isPaid && (
              <div className="p-6 bg-surface-container border-t border-outline-variant flex justify-end">
                <button 
                  onClick={() => payBill(bill.id)} 
                  className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md h-10 px-6 rounded flex items-center justify-center gap-2 transition-colors duration-150 font-medium"
                >
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  Pay Securely via Portal
                </button>
              </div>
            )}
          </div>
          
          <p className="text-center text-label-sm text-outline">
            ApexCare billing complies with the No Surprises Act. For itemized hospital facility fees, please contact the billing department.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BillDetail;

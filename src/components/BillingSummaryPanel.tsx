import { motion } from 'framer-motion';
import { Receipt, Percent, Calculator, Tag } from 'lucide-react';
import { BillingSummary } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface BillingSummaryPanelProps {
  billing: BillingSummary;
  discountValue: number;
  discountType: 'percentage' | 'fixed';
  gstRate: number;
  onDiscountChange: (value: number) => void;
  onDiscountTypeChange: (type: 'percentage' | 'fixed') => void;
  onGstRateChange: (rate: number) => void;
}

export const BillingSummaryPanel = ({
  billing,
  discountValue,
  discountType,
  gstRate,
  onDiscountChange,
  onDiscountTypeChange,
  onGstRateChange,
}: BillingSummaryPanelProps) => {
  return (
    <div className="space-y-4">
      {/* Discount Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Tag className="w-4 h-4 text-accent" />
          <span>Discount</span>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={discountType === 'percentage' ? 'default' : 'outline'}
            onClick={() => onDiscountTypeChange('percentage')}
            className={discountType === 'percentage' ? 'bg-gradient-accent' : ''}
          >
            <Percent className="w-3 h-3 mr-1" />
            %
          </Button>
          <Button
            size="sm"
            variant={discountType === 'fixed' ? 'default' : 'outline'}
            onClick={() => onDiscountTypeChange('fixed')}
            className={discountType === 'fixed' ? 'bg-gradient-accent' : ''}
          >
            ₹ Fixed
          </Button>
        </div>

        <Input
          type="number"
          value={discountValue}
          onChange={(e) => onDiscountChange(Number(e.target.value))}
          min="0"
          max={discountType === 'percentage' ? 100 : undefined}
          placeholder={discountType === 'percentage' ? '0-100%' : 'Amount'}
          className="h-9"
        />
      </div>

      {/* GST Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Calculator className="w-4 h-4 text-primary" />
          <span>GST Rate (%)</span>
        </div>
        
        <div className="flex gap-2">
          {[0, 5, 12, 18, 28].map((rate) => (
            <Button
              key={rate}
              size="sm"
              variant={gstRate === rate ? 'default' : 'outline'}
              onClick={() => onGstRateChange(rate)}
              className={gstRate === rate ? 'bg-gradient-primary text-primary-foreground' : ''}
            >
              {rate}%
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Summary */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>₹{billing.subtotal.toLocaleString()}</span>
        </div>
        
        {billing.discount > 0 && (
          <div className="flex justify-between text-sm text-accent">
            <span>Discount ({discountType === 'percentage' ? `${discountValue}%` : 'Fixed'})</span>
            <span>-₹{billing.discount.toLocaleString()}</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">GST ({billing.gstRate}%)</span>
          <span>₹{billing.gstAmount.toLocaleString()}</span>
        </div>

        <Separator />
        
        <div className="flex justify-between items-center pt-2">
          <span className="font-display font-semibold text-lg">Total</span>
          <motion.span 
            key={billing.total}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="font-display font-bold text-2xl text-primary"
          >
            ₹{billing.total.toLocaleString()}
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
};

import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, Download, X, Smartphone } from 'lucide-react';
import { Order } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

export const PaymentDialog = ({ open, onClose, order }: PaymentDialogProps) => {
  if (!order) return null;

  // Generate UPI payment string
  const upiPaymentString = `upi://pay?pa=merchant@upi&pn=Store&am=${order.total.toFixed(2)}&tn=Order ${order.id}`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <CheckCircle2 className="w-5 h-5 text-success" />
            Order Confirmed!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono font-semibold">#{order.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Items</span>
              <span>{order.items.length} products</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="font-medium">Total Amount</span>
              <span className="font-display font-bold text-xl text-primary">
                ₹{order.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Smartphone className="w-4 h-4" />
              <span>Scan to pay with UPI</span>
            </div>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 bg-white rounded-xl shadow-lg-custom"
            >
              <QRCodeSVG
                value={upiPaymentString}
                size={180}
                level="H"
                includeMargin
                bgColor="#ffffff"
                fgColor="#1a1a2e"
              />
            </motion.div>
            
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Supports all UPI apps: Google Pay, PhonePe, Paytm, etc.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-center">
            <Button onClick={onClose} className="bg-gradient-primary shadow-primary">
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
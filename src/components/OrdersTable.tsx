import { motion } from 'framer-motion';
import { FileSpreadsheet, Download, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface OrdersTableProps {
  orders: Order[];
  onExport: () => void;
}

const statusConfig = {
  pending: { icon: Clock, className: 'bg-accent/20 text-accent' },
  completed: { icon: CheckCircle2, className: 'bg-success/20 text-success' },
  cancelled: { icon: XCircle, className: 'bg-destructive/20 text-destructive' },
};

export const OrdersTable = ({ orders, onExport }: OrdersTableProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg border border-border/50 shadow-md-custom"
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold">Order History</h3>
          <Badge variant="secondary">{orders.length} orders</Badge>
        </div>
        
        <Button
          size="sm"
          variant="outline"
          onClick={onExport}
          disabled={orders.length === 0}
          className="hover:bg-primary/10"
        >
          <Download className="w-4 h-4 mr-1" />
          Export CSV
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <FileSpreadsheet className="w-12 h-12 mb-3 opacity-50" />
          <p className="text-sm">No orders yet</p>
          <p className="text-xs mt-1">Complete your first order to see it here</p>
        </div>
      ) : (
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-display">Order ID</TableHead>
                <TableHead className="font-display">Date</TableHead>
                <TableHead className="font-display">Items</TableHead>
                <TableHead className="font-display">No. of Items</TableHead>
                <TableHead className="font-display text-right">Total</TableHead>
                <TableHead className="font-display text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order, index) => {
                const StatusIcon = statusConfig[order.status].icon;
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-secondary/50"
                  >
                    {/* Order ID */}
<TableCell className="font-mono text-sm">
  #{order.id}
</TableCell>

{/* Date */}
<TableCell className="text-sm text-muted-foreground">
  {new Date(order.createdAt).toLocaleDateString()}
</TableCell>

{/* 🔶 Items column */}
<TableCell className="text-sm">
  <div className="flex flex-col gap-1">
    {order.items.map((item, index) => (
      <span key={index}>{item.name}
      {index < order.items.length - 1 && ","}
      </span>
    ))}
  </div>
</TableCell>

{/* 🔶 No. of Items — THIS IS THE KEY FIX */}
<TableCell className="text-center font-medium">
  {order.items.length}
</TableCell>

{/* Total */}
<TableCell className="text-right font-semibold">
  ₹{order.total.toLocaleString()}
</TableCell>

{/* Status */}
<TableCell className="text-center">
  <Badge className={statusConfig[order.status].className}>
    <StatusIcon className="w-3 h-3 mr-1" />
    {order.status}
  </Badge>
</TableCell>

                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </motion.div>
  );
};

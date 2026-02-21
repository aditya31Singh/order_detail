import { motion } from 'framer-motion';
import { Package, ShoppingCart, Plus, Pencil, Trash2 } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductCard = ({ product, onAddToCart, onEdit, onDelete }: ProductCardProps) => {
  const isLowStock = product.stock <= 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className="group relative bg-card rounded-lg p-4 shadow-md-custom card-hover border border-border/50"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8"
            onClick={() => onEdit(product)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(product.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <h3 className="font-display font-semibold text-foreground mb-1">
        {product.name}
      </h3>
      
      <p className="text-2xl font-bold text-primary mb-3">
        ₹{product.price.toLocaleString()}
      </p>

      <div className="flex items-center justify-between">
        <span className={`text-sm ${isLowStock ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
          {isLowStock ? `Only ${product.stock} left!` : `${product.stock} in stock`}
        </span>
        
        <Button 
          size="sm" 
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className="bg-gradient-primary hover:opacity-90 shadow-primary text-primary-foreground"
        >
          <ShoppingCart className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>
    </motion.div>
  );
};

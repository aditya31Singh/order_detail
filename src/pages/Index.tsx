import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Package, 
  ShoppingCart, 
  Receipt,
  Search,
  LayoutGrid,
  CreditCard,
  TrendingUp,
  Clock,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  BarChart3
} from 'lucide-react';
import { Product, Order } from '@/types';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import { ProductCard } from '@/components/ProductCard';
import { ProductFormDialog } from '@/components/ProductFormDialog';
import { CartPanel } from '@/components/CartPanel';
import { BillingSummaryPanel } from '@/components/BillingSummaryPanel';
import { PaymentDialog } from '@/components/PaymentDialog';
import { OrdersTable } from '@/components/OrdersTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const Index = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { 
    items, 
    billing, 
    discountValue,
    discountType,
    gstRate,
    addToCart, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    setDiscountValue,
    setDiscountType,
    setGstRate,
  } = useCart();
  const { orders, createOrder, exportOrders } = useOrders();

  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter products
  const categories = ['all', ...new Set(products.map(p => p.category))];
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handlers
  const handleAddProduct = (data: Omit<Product, 'id'>) => {
    addProduct(data);
    toast.success('Product added successfully!');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductDialogOpen(true);
  };

  const handleUpdateProduct = (data: Omit<Product, 'id'>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
      toast.success('Product updated!');
    }
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id);
    toast.success('Product deleted');
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Cart is empty!');
      return;
    }
    const order = createOrder(items, billing);
    setCurrentOrder(order);
    setPaymentDialogOpen(true);
    clearCart();
    toast.success('Order placed successfully!');
  };

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock <= 5).length;
  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.createdAt).toDateString();
    return orderDate === new Date().toDateString();
  }).length;
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-2.5 rounded-xl bg-gradient-primary shadow-primary"
              >
                <Receipt className="w-6 h-6 text-primary-foreground" />
              </motion.div>
              <div>
                <h1 className="font-display font-bold text-2xl tracking-tight">BillFlow</h1>
                <p className="text-xs text-muted-foreground">Product & Order Management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium">Live</span>
              </div>
              <Button 
                onClick={() => {
                  setEditingProduct(null);
                  setProductDialogOpen(true);
                }}
                className="bg-gradient-primary shadow-primary rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Dashboard Overview</span>
              </div>
              <h2 className="font-display text-2xl font-bold mb-1">Welcome back!</h2>
              <p className="text-muted-foreground">Here's what's happening with your store today.</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-2 py-2 px-4 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className="group bg-card rounded-2xl p-5 border border-border/50 shadow-sm-custom hover:shadow-md-custom transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10">
                <Package className="w-5 h-5 text-blue-500" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Products</p>
            <p className="text-3xl font-display font-bold">{totalProducts}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -2 }}
            className="group bg-card rounded-2xl p-5 border border-border/50 shadow-sm-custom hover:shadow-md-custom transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <ShoppingCart className="w-5 h-5 text-primary" />
              </div>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{items.reduce((sum, i) => sum + i.quantity, 0)}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Cart Items</p>
            <p className="text-3xl font-display font-bold">{items.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -2 }}
            className="group bg-card rounded-2xl p-5 border border-border/50 shadow-sm-custom hover:shadow-md-custom transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10">
                <Receipt className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-xs text-muted-foreground">Today: {todayOrders}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
            <p className="text-3xl font-display font-bold">{orders.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -2 }}
            className="group bg-gradient-to-br from-primary/10 via-card to-card rounded-2xl p-5 border border-primary/20 shadow-sm-custom hover:shadow-md-custom transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
            <p className="text-3xl font-display font-bold text-primary">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Avg: ₹{avgOrderValue.toFixed(0)}/order</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        {lowStockProducts > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <p className="text-sm">
              <span className="font-semibold">{lowStockProducts} products</span> are running low on stock
            </p>
            <Button size="sm" variant="outline" className="ml-auto rounded-lg">
              View All
            </Button>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Products Section */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 h-12 rounded-xl bg-muted/50">
                <TabsTrigger value="products" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  Products
                </TabsTrigger>
                <TabsTrigger value="orders" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Receipt className="w-4 h-4 mr-2" />
                  Order History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="mt-0">
                <Card className="rounded-2xl border-border/50 shadow-sm-custom overflow-hidden">
                  <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="font-display text-xl flex items-center gap-2">
                          <LayoutGrid className="w-5 h-5 text-primary" />
                          Product Catalog
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {filteredProducts.length} of {products.length} products shown
                        </CardDescription>
                      </div>
                      
                      <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 rounded-xl bg-background/50"
                        />
                      </div>
                    </div>
                    
                    {/* Category Filter */}
                    <div className="flex gap-2 flex-wrap pt-4">
                      {categories.map((cat) => (
                        <Button
                          key={cat}
                          size="sm"
                          variant={selectedCategory === cat ? 'default' : 'outline'}
                          onClick={() => setSelectedCategory(cat)}
                          className={`rounded-full transition-all ${selectedCategory === cat ? 'bg-gradient-primary shadow-sm' : 'hover:bg-muted'}`}
                        >
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product, index) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <ProductCard
                              product={product}
                              onAddToCart={handleAddToCart}
                              onEdit={handleEditProduct}
                              onDelete={handleDeleteProduct}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                    
                    {filteredProducts.length === 0 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16 text-muted-foreground"
                      >
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                          <Package className="w-8 h-8 opacity-50" />
                        </div>
                        <p className="font-medium mb-2">No products found</p>
                        <p className="text-sm mb-4">Try adjusting your search or filters</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('all');
                          }}
                        >
                          Clear filters
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="mt-0">
                <OrdersTable orders={orders} onExport={exportOrders} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Cart & Billing Section */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="sticky top-24 rounded-2xl border-border/50 shadow-md-custom overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-border/50 pb-4">
                  <CardTitle className="font-display text-xl flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <ShoppingCart className="w-5 h-5 text-primary" />
                    </div>
                    Shopping Cart
                    {items.length > 0 && (
                      <Badge className="bg-gradient-primary ml-auto">
                        {items.reduce((sum, i) => sum + i.quantity, 0)} items
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-5 space-y-5">
                  <CartPanel
                    items={items}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />

                  {items.length > 0 && (
                    <>
                      <Separator />
                      <BillingSummaryPanel
                        billing={billing}
                        discountValue={discountValue}
                        discountType={discountType}
                        gstRate={gstRate}
                        onDiscountChange={setDiscountValue}
                        onDiscountTypeChange={setDiscountType}
                        onGstRateChange={setGstRate}
                      />
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          onClick={handleCheckout} 
                          className="w-full bg-gradient-primary shadow-primary h-14 text-lg font-display rounded-xl"
                        >
                          <CreditCard className="w-5 h-5 mr-2" />
                          Pay ₹{billing.total.toLocaleString()}
                        </Button>
                      </motion.div>
                    </>
                  )}

                  {/* {items.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                        <ShoppingCart className="w-8 h-8 opacity-50" />
                      </div>
                      <p className="font-medium mb-1">Your cart is emptyyyy</p>
                      <p className="text-sm">Add products to get started</p>
                    </div>
                  )} */}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16 py-8 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              <span className="font-display font-semibold">BillFlow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} BillFlow. Built for seamless billing management.
            </p>
          </div>
        </div>
      </footer>

      {/* Dialogs */}
      <ProductFormDialog
        open={productDialogOpen}
        onClose={() => {
          setProductDialogOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
        product={editingProduct}
      />

      <PaymentDialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        order={currentOrder}
      />
    </div>
  );
};

export default Index;

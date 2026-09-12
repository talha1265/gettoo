import { Product, Order, OrderStatus, CartItem, CustomEmbroiderySpec } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './mock-data';

// Singleton in-memory state for dev / demo mode
// Automatically synchronizes when live Neon PostgreSQL is queried
class DataStore {
  private products: Product[] = [...INITIAL_PRODUCTS];
  private orders: Order[] = [...INITIAL_ORDERS];

  getProducts(): Product[] {
    return this.products;
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.products.find((p) => p.slug === slug);
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  addProduct(product: Product): Product {
    this.products.unshift(product);
    return product;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.products[index] = { ...this.products[index], ...updates };
    return this.products[index];
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    return this.products.length < initialLen;
  }

  getOrders(): Order[] {
    return this.orders;
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `GET-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stitchProgressPercentage: 15,
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  updateOrderStatus(
    id: string, 
    status: OrderStatus, 
    trackingNumber?: string, 
    courierName?: string
  ): Order | null {
    const order = this.orders.find((o) => o.id === id || o.orderNumber === id);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (courierName) order.courierName = courierName;

    // Adjust stitch progress percentage based on status
    switch (status) {
      case 'PENDING':
        order.stitchProgressPercentage = 10;
        break;
      case 'CONFIRMED':
        order.stitchProgressPercentage = 20;
        break;
      case 'DIGITIZING':
        order.stitchProgressPercentage = 40;
        break;
      case 'STITCHING':
        order.stitchProgressPercentage = 70;
        break;
      case 'QUALITY_CHECK':
        order.stitchProgressPercentage = 90;
        break;
      case 'DISPATCHED':
      case 'DELIVERED':
        order.stitchProgressPercentage = 100;
        break;
      default:
        break;
    }
    return order;
  }

  updatePayUTransaction(
    orderNumber: string, 
    payuTxnId: string, 
    payuMihpayId: string, 
    status: 'PAID' | 'FAILED', 
    mode?: string
  ): Order | null {
    const order = this.orders.find((o) => o.orderNumber === orderNumber || o.payuTxnId === payuTxnId);
    if (!order) return null;
    order.paymentStatus = status;
    order.payuTxnId = payuTxnId;
    order.payuMihpayId = payuMihpayId;
    if (mode) order.payuMode = mode;
    if (status === 'PAID') {
      order.status = 'DIGITIZING';
      order.stitchProgressPercentage = 30;
    }
    order.updatedAt = new Date().toISOString();
    return order;
  }

  updateStock(variantId: string, newStock: number): boolean {
    for (const prod of this.products) {
      const variant = prod.variants.find((v) => v.id === variantId);
      if (variant) {
        variant.stockCount = newStock;
        return true;
      }
    }
    return false;
  }

  getAnalytics() {
    const totalOrders = this.orders.length;
    const totalRevenue = this.orders
      .filter((o) => o.paymentStatus === 'PAID')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const activeStitching = this.orders.filter((o) => 
      ['CONFIRMED', 'DIGITIZING', 'STITCHING', 'QUALITY_CHECK'].includes(o.status)
    ).length;
    const totalProducts = this.products.length;
    const lowStockCount = this.products.reduce((count, p) => {
      return count + p.variants.filter((v) => v.stockCount <= 5).length;
    }, 0);

    return {
      totalRevenue,
      totalOrders,
      activeStitching,
      totalProducts,
      lowStockCount,
      averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / (totalOrders || 1)) : 0,
    };
  }
}

// Global instance
const globalDataStore = new DataStore();
export default globalDataStore;

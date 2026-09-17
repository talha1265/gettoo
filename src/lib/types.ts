export type StitchPlacement = 
  | 'CHEST_LEFT' 
  | 'CHEST_CENTER' 
  | 'SLEEVE_LEFT' 
  | 'SLEEVE_RIGHT' 
  | 'BACK_NAPE' 
  | 'FULL_BACK';

export type EmbroideryType = 'TEXT' | 'ARTWORK' | 'HYBRID';

export type StitchType = 'SATIN' | 'FLAT' | 'PUFF_3D' | 'TATAMI';

export interface ThreadColor {
  id: string;
  name: string;
  hex: string;
  isMetallic?: boolean;
  sheen: string;
}

export interface EmbroideryFont {
  id: string;
  name: string;
  previewClass: string;
  fontFamily: string;
  category: 'script' | 'serif' | 'sans' | 'gothic' | 'varsity';
}

export interface CustomEmbroiderySpec {
  id?: string;
  type: EmbroideryType;
  placement: StitchPlacement;
  customText?: string;
  fontStyle?: string;
  threadColor?: string;
  threadColorHex?: string;
  stitchType?: StitchType;
  uploadedImageUrl?: string;
  artworkNotes?: string;
  artworkScale?: number;
  artworkRotation?: number;
  artworkOffsetX?: number;
  artworkOffsetY?: number;
  estimatedStitches?: number;
  digitizingFee?: number;
  customCharge: number;
  mockupPreviewUrl?: string;
}

export interface ProductVariant {
  id: string;
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  colorName: string;
  colorHex: string;
  sku: string;
  stockCount: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  story?: string;
  basePrice: number;
  salePrice?: number;
  gsm: number;
  fabric: string;
  fit: string;
  isCustomizable: boolean;
  images: string[];
  category: string;
  isFeatured?: boolean;
  inStock: boolean;
  variants: ProductVariant[];
  stitchCount?: number;
  threadColorsUsed?: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  customEmbroidery?: CustomEmbroiderySpec;
  unitPrice: number;
  totalPrice: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type OrderStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'DIGITIZING' 
  | 'STITCHING' 
  | 'QUALITY_CHECK' 
  | 'DISPATCHED' 
  | 'DELIVERED' 
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type PaymentGateway = 'PAYU' | 'RAZORPAY' | 'UPI' | 'CARD' | 'NETBANKING' | 'COD';

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  subtotal: number;
  customizationFee: number;
  shippingFee: number;
  discount: number;
  discountCode?: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentGateway: PaymentGateway;
  paymentTransactionId?: string;
  payuTxnId?: string;
  payuMihpayId?: string;
  payuMode?: string;
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
  courierName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  stitchProgressPercentage?: number;
}

export interface PayUInitiatePayload {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  hash: string;
  service_provider: 'payu_paisa';
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'ARTISAN';
  avatarUrl?: string;
  addresses: ShippingAddress[];
  savedDesigns: {
    id: string;
    title: string;
    date: string;
    specs: CustomEmbroiderySpec;
    teeColor: string;
    previewUrl: string;
  }[];
}

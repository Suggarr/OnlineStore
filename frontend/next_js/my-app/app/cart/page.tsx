'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Package, ArrowRight, Trash2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { toast } from 'react-toastify';
import { apiClient } from '@/lib/apiClient';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import styles from './cart.module.css';

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isAuthorized } = useAuthRedirect('http://localhost:5200/api/cartitems');

  useEffect(() => {
    setMounted(true);
  }, []);

  const { t } = useLocale();

  useEffect(() => {
    if (mounted && isAuthorized) {
      fetchCart();
    }
  }, [isAuthorized, mounted]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<CartItem[]>('/CartItems');
      setCartItems(response.data || []);
      calculateTotal(response.data || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error(t('cart.errorLoad', 'Ошибка при загрузке корзины'));
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items: CartItem[]) => {
    const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  };

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity <= 0) return;

    try {
      await apiClient.patch(`/CartItems/${id}/quantity`, { quantity: newQuantity });
      const updated = cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updated);
      calculateTotal(updated);
      toast.success(t('cart.qtyUpdated', 'Количество обновлено'));
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error(t('cart.errorUpdateQty', 'Ошибка при обновлении количества'));
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await apiClient.del(`/CartItems/${id}`);
      const updated = cartItems.filter(item => item.id !== id);
      setCartItems(updated);
      calculateTotal(updated);
      toast.success(t('cart.itemRemoved', 'Товар удален из корзины'));
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error(t('cart.errorDelete', 'Ошибка при удалении товара'));
    }
  };

  const clearCart = async () => {
    if (!confirm(t('cart.clearConfirm', 'Вы уверены, что хотите очистить корзину?'))) return;

    try {
      await apiClient.del('/CartItems/clear');
      setCartItems([]);
      setTotal(0);
      toast.success(t('cart.cleared', 'Корзина очищена'));
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error(t('cart.errorClear', 'Ошибка при очистке корзины'));
    }
  };

  const checkout = async () => {
    if (cartItems.length === 0) {
      toast.error(t('cart.emptyError', 'Корзина пуста'));
      return;
    }

    try {
      setCheckoutLoading(true);
      await apiClient.post('/Orders', {
        items: cartItems.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      });
      toast.success(t('cart.checkoutSuccess', 'Заказ успешно оформлен!'));
      setCartItems([]);
      setTotal(0);
      setTimeout(() => router.push('/profile'), 1500);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(t('cart.checkoutFail', 'Ошибка при оформлении заказа'));
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{t('cart.title', 'Корзина покупок')}</h1>
        </div>
        <div className={styles.loading}>
          <ShoppingCart size={48} />
          <p>{t('cart.loading', 'Загрузка корзины...')}</p>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{t('cart.title', 'Корзина покупок')}</h1>
          <p>{t('cart.emptyTitle', 'Ваша корзина пуста')}</p>
        </div>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Package size={64} />
          </div>
          <h3>{t('cart.emptyHeader', 'Корзина пуста')}</h3>
          <p>{t('cart.emptyText', 'Добавьте товары из каталога, чтобы начать покупки')}</p>
          <Link href="/catalog" className={styles.emptyButton}>
            {t('cart.goToCatalog', 'Перейти в каталог')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{t('cart.title', 'Корзина покупок')}</h1>
        <p>
          {cartItems.length} {t('cart.itemsLabel', 'товар')}{cartItems.length % 10 === 1 && cartItems.length !== 11 ? '' : t('cart.itemsPl', 'ов')}
        </p>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.itemsSection}>
          {cartItems.map(item => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.imageWrapper}>
                <img
                  src={item.imageUrl || `https://via.placeholder.com/120?text=${item.productName}`}
                  alt={item.productName}
                  className={styles.image}
                  onClick={() => router.push(`/products/${item.productId}`)}
                />
              </div>

              <div className={styles.itemContent}>
                <Link
                  href={`/products/${item.productId}`}
                  className={styles.itemName}
                >
                  {item.productName}
                </Link>

                <div className={styles.priceSection}>
                  <div className={styles.price}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  <div className={styles.quantityControl}>
                    <button
                      className={styles.quantityBtn}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Уменьшить количество"
                    >
                      −
                    </button>
                    <div className={styles.quantityDisplay}>
                      {item.quantity}
                    </div>
                    <button
                      className={styles.quantityBtn}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Увеличить количество"
                    >
                      +
                    </button>
                  </div>

                  <button
                    className={styles.deleteBtn}
                    onClick={() => deleteItem(item.id)}
                    title="Удалить товар"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>{t('cart.summaryTitle', 'Итого')}</h2>

          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>{t('cart.summary.items', 'Товаров:')}</span>
            <span className={styles.summaryValue}>{cartItems.length}</span>
          </div>

          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>{t('cart.summary.total', 'Сумма:')}</span>
            <span className={styles.summaryValue}>
              ${total.toFixed(2)}
            </span>
          </div>

          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>{t('cart.summary.shipping', 'Доставка:')}</span>
            <span className={styles.summaryValue}>{t('cart.summary.free', 'Бесплатно')}</span>
          </div>

          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>{t('cart.summary.totalText', 'Итого:')}</span>
            <span className={styles.summaryValue}>
              ${total.toFixed(2)}
            </span>
          </div>

          <button
            className={styles.checkoutBtn}
            onClick={checkout}
            disabled={checkoutLoading || cartItems.length === 0}
          >
            {checkoutLoading ? t('cart.checkoutLoading', 'Оформление...') : t('cart.checkout', 'Оформить заказ')}
            {!checkoutLoading && <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />}
          </button>

          <Link href="/catalog" className={styles.continueShoppingBtn}>
            {t('cart.continueShopping', 'Продолжить покупки')}
          </Link>

          <button
            className={styles.clearBtn}
            onClick={clearCart}
          >
            {t('cart.clearBtn', 'Очистить корзину')}
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  Text,
  Card,
  Button,
  Flex,
  Icon,
  useTheme,
  Tabs,
  Grid,
  GridItem,
  Divider,
  Checkbox,
  Image,
  Rating,
  Search,
  NumberInput,
  Badge,
} from '@platform-blocks/ui';
import { CartItem } from './types';
import { categories, products } from './mockData';
import { styles } from './styles';
import { PageLayout } from 'components/PageLayout';
import { useResponsive } from '../../../../hooks/useResponsive';

export function EcommerceExample() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCart, setShowCart] = useState(false);
  const responsive = useResponsive();
  // const isSmallScreen = responsive.currentBreakpoint === 'sm';
  const isMobile = responsive.isMobile || responsive.currentBreakpoint === 'sm';
  const theme = useTheme();
  // Responsive spans handled by Grid's responsive props

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (productId: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing) {
        return prev.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: productId, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getCartCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  const getCartTotal = () => {
    return cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.id);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const cartItems = cart.map(cartItem => ({
    ...cartItem,
    product: products.find(p => p.id === cartItem.id)!
  }));

  const renderCartOverlay = () => (
    <Card style={styles.exampleCard} shadow="lg">
      <View style={styles.container}>
        <View style={[styles.header, { borderBottomColor: theme.colors.gray[3] }]}>
          <Flex direction="row" align="center" justify="space-between">
            <Flex direction="row" align="center" gap={12}>
              <Button
                // variant="outline"
                title=""
                size="sm"
                icon={<Icon name="chevronLeft" size="sm" />}
                onPress={() => setShowCart(false)}
                radius="xl"
              />
              <Text size="xl" weight="bold">
                Cart ({getCartCount()})
              </Text>
            </Flex>
            <Text size="lg" weight="bold" color="primary">${getCartTotal().toFixed(2)}</Text>
          </Flex>
        </View>
  <ScrollView style={[styles.content, isMobile && { padding: 12 }]}>
          {cartItems.length === 0 ? (
            <View style={styles.emptyCart}>
              <Text size="3xl" style={{ marginBottom: 12 }}>🛒</Text>
              <Text color="muted" align="center">Your cart is empty</Text>
              <Button title="Continue Shopping" variant="filled" style={{ marginTop: 16 }} onPress={() => setShowCart(false)} />
            </View>
          ) : (
            <>
              {cartItems.map(item => (
                <Card key={item.id} style={styles.cartItem} variant="outline">
                  <Flex direction="row" gap={12}>
                    <View style={styles.cartItemImage}>
                      <Image
                        src={item.product.image}
                        style={{ width: '100%', height: '100%' }}
                        imageStyle={{ width: '100%', height: '100%', borderRadius: 8 }}
                        resizeMode="cover"
                        accessibilityLabel={`${item.product.name} product photo`}
                        fallback={<Icon name="image" size="lg" color={theme.colors.gray[5]} />}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text weight="semibold">{item.product.name}</Text>
                      <Text size="sm" color="muted" style={{ marginTop: 2 }}>${item.product.price} ea</Text>
                      <Flex direction="row" align="center" gap={6} style={{ marginTop: 8 }}>
                        <NumberInput
                          value={item.quantity}
                          onChange={(val) => updateQuantity(item.id, val || 0)}
                          min={0}
                          size="xs"
                          style={{ width: 100 }}
                          keyboardFocusId={`cart-quantity-${item.id}`}
                        />
                      </Flex>
                    </View>
                    <Flex direction="column" align="flex-end" gap={8}>
                      <Text weight="bold">${(item.product.price * item.quantity).toFixed(2)}</Text>
                      <Button variant="outline" size="xs" title="" colorVariant="error" startIcon={<Icon name="trash" size="sm" stroke={4} />} onPress={() => removeFromCart(item.id)} />
                    </Flex>
                  </Flex>
                </Card>
              ))}
              <Card style={styles.checkoutSection} variant="filled">
                <Text weight="bold" style={{ marginBottom: 12 }}>Order Summary</Text>
                <Flex direction="row" justify="space-between" style={{ marginBottom: 4 }}>
                  <Text size="sm">Subtotal</Text>
                  <Text size="sm">${getCartTotal().toFixed(2)}</Text>
                </Flex>
                <Flex direction="row" justify="space-between" style={{ marginBottom: 4 }}>
                  <Text size="sm">Shipping</Text>
                  <Text size="sm">Free</Text>
                </Flex>
                <Divider style={{ marginVertical: 12 }} />
                <Flex direction="row" justify="space-between" style={{ marginBottom: 16 }}>
                  <Text weight="bold">Total</Text>
                  <Text weight="bold" color="primary">${getCartTotal().toFixed(2)}</Text>
                </Flex>
                <Button title="Checkout" variant="filled" endIcon={<Icon name="chevronRight" size="sm" />} />
              </Card>
            </>
          )}
        </ScrollView>
      </View>
    </Card>
  );

  if (showCart) return renderCartOverlay();

  const FiltersContent = () => (
    <>
      <Text weight="bold" style={{ marginBottom: 12 }}>Filters</Text>
      <Text size="xs" color="muted" style={{ marginBottom: 4 }}>Stock</Text>
      <Checkbox label="In Stock" defaultChecked />
      <Divider style={{ marginVertical: 12 }} />
      <Text size="xs" color="muted" style={{ marginBottom: 4 }}>Price</Text>
      <Flex direction="column" gap={4}>
        <Button title="Under $50" size="xs" variant="ghost" />
        <Button title="$50 - $100" size="xs" variant="ghost" />
        <Button title="$100 - $200" size="xs" variant="ghost" />
      </Flex>
      <Divider style={{ marginVertical: 12 }} />
      <Text size="xs" color="muted" style={{ marginBottom: 4 }}>Promotions</Text>
      <Checkbox label="Rollback" />
      <Checkbox label="On Sale" />
    </>
  );

  return (
    <PageLayout>
      <View>
        {/* Primary Header / Brand Bar */}
        <View
          style={[
            styles.headerBar,
            { backgroundColor: theme.colors.primary[9], borderBottomColor: theme.colors.primary[8], borderBottomWidth: 1 },
            isMobile ? styles.headerBarMobile : { justifyContent: 'space-between' }
          ]}
        >
          <Text style={[styles.brand, { color: theme.colors.secondary[4], marginBottom: isMobile ? 4 : 0 }]}>PlatformBlocksMart</Text>
          <View style={[styles.searchBarLarge, isMobile && styles.searchBarMobile]}>
            <Search
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search millions of items..."
              size="md"
            />
          </View>
          <Flex direction="row" align="center" gap={12} style={isMobile ? styles.accountActionsMobile : undefined}>
            <Button variant="ghost" size="sm" title="Account" startIcon={<Icon name="person" size="sm" />} />
            <Button variant="ghost" size="sm" title={`Cart (${getCartCount()})`} startIcon={<Icon name="cart" size="sm" />} onPress={() => setShowCart(true)} />
          </Flex>
        </View>

        {/* Category Bar */}
        <View
          style={[styles.categoryBar, { backgroundColor: theme.colors.primary[0], borderBottomColor: theme.colors.primary[2] }]}
        >
          <Tabs
            items={categories.map(c => ({ key: c, label: c, content: <></> }))}
            activeTab={selectedCategory}
            onTabChange={setSelectedCategory}
            variant="line"
            size="sm"
            color="primary"
            scrollable
            navigationOnly
          />
        </View>

        {/* Hero Offer */}
        <Card
          variant="filled"
          style={[styles.hero, { backgroundColor: theme.colors.primary[8] }, isMobile && styles.heroMobile]}
        >
          <Flex direction={isMobile ? 'column' : 'row'} align={isMobile ? 'flex-start' : 'center'} justify="space-between" gap={isMobile ? 16 : 0}>
            <View style={{ flex: 1, paddingRight: isMobile ? 0 : 16 }}>
              <Text size={isMobile ? 'lg' : 'xl'} weight="bold" style={{ color: 'white', marginBottom: 4 }}>Rollback Savings Event</Text>
              <Text size="sm" style={{ color: theme.colors.primary[1] }}>Top tech picks with new low prices. Limited time deals – while supplies last.</Text>
              <Button title="Shop Deals" variant="gradient" size="sm" style={{ marginTop: 12, alignSelf: isMobile ? 'flex-start' : 'auto' }} endIcon={<Icon name="chevronRight" size="sm" />} />
            </View>
            <Text style={{ fontSize: isMobile ? 36 : 48, alignSelf: isMobile ? 'center' : 'auto' }}>💸</Text>
          </Flex>
        </Card>

        {/* Main Content with optional filters */}
        <ScrollView style={[styles.content, isMobile && { padding: 12 }]}>
          <View style={[styles.mainContentRow, isMobile && styles.mainContentColumn]}>
            {!isMobile && (
              <View style={styles.filtersColumn}>
                <FiltersContent />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Grid columns={12} gap={isMobile ? 12 : 16}>
                {filteredProducts.map(product => (
                  <GridItem key={product.id} span={{ base: 12, sm: 6, md: 4 }}>
                    <Card style={styles.productCard} variant="outline" shadow="sm">
                      <View style={styles.productImage}>
                        <Image
                          src={product.image}
                          style={{ width: '100%', height: '100%' }}
                          imageStyle={{ width: '100%', height: '100%' }}
                          resizeMode="cover"
                          accessibilityLabel={`${product.name} product photo`}
                          fallback={(
                            <Flex align="center" justify="center" style={{ flex: 1 }}>
                              <Icon name="image" size="lg" color={theme.colors.gray[5]} />
                            </Flex>
                          )}
                        />
                        {!product.inStock && (
                          <View style={styles.outOfStockBadge}>
                            <Badge color="gray" variant="filled">Out of Stock</Badge>
                          </View>
                        )}
                        {product.originalPrice && (
                          <View style={styles.rollbackBadge}>
                            <Badge color="red" variant="filled">Rollback</Badge>
                          </View>
                        )}
                      </View>

                      <View style={styles.productInfo}>
                        <Text size="sm" color="muted" style={styles.category}>
                          {product.category}
                        </Text>
                        <Text weight="semibold" style={styles.productName}>
                          {product.name}
                        </Text>
                        <Text size="sm" color="muted" style={styles.description}>
                          {product.description}
                        </Text>

                        <Flex direction="row" align="center" gap={4} style={styles.rating}>
                          <Rating value={product.rating} size="sm" readOnly />
                          <Text size="sm" color="muted">
                            ({product.reviews})
                          </Text>
                        </Flex>

                        <Flex direction="row" align="center" justify="space-between" style={styles.productFooter}>
                          <View style={styles.priceRow}>
                            <Text weight="bold" color="primary" style={{ marginRight: 6 }}>${product.price}</Text>
                            {product.originalPrice && (
                              <Text size="xs" color="muted" style={{ textDecorationLine: 'line-through' }}>${product.originalPrice}</Text>
                            )}
                          </View>
                          <Button
                            variant="filled"
                            size="xs"
                            title={product.inStock ? 'Add' : 'Notify'}
                            onPress={() => product.inStock && addToCart(product.id)}
                            startIcon={<Icon name="plus" size="sm" />}
                            disabled={!product.inStock}
                            radius="xl"
                          />
                        </Flex>
                      </View>
                    </Card>
                  </GridItem>
                ))}
              </Grid>
            </View>
          </View>

          {filteredProducts.length === 0 && (
            <View style={styles.emptyState}>
              <Text size="lg" color="muted" align="center">
                {searchQuery ? 
                  `No products found matching "${searchQuery}" in "${selectedCategory}"` :
                  `No products found in "${selectedCategory}" category`
                }
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </PageLayout>
  );
}
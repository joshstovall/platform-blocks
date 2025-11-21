import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  exampleCard: {
    width: '100%',
    overflow: 'hidden'
  },
  container: {
    height: 600,
    display: 'flex',
    flexDirection: 'column'
  },
  headerBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerBarMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 16
  },
  brand: {
    fontSize: 18,
    fontWeight: '700'
  },
  searchBarLarge: {
    flex: 1,
    marginHorizontal: 16
  },
  searchBarMobile: {
    width: '100%',
    marginHorizontal: 0,
    marginTop: 8
  },
  categoryBar: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1
  },
  header: {
    padding: 16,
    borderBottomWidth: 1
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  saleBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  rollbackBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  content: {
    flex: 1,
    padding: 16
  },
  mainContentRow: {
    flexDirection: 'row',
    width: '100%'
  },
  mainContentColumn: {
    flexDirection: 'column'
  },
  filtersColumn: {
    width: 180,
    paddingRight: 16,
    marginRight: 24,
    flexShrink: 0
  },
  accountActionsMobile: {
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 8
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16
  },
  productCard: {
  // Width now handled by GridItem span
  },
  productImage: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    position: 'relative',
    overflow: 'hidden',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  productInfo: {
    padding: 12
  },
  category: {
    marginBottom: 4
  },
  productName: {
    marginBottom: 4,
    lineHeight: 20
  },
  description: {
    lineHeight: 16
  },
  rating: {
    marginBottom: 8
  },
  productFooter: {
    marginTop: 8
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  hero: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    padding: 20,
    borderRadius: 12
  },
  heroMobile: {
    marginHorizontal: 12,
    padding: 16
  },
  emptyState: {
    padding: 40,
    alignItems: 'center'
  },
  emptyCart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  },
  cartItem: {
    padding: 16,
    marginBottom: 12
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  checkoutSection: {
    padding: 20,
    marginTop: 16
  }
});

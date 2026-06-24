export type ShopCategory = 'PET' | 'ANIMATION' | 'DECORATION' | 'ACCESSORY';

export interface EquippedItem {
  category: ShopCategory;
}

export function canEquip(
  currentEquipped: EquippedItem[],
  category: ShopCategory,
): boolean {
  if (category === 'PET') {
    return !currentEquipped.some((item) => item.category === 'PET');
  }
  if (category === 'ANIMATION') {
    return !currentEquipped.some((item) => item.category === 'ANIMATION');
  }
  const countAccessoryDecoration = currentEquipped.filter(
    (item) =>
      item.category === 'ACCESSORY' || item.category === 'DECORATION',
  ).length;
  return countAccessoryDecoration < 3;
}

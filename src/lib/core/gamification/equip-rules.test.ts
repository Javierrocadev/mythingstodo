import { describe, it, expect } from 'vitest';
import { canEquip, type ShopCategory, type EquippedItem } from './equip-rules';

function item(category: ShopCategory): EquippedItem {
  return { category };
}

function equipped(categories: ShopCategory[]): EquippedItem[] {
  return categories.map(item);
}

describe('canEquip', () => {
  describe('categoría PET', () => {
    it('permite equipar si no hay PET equipado', () => {
      expect(canEquip([], 'PET')).toBe(true);
      expect(canEquip(equipped(['ACCESSORY']), 'PET')).toBe(true);
    });

    it('rechaza equipar si ya hay un PET equipado', () => {
      expect(canEquip(equipped(['PET']), 'PET')).toBe(false);
      expect(canEquip(equipped(['PET', 'ACCESSORY']), 'PET')).toBe(false);
    });
  });

  describe('categoría ANIMATION', () => {
    it('permite equipar si no hay ANIMATION equipada', () => {
      expect(canEquip([], 'ANIMATION')).toBe(true);
    });

    it('rechaza equipar si ya hay una ANIMATION equipada', () => {
      expect(canEquip(equipped(['ANIMATION']), 'ANIMATION')).toBe(false);
    });
  });

  describe('categorías ACCESSORY y DECORATION', () => {
    it('permite equipar si hay menos de 3 entre acc y dec', () => {
      expect(canEquip([], 'ACCESSORY')).toBe(true);
      expect(canEquip(equipped(['ACCESSORY']), 'ACCESSORY')).toBe(true);
      expect(canEquip(equipped(['ACCESSORY', 'ACCESSORY']), 'ACCESSORY')).toBe(true);
      expect(canEquip(equipped(['DECORATION']), 'ACCESSORY')).toBe(true);
      expect(canEquip(equipped(['ACCESSORY', 'DECORATION']), 'ACCESSORY')).toBe(true);
    });

    it('rechaza equipar si ya hay 3 entre acc y dec', () => {
      expect(canEquip(equipped(['ACCESSORY', 'ACCESSORY', 'ACCESSORY']), 'ACCESSORY')).toBe(false);
      expect(canEquip(equipped(['ACCESSORY', 'ACCESSORY', 'ACCESSORY']), 'DECORATION')).toBe(false);
    });

    it('cuenta ACCESSORY y DECORATION juntos hacia el límite de 3', () => {
      expect(canEquip(equipped(['ACCESSORY', 'DECORATION', 'ACCESSORY']), 'ACCESSORY')).toBe(false);
      expect(canEquip(equipped(['DECORATION', 'DECORATION', 'ACCESSORY']), 'DECORATION')).toBe(false);
    });
  });
});

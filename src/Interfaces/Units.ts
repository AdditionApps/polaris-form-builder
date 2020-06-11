export type WeightUnits = 'kg' | 'g' | 'lb' | 'oz';

export interface Units {
    locale?: string;
    currency?: string;
    weight?: WeightUnits;
}

import { ingredientsReference } from "./ingredients-reference";

export function matchIngredients(inciList) {
  const warnings = [];
  const disclosures = [];
  const seenCategories = new Set();

  inciList.forEach((ingredient) => {
    const ref = ingredientsReference[ingredient];
    if (!ref || !ref.category) return;
    if (seenCategories.has(ref.category)) return;
    seenCategories.add(ref.category);

    const item = {
      ingredient,
      category: ref.category,
      label: ref.label,
      context: ref.context,
      relatedIngredients: ref.relatedIngredients || []
    };

    if (ref.disclosure) {
      item.disclosure = ref.disclosure;
      disclosures.push(item);
    } else {
      warnings.push(item);
    }
  });

  return { warnings, disclosures };
}

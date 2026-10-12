import { CharacterCard, CategoryTag } from '../types';

export const matchesCategoryTag = (card: CharacterCard, selectedTag: CategoryTag): boolean => {
  if (selectedTag === 'Tất cả') return true;

  const allText = [
    card.tag,
    ...(card.tagsList || []),
    card.personality || '',
    card.description || '',
    card.note || ''
  ].join(' ').toLowerCase();

  if (selectedTag === 'Only BG') {
    return allText.includes('only bg') || (allText.includes('bg') && !allText.includes('bl'));
  }

  if (selectedTag === 'Only BL') {
    return allText.includes('only bl') || (allText.includes('bl') && !allText.includes('bg'));
  }

  if (selectedTag === 'BG/BL') {
    return (
      allText.includes('bg/bl') ||
      allText.includes('bl/bg') ||
      (allText.includes('bg') && allText.includes('bl') && !allText.includes('only bg') && !allText.includes('only bl'))
    );
  }

  return allText.includes(selectedTag.toLowerCase());
};

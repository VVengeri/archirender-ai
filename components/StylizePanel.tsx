/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { UploadIcon, MagicWandIcon } from './icons';

interface StylizePanelProps {
  onApplyStyle: (prompt?: string) => void;
  onReferenceSelect: (file: File | null) => void;
  isLoading: boolean;
  referenceImage: File | null;
}

const quickStyles = [
    { key: 'scandinavian', prompt: "You are an expert AI interior designer. Your task is to transform the provided image into the **Scandinavian style**. Preserve the existing geometry, layout, and furniture arrangement. Apply these style characteristics: **Key elements:** Bright, airy spaces, functional minimalism, and coziness (hygge). **Color Palette:** Dominate with white, light gray, and soft beige. Use natural wood tones (light oak, ash) as accents. **Materials:** Focus on light-colored wood, wool, linen, and simple ceramics. **Lighting:** Create soft, diffuse, natural daylight. The overall mood should be clean, uncluttered, and serene. Output ONLY the final, restyled image." },
    { key: 'loft', prompt: "You are an expert AI interior designer. Your task is to transform the provided image into the **Loft style**. Preserve the existing geometry, layout, and furniture arrangement. Apply these style characteristics: **Key elements:** Open-plan spaces, industrial atmosphere, raw textures. **Color Palette:** Use a base of brick red, concrete gray, and black. Add accents of metal and dark wood. **Materials:** Heavily feature exposed brick walls, raw concrete surfaces, exposed metal pipes, and rustic wood. **Lighting:** Combine large, factory-style windows with track lighting and metal fixtures. The mood should be spacious, raw, and urban. Output ONLY the final, restyled image." },
    { key: 'minimalism', prompt: "You are an expert AI interior designer. Your task is to transform the provided image into the **Minimalism style**. Preserve the existing geometry, layout, and furniture arrangement. Apply these style characteristics: **Key elements:** Simplicity of form, lack of ornamentation, functionality. **Color Palette:** A strict monochromatic or neutral palette (white, gray, black). **Materials:** Use smooth, uniform surfaces like polished concrete, matte plastics, and metal. Avoid patterns and complex textures. **Lighting:** Create clean, even lighting, often from concealed sources. The mood must be uncluttered, calm, and highly ordered. Output ONLY the final, restyled image." },
    { key: 'japandi', prompt: "You are an expert AI interior designer. Your task is to transform the provided image into the **Japandi style**. Preserve the existing geometry, layout, and furniture arrangement. Apply these style characteristics: **Key elements:** A hybrid of Japanese simplicity and Scandinavian comfort. **Color Palette:** Use neutral, earthy tones: beige, cream, stone gray, with accents of dark wood and black. **Materials:** Combine light woods (like in Scandi) with darker woods (like Japanese), bamboo, rattan, paper, and textured fabrics. **Lighting:** Soft, diffused, and ambient light. Focus on creating a tranquil, harmonious, and minimalist yet warm atmosphere. Output ONLY the final, restyled image." },
    { key: 'contemporary', prompt: "You are an expert AI interior designer. Your task is to transform the provided image into the **Contemporary style**. Preserve the existing geometry, layout, and furniture arrangement. Apply these style characteristics: **Key elements:** Clean lines, uncluttered spaces, current trends. **Color Palette:** Primarily neutral (white, gray, black, beige) with bold, saturated accent colors. **Materials:** Use modern materials like glass, metal (chrome, nickel), and sleek, polished wood. **Lighting:** A mix of recessed, track, and statement pendant lighting. The mood should be sophisticated, sleek, and of-the-moment. Output ONLY the final, restyled image." },
    { key: 'highTech', prompt: "You are an expert AI interior designer. Your task is to transform the provided image into the **High-tech style**. Preserve the existing geometry, layout, and furniture arrangement. Apply these style characteristics: **Key elements:** Advanced technology, industrial materials, functionality. **Color Palette:** Cool, neutral colors like silver, gray, white, and black, often with a single bright accent color (e.g., blue, red). **Materials:** Dominate with chrome-plated metal, glass, plastics, and exposed functional elements. **Lighting:** Use cold, functional LED lighting, track systems, and integrated smart lighting. The mood is futuristic, technological, and minimalist. Output ONLY the final, restyled image." },
    { key: 'modern', prompt: "You are an expert AI interior designer. Your task is to transform the provided image into the **Modern style (Art Nouveau)**. Preserve the existing geometry, layout, and furniture arrangement. Apply these style characteristics: **Key elements:** Flowing, curved lines, nature-inspired motifs (plants, flowers), artistic details. **Color Palette:** Use muted, natural colors like olive green, mustard yellow, lilac, and brown. **Materials:** Emphasize dark, polished wood, stained glass, wrought iron, and artistic ceramics. **Lighting:** Use ornate fixtures with soft, warm light to create an elegant, artistic, and organic atmosphere. Output ONLY the final, restyled image." },
    { key: 'neoclassical', prompt: "You are an expert AI interior designer. Your task is to transform the provided image into the **Neoclassical style**. Preserve the existing geometry, layout, and furniture arrangement. Apply these style characteristics: **Key elements:** Symmetry, clean lines, classical moldings, understated elegance. **Color Palette:** A calm, light palette of beige, cream, gray, pale blue, or green, often accented with gold or bronze. **Materials:** Use high-quality materials like marble, noble woods, and luxurious fabrics (velvet, silk). **Lighting:** Elegant chandeliers and sconces providing balanced, soft light. The mood is refined, orderly, and timeless. Output ONLY the final, restyled image." },
    { key: 'classic', prompt: "You are an expert AI interior designer. Your task is to transform the provided image into the **Classic style**. Preserve the existing geometry, layout, and furniture arrangement. Apply these style characteristics: **Key elements:** Luxury, order, ornate details, columns, elaborate moldings. **Color Palette:** Rich, deep colors combined with cream, beige, and gold. **Materials:** Use dark polished wood, marble, bronze, crystal, and expensive textiles like velvet, silk, and brocade. **Lighting:** Large, ornate crystal chandeliers are central. The mood is opulent, grand, and formal. Output ONLY the final, restyled image." },
    { key: 'mediterranean', prompt: "You are an expert AI interior designer. Your task is to transform the provided image into the **Mediterranean style**. Preserve the existing geometry, layout, and furniture arrangement. Apply these style characteristics: **Key elements:** Arches, rustic textures, connection to the outdoors. **Color Palette:** Dominated by white or plaster walls, with vibrant accents of cobalt blue, turquoise, and terracotta. **Materials:** Use textured plaster walls, terracotta tiles, rustic wood beams, and wrought iron. **Lighting:** Bright, natural light is key. The mood should be relaxed, sunny, and casual. Output ONLY the final, restyled image." },
    { key: 'eco', prompt: "You are an expert AI interior designer. Your task is to transform the provided image into the **Eco-style**. Preserve the existing geometry, layout, and furniture arrangement. Apply these style characteristics: **Key elements:** Abundance of natural materials and live plants. **Color Palette:** Natural, earthy tones: shades of green, brown, beige, sand, and white. **Materials:** Emphasize untreated wood, stone, cork, bamboo, and natural textiles like cotton, linen, and wool. **Lighting:** Maximize natural daylight. The mood is fresh, healthy, and connected to nature. Output ONLY the final, restyled image." },
    { key: 'brutalism', prompt: "You are an expert AI interior designer. Your task is to transform the provided image into the **Brutalism style**. Preserve the existing geometry, layout, and furniture arrangement. Apply these style characteristics: **Key elements:** Raw concrete, massive, blocky forms, exposed structural elements. **Color Palette:** A monochrome palette of gray shades from the concrete. Minimal color accents. **Materials:** Raw, unfinished concrete is dominant. Supplement with raw wood and metal. **Lighting:** Often dramatic, with light used to highlight the texture of the concrete. The mood is monumental, raw, and imposing. Output ONLY the final, restyled image." },
    { key: 'artDeco', prompt: "You are an expert AI interior designer. Your task is to transform the provided image into the **Art Deco style**. Preserve the existing geometry, layout, and furniture arrangement. Apply these style characteristics: **Key elements:** Bold geometric patterns, glamour, symmetry, luxury. **Color Palette:** Deep, rich colors (burgundy, navy, emerald green) contrasted with high-gloss black, gold, silver, and chrome. **Materials:** Use glossy lacquered wood, polished marble, brass, gold, and luxurious velvets. **Lighting:** Use geometric, statement light fixtures. The mood is glamorous, sophisticated, and dramatic. Output ONLY the final, restyled image." },
    { key: 'midCentury', prompt: "You are an expert AI interior designer. Your task is to transform the provided image into the **Mid-century modern style**. Preserve the existing geometry, layout, and furniture arrangement. Apply these style characteristics: **Key elements:** Clean lines, organic forms, integration with nature, functionality (circa 1950s-70s). **Color Palette:** A mix of earthy tones (olive green, mustard yellow, orange) with natural wood. **Materials:** Teak and walnut wood are prominent, combined with plastics, metal, and glass. Furniture has iconic tapered legs. **Lighting:** Sculptural, often metallic, light fixtures. The mood is functional, uncluttered, and retro-chic. Output ONLY the final, restyled image." },
    { key: 'fusion', prompt: "You are an expert AI interior designer. Your task is to transform the provided image into the **Fusion style**. Preserve the existing geometry, layout, and furniture arrangement. Apply these style characteristics: **Key elements:** A bold and harmonious mix of different styles, cultures, and eras. **Color Palette:** No strict rules; can be vibrant and eclectic or based on a connecting neutral color. **Materials:** An eclectic mix of textures and materials. The key is balance and creating a cohesive whole from disparate parts. **Lighting:** Varied lighting sources to highlight different zones and objects. The mood is artistic, individualistic, and dynamic. Output ONLY the final, restyled image." },
];

type StylizeMode = 'reference' | 'quick';

const StylizePanel: React.FC<StylizePanelProps> = ({ 
  onApplyStyle,
  onReferenceSelect,
  isLoading,
  referenceImage
}) => {
  const { t } = useTranslation();
  const [activeMode, setActiveMode] = useState<StylizeMode>('reference');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        onReferenceSelect(e.target.files[0]);
    }
  };

  const handleClearReference = () => {
    onReferenceSelect(null);
    const input = document.getElementById('style-reference-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  const ReferencePanel = () => (
     <div className="w-full flex flex-col items-center gap-4 animate-fade-in">
        <p className="text-md text-gray-400 text-center max-w-lg">
            {t('stylizePanel.reference.description')}
        </p>
        <div className="w-full max-w-md flex flex-col items-center gap-4 mt-2">
            <label htmlFor="style-reference-upload" className="styled-button" aria-disabled={isLoading}>
                <p><UploadIcon className="w-6 h-6" />
                {referenceImage ? t('stylizePanel.reference.changeButton') : t('stylizePanel.reference.uploadButton')}</p>
            </label>
            <input id="style-reference-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isLoading} />
            {referenceImage && (
                <div className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 px-3 py-1 rounded-full">
                    <span>{referenceImage.name}</span>
                    <button onClick={handleClearReference} className="font-bold text-red-400 hover:text-red-300">&times;</button>
                </div>
            )}
        </div>
        <div className="w-full max-w-sm mt-4">
            <button
                onClick={() => onApplyStyle()}
                className="styled-button"
                disabled={isLoading || !referenceImage}
            >
                <p>{t('stylizePanel.reference.applyButton')}</p>
            </button>
        </div>
    </div>
  );

  const QuickStylePanel = () => (
    <div className="w-full flex flex-col items-center gap-4 animate-fade-in">
        <p className="text-md text-gray-400 text-center max-w-lg">
            {t('stylizePanel.quick.description')}
        </p>
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-2">
            {quickStyles.map(style => (
                <button
                    key={style.key}
                    onClick={() => onApplyStyle(style.prompt)}
                    disabled={isLoading}
                    className="styled-button"
                >
                    <p>{t(`stylizePanel.quick.styles.${style.key}`)}</p>
                </button>
            ))}
        </div>
    </div>
  );

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-6 flex flex-col items-center gap-6 animate-fade-in backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center w-16 h-16 bg-gray-700/50 rounded-full border border-gray-600">
            <MagicWandIcon className="w-8 h-8 text-pink-400" />
        </div>
        <h3 className="text-xl font-bold text-center text-gray-100">{t('stylizePanel.title')}</h3>
      </div>
      
      <div className="w-full flex p-1 bg-gray-700/50 rounded-lg">
        <button
          onClick={() => setActiveMode('reference')}
          disabled={isLoading}
          className={`styled-button ${activeMode === 'reference' ? 'active' : ''}`}
        >
          <p>{t('stylizePanel.tabs.reference')}</p>
        </button>
        <button
          onClick={() => setActiveMode('quick')}
          disabled={isLoading}
          className={`styled-button ${activeMode === 'quick' ? 'active' : ''}`}
        >
          <p>{t('stylizePanel.tabs.quick')}</p>
        </button>
      </div>
      
      {activeMode === 'reference' ? <ReferencePanel /> : <QuickStylePanel />}
    </div>
  );
};

export default StylizePanel;

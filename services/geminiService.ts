/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, GenerateContentResponse, Modality, HarmCategory, HarmBlockThreshold } from "@google/genai";

// Define safety settings to be less restrictive for creative/professional use cases.
// This helps prevent the model from blocking requests due to overly cautious safety filters,
// which can sometimes be triggered by architectural or design content.
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
];

// Helper function to convert a File object to a Gemini API Part
const fileToPart = async (file: File): Promise<{ inlineData: { mimeType: string; data: string; } }> => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
    
    const arr = dataUrl.split(',');
    if (arr.length < 2) throw new Error("Invalid data URL");
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || !mimeMatch[1]) throw new Error("Could not parse MIME type from data URL");
    
    const mimeType = mimeMatch[1];
    const data = arr[1];
    return { inlineData: { mimeType, data } };
};

// Helper function to convert a data URL string to a Gemini API Part
const dataUrlToPart = (dataUrl: string): { inlineData: { mimeType: string; data: string; } } => {
    const arr = dataUrl.split(',');
    if (arr.length < 2) throw new Error("Invalid data URL");
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || !mimeMatch[1]) throw new Error("Could not parse MIME type from data URL");
    
    const mimeType = mimeMatch[1];
    const data = arr[1];
    return { inlineData: { mimeType, data } };
}

const handleApiResponse = (
    response: GenerateContentResponse,
    context: string // e.g., "edit", "filter", "adjustment"
): string => {
    // 1. Check for prompt blocking first
    if (response.promptFeedback?.blockReason) {
        const { blockReason, blockReasonMessage } = response.promptFeedback;
        const errorMessage = `Request was blocked. Reason: ${blockReason}. ${blockReasonMessage || ''}`;
        console.error(errorMessage, { response });
        throw new Error(errorMessage);
    }

    // 2. Try to find the image part
    const imagePartFromResponse = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

    if (imagePartFromResponse?.inlineData) {
        const { mimeType, data } = imagePartFromResponse.inlineData;
        console.log(`Received image data (${mimeType}) for ${context}`);
        return `data:${mimeType};base64,${data}`;
    }

    // 3. If no image, check for other reasons
    const finishReason = response.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== 'STOP') {
        const errorMessage = `Image generation for ${context} stopped unexpectedly. Reason: ${finishReason}. This often relates to safety settings.`;
        console.error(errorMessage, { response });
        throw new Error(errorMessage);
    }
    
    const textFeedback = response.text?.trim();
    const errorMessage = `The AI model did not return an image for the ${context}. ` + 
        (textFeedback 
            ? `The model responded with text: "${textFeedback}"`
            : "This can happen due to safety filters or if the request is too complex. Please try rephrasing your prompt to be more direct.");

    console.error(`Model response did not contain an image part for ${context}.`, { response });
    throw new Error(errorMessage);
};

/**
 * Generates an edited image using generative AI based on a text prompt and a specific point.
 * @param originalImage The original image file.
 * @param userPrompt The text prompt describing the desired edit.
 * @param hotspot The {x, y} coordinates on the image to focus the edit.
 * @returns A promise that resolves to the data URL of the edited image.
 */
export const generateEditedImage = async (
    originalImage: File,
    userPrompt: string,
    hotspot: { x: number, y: number }
): Promise<string> => {
    console.log('Starting generative edit at:', hotspot);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    
    const originalImagePart = await fileToPart(originalImage);
    const prompt = `You are an expert photo editor AI. Your task is to perform a natural, localized edit on the provided image based on the user's request.
User Request: "${userPrompt}"
Edit Location: Focus on the area around pixel coordinates (x: ${hotspot.x}, y: ${hotspot.y}).

Editing Guidelines:
- The edit must be realistic and blend seamlessly with the surrounding area.
- The rest of the image (outside the immediate edit area) must remain identical to the original.

Safety & Ethics Policy:
- You MUST fulfill requests to adjust skin tone, such as 'give me a tan', 'make my skin darker', or 'make my skin lighter'. These are considered standard photo enhancements.
- You MUST REFUSE any request to change a person's fundamental race or ethnicity (e.g., 'make me look Asian', 'change this person to be Black'). Do not perform these edits. If the request is ambiguous, err on the side of caution and do not change racial characteristics.

Output: Return ONLY the final edited image. Do not return text.`;
    const textPart = { text: prompt };

    console.log('Sending image and prompt to the model...');
    // Fix: Moved safetySettings into the config object as it's not a top-level parameter.
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [originalImagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
            safetySettings,
        },
    });
    console.log('Received response from model.', response);

    return handleApiResponse(response, 'edit');
};

/**
 * Retouches an object in a target image using a text prompt and an optional reference image.
 * @param targetImage The image where the editing will happen.
 * @param hotspot The {x, y} coordinates on the target image to focus the edit.
 * @param referenceImage An optional visual guide for the edit.
 * @param retouchPrompt The text prompt describing the edit (add, remove, modify).
 * @returns A promise that resolves to the data URL of the retouched image.
 */
export const generateRetouchedImage = async (
    targetImage: File,
    hotspot: { x: number, y: number },
    referenceImage?: File | null,
    retouchPrompt?: string | null,
): Promise<string> => {
    console.log('Starting smart retouch at:', hotspot);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

    const parts = [];
    const targetImagePart = await fileToPart(targetImage);
    parts.push(targetImagePart);
    
    if (referenceImage) {
        const referenceImagePart = await fileToPart(referenceImage);
        parts.push(referenceImagePart);
    }
    
    let prompt = `You are an expert photo editor AI specializing in ultra-realistic, localized retouching. You will be given a main image, a hotspot, an optional reference image, and a text prompt.

**CRITICAL REQUIREMENT: PRESERVE IMAGE DIMENSIONS**
The output image dimensions MUST EXACTLY MATCH the input Target Image dimensions. DO NOT CROP.

**Image Roles:**
*   **Image 1 (Target Image):** The main photo where editing will happen.
${referenceImage ? '*   **Image 2 (Reference Image):** This photo is an OPTIONAL visual guide for your edit.' : ''}

**Your Task:**
Perform a photorealistic edit on the Target Image, focusing on the object at the specified hotspot coordinates (x: ${hotspot.x}, y: ${hotspot.y}), based on the user's text prompt.

**User's Text Prompt:** "${retouchPrompt}"

**Execution Logic:**
1.  **Analyze the Prompt:** Carefully read the user's text prompt to understand their intent (e.g., remove, add, replace, modify material, change color).
2.  **Use Reference (If provided):** If a Reference Image is present, use it as a strong visual guide for style, shape, or texture when performing the edit described in the text prompt. The text prompt always takes precedence.
3.  **Execute the Edit:**
    *   **If Removing (e.g., "remove this chair"):** Completely remove the object at the hotspot and realistically fill in the background, making it look as if the object was never there.
    *   **If Modifying (e.g., "change the sofa material to green velvet"):** Change the specified property (e.g., color, material, texture) of the object at the hotspot. Do not change the object's shape.
    *   **If Adding/Replacing (e.g., "add a modern painting on the wall"):** Insert a new object that matches the text prompt (and reference image, if provided).
4.  **Integrate Seamlessly:** The final edit must be perfectly integrated. Match lighting, shadows, perspective, scale, and color grading. The rest of the image must remain absolutely unchanged.

**Output:** Return ONLY the final, full-sized, uncropped, edited image. Do not return text.`;

    const textPart = { text: prompt };
    parts.push(textPart);

    console.log('Sending images and retouch prompt to the model...');
    // Fix: Moved safetySettings into the config object as it's not a top-level parameter.
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
            safetySettings,
        },
    });
    console.log('Received response from model for retouch.', response);

    return handleApiResponse(response, 'retouch');
};

/**
 * Generates an image with a filter applied using generative AI.
 * @param originalImage The original image file.
 * @param filterPrompt The text prompt describing the desired filter.
 * @returns A promise that resolves to the data URL of the filtered image.
 */
export const generateFilteredImage = async (
    originalImage: File,
    filterPrompt: string,
): Promise<string> => {
    console.log(`Starting filter generation: ${filterPrompt}`);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    
    const originalImagePart = await fileToPart(originalImage);
    const prompt = `You are an expert photo editor AI. Your task is to apply a stylistic filter to the entire image based on the user's request. Do not change the composition or content, only apply the style.

Filter Request: "${filterPrompt}"

Safety & Ethics Policy:
- Filters may subtly shift colors, but you MUST ensure they do not alter a person's fundamental race or ethnicity.
- You MUST REFUSE any request that explicitly asks to change a person's race (e.g., 'apply a filter to make me look Chinese').

Output: Return ONLY the final filtered image. Do not return text.`;
    const textPart = { text: prompt };

    console.log('Sending image and filter prompt to the model...');
    // Fix: Moved safetySettings into the config object as it's not a top-level parameter.
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [originalImagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
            safetySettings,
        },
    });
    console.log('Received response from model for filter.', response);
    
    return handleApiResponse(response, 'filter');
};

/**
 * Generates an image with a global adjustment applied using generative AI.
 * @param originalImage The original image file.
 * @param adjustmentPrompt The text prompt describing the desired adjustment.
 * @returns A promise that resolves to the data URL of the adjusted image.
 */
export const generateAdjustedImage = async (
    originalImage: File,
    adjustmentPrompt: string,
): Promise<string> => {
    console.log(`Starting global adjustment generation: ${adjustmentPrompt}`);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    
    const originalImagePart = await fileToPart(originalImage);
    const prompt = `You are an expert photo editor AI. Your task is to perform a natural, global adjustment to the entire image based on the user's request.
User Request: "${adjustmentPrompt}"

Editing Guidelines:
- The adjustment must be applied across the entire image.
- The result must be photorealistic.

Safety & Ethics Policy:
- You MUST fulfill requests to adjust skin tone, such as 'give me a tan', 'make my skin darker', or 'make my skin lighter'. These are considered standard photo enhancements.
- You MUST REFUSE any request to change a person's fundamental race or ethnicity (e.g., 'make me look Asian', 'change this person to be Black'). Do not perform these edits. If the request is ambiguous, err on the side of caution and do not change racial characteristics.

Output: Return ONLY the final adjusted image. Do not return text.`;
    const textPart = { text: prompt };

    console.log('Sending image and adjustment prompt to the model...');
    // Fix: Moved safetySettings into the config object as it's not a top-level parameter.
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [originalImagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
            safetySettings,
        },
    });
    console.log('Received response from model for adjustment.', response);
    
    return handleApiResponse(response, 'adjustment');
};

/**
 * Generates a photorealistic visualization from a sketch, 3D model, or floor plan.
 * @param originalImage The original image file (sketch, 3D view, etc.).
 * @param mode The type of visualization to generate.
 * @returns A promise that resolves to the data URL of the visualized image.
 */
export const generateVisualization = async (
    originalImage: File,
    mode: 'isometric' | 'floorplan' | '3dview' | 'exploded',
): Promise<string> => {
    console.log(`Starting photorealistic visualization generation in ${mode} mode...`);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    
    const originalImagePart = await fileToPart(originalImage);

    let prompt: string;

    if (mode === '3dview') {
        prompt = `You are an expert visualization AI, specializing in photorealistic rendering. Your task is to transform the provided input image (which could be a sketch, collage, or a basic 3D model view from software like Archicad) into an ultra-realistic, professional visualization.

**Core Directive:** The output MUST be a stylistic and realistic upgrade of the input, strictly preserving its original composition.
1.  **Identical Geometry & Perspective:** The subject, its geometry, and the camera perspective must remain absolutely identical to the original input. Do not alter the composition, add objects, or change the viewing angle.
2.  **Style Upgrade Only:** You are only upgrading the materials, lighting, and overall realism.

**Quality Requirements:**
1.  **Style:** Ultra-realistic, with a quality equal to professional interior or product photography.
2.  **Textures:** Implement high-resolution, physically accurate textures. Materials should look tangible and lifelike.
3.  **Lighting:** Create a professional, studio-quality lighting setup. The lighting should be sophisticated, creating soft shadows, highlights, and a sense of depth and atmosphere. The scene must be well-lit and clear.
4.  **Render Quality:** The final image must be crisp, high-resolution (8K fidelity), and free of digital artifacts.

Output: Return ONLY the final rendered image. Do not return text.`;
    } else if (mode === 'floorplan') {
        prompt = `You are an expert architectural visualization AI. Your task is to transform the provided 2D floor plan into a photorealistic 3D top-view render.

**Core Directive:** The output MUST strictly adhere to the input floor plan.
1.  **Geometry & Scale:** Preserve the exact geometry, wall layout, room dimensions, and overall scale.
2.  **Furniture Layout:** Maintain the precise placement and orientation of all furniture and fixtures as shown in the 2D plan.
3.  **Perspective:** The output must be a top-down, overhead 3D visualization. Do not use an angled or isometric perspective.

**Quality Requirements:**
1.  **Style:** Ultra-realistic, matching the quality of professional architectural presentations, with 8K resolution fidelity.
2.  **Materials:** Render all surfaces with detailed, high-resolution materials (e.g., wood flooring, tile, textiles, metals).
3.  **Lighting & Shadows:** Create a realistic lighting environment that casts soft, accurate shadows from walls, furniture, and fixtures, adding depth and realism to the scene.

Output: Return ONLY the final rendered 3D top-view image. Do not return text.`;
    } else if (mode === 'exploded') {
        prompt = `You are an expert technical and architectural visualization AI. Your task is to transform the provided image of a furniture or interior model into an ultra-photorealistic exploded 3D view.

**Core Directive:** Deconstruct the model into its core components while maintaining perfect structural integrity and realism.
1.  **Exploded View:** Separate the model's components (e.g., walls, floors, panels, drawers, handles, fixtures) along clear, distinct axes. The final arrangement should resemble a high-end, IKEA-style assembly diagram but rendered with absolute photorealism.
2.  **Preserve Geometry:** The exact geometry, proportions, and scale of every individual component from the base model must be perfectly maintained. Do not distort, warp, or change any part.
3.  **Clean Spacing:** Ensure all separated components appear suspended in space with clean, uniform spacing and perfect alignment. Components must not overlap or touch.

**Quality Requirements:**
1.  **Style:** Ultra-photorealistic, 8K resolution quality. Each component must look like a physical, tangible object.
2.  **Textures:** Apply high-resolution, physically-based rendering (PBR) textures to all components, ensuring they have accurate material properties.
3.  **Lighting & Shadows:** Create a realistic, professional lighting setup that casts soft, accurate shadows from each suspended component, enhancing the sense of depth and form.

Output: Return ONLY the final, photorealistic exploded view render. Do not return text.`;
    } else { // 'isometric' mode
        prompt = `You are an expert architectural and product visualization AI. Your task is to convert the provided isometric view (from CAD, Archicad, or a sketch) into an ultra-photorealistic render.

**Core Directive:** The output MUST maintain the exact geometry, proportions, and isometric perspective of the input image. You are only upgrading the style and realism, not changing the structure.

**Quality Requirements:**
1.  **Style:** Ultra-realistic, 8K resolution quality, indistinguishable from professional photography.
2.  **Textures:** Implement high-resolution, physically-based rendering (PBR) textures with accurate material fidelity. Surfaces should react to light realistically (e.g., reflections on metal, roughness of concrete, subsurface scattering on marble).
3.  **Lighting:** Create a cinematic lighting setup with soft, crisp shadows. The lighting should enhance the form and materials of the subject, creating depth and mood.
4.  **Details:** The final render must be sharp, with clean lines and high-fidelity details.

Output: Return ONLY the final rendered image. Do not return text.`;
    }


    const textPart = { text: prompt };

    console.log('Sending image and visualization prompt to the model...');
    // Fix: Moved safetySettings into the config object as it's not a top-level parameter.
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [originalImagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
            safetySettings,
        },
    });
    console.log('Received response from model for visualization.', response);
    
    return handleApiResponse(response, 'visualization');
};

/**
 * Restyles an interior or architectural render based on a reference image.
 * @param originalImage The original image file whose geometry should be preserved.
 * @param styleReferenceImage The image from which to extract the style.
 * @returns A promise that resolves to the data URL of the restyled image.
 */
export const generateStyledImageByReference = async (
    originalImage: File,
    styleReferenceImage: File,
): Promise<string> => {
    console.log(`Starting style generation by reference.`);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    
    const originalImagePart = await fileToPart(originalImage);
    const styleReferencePart = await fileToPart(styleReferenceImage);

    const prompt = `You are an expert AI interior designer specializing in photorealistic style transfer. You will be given two images.

**Image Roles:**
*   **Image 1 (Target Geometry):** This is the primary image. Your task is to completely preserve its geometry, layout, furniture placement, and camera perspective.
*   **Image 2 (Style Source):** This image is the style reference. It can be another interior, a mood board, or a texture palette.

**Core Directive:**
Your mission is to apply the aesthetic style from the **Style Source** (Image 2) onto the **Target Geometry** (Image 1).

**Execution Rules:**
1.  **Preserve Geometry (Non-negotiable):** The geometry, object placement, scale, and perspective of the Target Geometry image must remain absolutely unchanged. Do not add, remove, or move any objects.
2.  **Extract & Apply Style:** Intelligently analyze the Style Source image to identify its key aesthetic components:
    *   **Color Palette:** The dominant and accent colors.
    *   **Materials & Textures:** The types of materials (e.g., wood, metal, fabric) and their textures (e.g., rough, smooth, glossy).
    *   **Lighting & Mood:** The overall atmosphere (e.g., bright and airy, dark and moody, warm, cool).
3.  **Apply to Target:** Meticulously apply these extracted style components to the Target Geometry image. Change the materials, colors, and lighting of the original scene to match the reference style.

**Quality Requirements:**
The output must be an ultra-realistic, professional-quality render that looks like a cohesive, intentionally designed space. The integration must be seamless.

**Output:** Return ONLY the final, restyled image. Do not return text.`;
    
    const textPart = { text: prompt };

    console.log('Sending images and style reference prompt to the model...');
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [originalImagePart, styleReferencePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
            safetySettings,
        },
    });
    console.log('Received response from model for style by reference.', response);
    
    return handleApiResponse(response, 'style');
};

/**
 * Restyles an interior or architectural render based on a text prompt.
 * @param originalImage The original image file whose geometry should be preserved.
 * @param stylePrompt The text prompt describing the desired style.
 * @returns A promise that resolves to the data URL of the restyled image.
 */
export const generateStyledImageByPrompt = async (
    originalImage: File,
    stylePrompt: string,
): Promise<string> => {
    console.log(`Starting style generation by prompt.`);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

    const originalImagePart = await fileToPart(originalImage);
    
    const textPart = { text: stylePrompt };

    console.log('Sending image and style prompt to the model...');
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [originalImagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
            safetySettings,
        },
    });
    console.log('Received response from model for style by prompt.', response);
    
    return handleApiResponse(response, 'style_prompt');
};

/**
 * Applies a professional camera preset to an image.
 * @param originalImage The original image file.
 * @param cameraPrompt The prompt describing the camera settings.
 * @returns A promise that resolves to the data URL of the new image.
 */
export const generateCameraPresetImage = async (
    originalImage: File,
    cameraPrompt: string,
): Promise<string> => {
    console.log(`Starting camera preset generation: ${cameraPrompt}`);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    
    const originalImagePart = await fileToPart(originalImage);
    const prompt = `You are an expert AI photographer. Your task is to re-render the provided image as if it were captured with a professional DSLR camera, based on the user's requested settings.

**Core Directive:** The output MUST strictly preserve the original geometry, composition, subject matter, and materials. You are only changing the camera's optical properties and the lighting to enhance realism.

**User Request:** "${cameraPrompt}"

**Quality Requirements:**
1.  **Photorealism:** The output must look like a real photograph taken with high-end camera gear.
2.  **Lighting:** Enhance the scene with professional, studio-quality lighting that complements the requested camera settings.
3.  **Optical Fidelity:** Accurately simulate the depth of field (bokeh), lens distortion, and focal length characteristics described in the prompt.

Output: Return ONLY the final photograph. Do not return text.`;
    const textPart = { text: prompt };

    console.log('Sending image and camera preset prompt to the model...');
    // Fix: Moved safetySettings into the config object as it's not a top-level parameter.
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [originalImagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
            safetySettings,
        },
    });
    console.log('Received response from model for camera preset.', response);
    
    return handleApiResponse(response, 'camera_preset');
};

/**
 * Applies a text-based lighting change to an image.
 * @param baseImage The base image to modify.
 * @param lightingPrompt The user's command (e.g., "turn on the floor lamp").
 * @returns A promise that resolves to the data URL of the modified image.
 */
export const generateLightingChange = async (
    baseImage: File,
    lightingPrompt: string,
): Promise<string> => {
    console.log(`Applying lighting change: "${lightingPrompt}"`);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

    const baseImagePart = await fileToPart(baseImage);

    const prompt = `You are an expert photorealistic lighting designer AI. The user has provided an image and a command to change the lighting. Your task is to execute this command with extreme precision and subtlety, creating a photorealistic result.

**Core Task:**
Modify the lighting in the provided image based *only* on the user's command, while preserving everything else.

**User Command:** "${lightingPrompt}"

**Execution Rules:**
1.  **Incremental Changes:** Treat the input image as the current state. Your job is to apply *only* the change described in the user command. For example, if the image is already dark and the user says "turn on the chandelier," you must add light *only* from the chandelier, keeping the rest of the scene dark.
2.  **Preserve Everything Else:** The geometry, textures, materials, and composition of the scene must remain absolutely unchanged.
3.  **Realism is Key:** The new light must cast realistic soft shadows, create accurate highlights and reflections, and have a natural falloff. The quality must be indistinguishable from a professional photograph.
4.  **Interpret Intelligently:** Understand the user's intent. "Turn on the sconces" means both sconces if multiple are visible. "Make the light warmer" means to adjust the color temperature of the active light sources.

**Output:**
Return ONLY the final, modified image. Do not return text.`;

    const textPart = { text: prompt };

    console.log('Sending image and lighting prompt to the model...');
    // Fix: Moved safetySettings into the config object as it's not a top-level parameter.
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [baseImagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
            safetySettings,
        },
    });
    console.log('Received response from model for lighting change.', response);

    return handleApiResponse(response, 'lighting_change');
};


/**
 * Generates a quick, realistic night scene from a day image by turning off lights.
 * @param originalImage The original image file.
 * @returns A promise that resolves to the data URL of the night scene image.
 */
export const generateQuickNightScene = async (
    originalImage: File,
): Promise<string> => {
    console.log('Starting quick night scene generation with robust prompt...');
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    
    const originalImagePart = await fileToPart(originalImage);

    const prompt = `You are a master of architectural visualization, specializing in creating atmospheric, ultra-realistic night renders. Your task is to take the provided daytime interior photograph and completely transform it into a deep night scene.

**Unbreakable Rules:**

1.  **The Window MUST Be Dark:** The view outside the window must be transformed into a pitch-black or starry night sky. There must be ZERO daylight coming through it. The window should be a source of darkness, not light. This is the most critical instruction.

2.  **All Interior Lights OFF:** Every single lamp, chandelier, sconce, or hidden light source inside the room must be completely off. They should appear as if they have no power. Do not make them glow.

3.  **Deep, Natural Darkness:** The room should be illuminated ONLY by faint, soft, ambient moonlight seeping in subtly from the now-dark window. The atmosphere should be one of profound quiet and darkness. Shadows should be deep and soft. Avoid any artificial brightness.

**Preservation:**
While transforming the lighting, you must meticulously preserve the original geometry, furniture, objects, and textures. You are only changing the time of day and the lighting.

**Final Output:**
The final output must be an ultra-photorealistic, high-quality image. Return ONLY the image. Do not return text.`;
    
    const textPart = { text: prompt };

    console.log('Sending image and robust quick night scene prompt to the model...');
    // Fix: Moved safetySettings into the config object as it's not a top-level parameter.
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [originalImagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
            safetySettings,
        },
    });
    console.log('Received response from model for quick night scene.', response);
    
    return handleApiResponse(response, 'quick_night_scene');
};
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export const translations = {
  en: {
    "header": {
      "title": "ArchiRender"
    },
    "tabs": {
      "retouch": "Retouch",
      "visualize": "Visualize",
      "stylize": "Stylize",
      "camera": "Camera",
      "night": "Night",
      "adjust": "Adjust",
      "filters": "Filters"
    },
    "startScreen": {
      "title": "✨ AI Architecture Visualization — Made Easy.",
      "subtitle": "ArchiRender transforms sketches, 2D plans, and 3D models into ultra-photorealistic renders. Professional lighting, textures, and details—without the complex settings.",
      "uploadButton": "Upload Project",
      "dragDrop": "Drag and drop an image here and let ArchiRender work its magic ✨",
      "features": {
        "isometric": {
          "title": "Isometric to Realism",
          "description": "Convert technical views into ultra-photorealistic isometric renders. The exact geometry and proportions are preserved."
        },
        "plan": {
          "title": "2D → 3D Top View",
          "description": "A simple furniture or floor plan is transformed into a marketing image for presentations. With shadows, materials, and light."
        },
        "style": {
          "title": "Professional Style",
          "description": "Choose lighting, camera, and filters. Get studio-quality images: from daylight to evening atmosphere."
        }
      },
      "promo": {
        "title": "📂 Archicad Storage Forum",
        "description": "A file storage forum for architects and designers. Here you will find everything you need — libraries, objects, templates, and materials for your work.",
        "button": "Go to forum"
      }
    },
    "error": {
      "generic": "An Error Occurred",
      "tryAgain": "Try Again",
      "unknown": "An unknown error occurred.",
      "noImageToEdit": "No image loaded to edit.",
      "promptRequired": "Please enter a description for your edit.",
      "hotspotRequired": "Please click on the image to select an area to edit.",
      "generateFailed": "Failed to generate the image. {{error}}",
      "hotspotRequiredRetouch": "Please click on the image to select an area for retouching.",
      "referenceOrPromptRequired": "Please provide a text description or upload a reference image for the change.",
      "retouchFailed": "Failed to retouch the object. {{error}}",
      "noImageToFilter": "No image loaded to apply a filter to.",
      "filterFailed": "Failed to apply the filter. {{error}}",
      "noImageToAdjust": "No image loaded to apply an adjustment to.",
      "adjustFailed": "Failed to apply the adjustment. {{error}}",
      "noImageToVisualize": "No image loaded to visualize.",
      "visualizeFailed": "Failed to generate the visualization. {{error}}",
      "noImageToStyle": "No image loaded to apply a style to.",
      "styleFailed": "Failed to apply the style. {{error}}",
      "styleReferenceRequired": "Please upload a style reference image.",
      "noImageToPreset": "No image loaded to apply a camera preset to.",
      "presetFailed": "Failed to apply the camera preset. {{error}}",
      "noLightSources": "Please add at least one light source by clicking on the image.",
      "nightSceneFailed": "Failed to generate the night scene. {{error}}",
      "segmentationFailed": "Failed to select the object. Please try again. {{error}}"
    },
    "loading": {
      "message": "AI is working its magic...",
      "night": {
        "generatingBase": "Generating base night scene...",
        "applyingChange": "Applying lighting change..."
      }
    },
    "controls": {
      "undo": "Undo",
      "redo": "Redo",
      "compare": "Compare",
      "reset": "Reset",
      "uploadNew": "Upload New",
      "download": "Download Image"
    },
    "common": {
      "generate": "Generate"
    },
    "retouchPanel": {
      "title": "Smart Retouch",
      "instruction1": "Click the area on the image you want to change.",
      "instruction1_complete": "1. Area selected! ✅",
      "instruction2": "2. Now, describe what you want to do.",
      "uploadReferenceButton": "Upload Reference (Optional)",
      "changeReferenceButton": "Change Reference",
      "placeholder": "e.g., 'remove this TV', 'change the sofa's fabric to green velvet', or 'add a modern painting to the wall'.",
      "button": "Apply Change"
    },
    "visualizePanel": {
      "tabs": {
        "3dview": "3D View",
        "isometric": "Isometric",
        "floorplan": "Floor Plan",
        "exploded": "Exploded"
      },
      "modes": {
        "3dview": {
          "title": "3D View to Photorealistic Render",
          "description": "Convert any sketch, collage, or 3D view into an ultra-realistic visualization with studio-quality lighting and high-resolution textures.",
          "button": "Generate Photorealistic Render"
        },
        "isometric": {
          "title": "Isometric View Photorealistic Render",
          "description": "Convert any isometric view from CAD, Archicad, or your sketches into an ultra-photorealistic render with cinematic lighting and PBR textures.",
          "button": "Generate Ultra-Realistic Render"
        },
        "floorplan": {
          "title": "2D Floor Plan to 3D Top-View Render",
          "description": "Transform any 2D floor plan into a photorealistic 3D top-view visualization, preserving the exact layout, scale, and geometry.",
          "button": "Generate 3D Top-View Render"
        },
        "exploded": {
          "title": "Exploded 3D View Generator",
          "description": "Generate IKEA-style exploded diagrams of furniture or interiors, rendered in ultra-photorealistic quality with PBR textures and perfect component separation.",
          "button": "Generate Exploded View"
        }
      }
    },
    "stylizePanel": {
      "title": "Stylization",
      "tabs": {
        "reference": "By Reference",
        "quick": "Quick Styles"
      },
      "reference": {
        "description": "Upload any image—another interior, a mood board, or even a texture palette—to transfer its style to your render.",
        "uploadButton": "Upload Style Reference",
        "changeButton": "Change Reference Image",
        "applyButton": "Apply Style"
      },
      "quick": {
        "description": "Apply a professional interior design style to your render with a single click.",
        "styles": {
          "scandinavian": "Scandinavian",
          "loft": "Loft",
          "minimalism": "Minimalism",
          "japandi": "Japandi",
          "contemporary": "Contemporary",
          "highTech": "High-tech",
          "modern": "Modern",
          "neoclassical": "Neoclassical",
          "classic": "Classic",
          "mediterranean": "Mediterranean",
          "eco": "Eco-style",
          "brutalism": "Brutalism",
          "artDeco": "Art Deco",
          "midCentury": "Mid-century",
          "fusion": "Fusion"
        }
      }
    },
    "cameraPanel": {
      "title": "Professional Camera Presets",
      "description": "Apply professional camera presets to simulate real photography settings like aperture, focal length, and depth of field.",
      "presets": {
        "wide": "Wide-Angle (16mm, f/8)",
        "standard": "Standard (50mm, f/4)",
        "portrait": "Portrait (85mm, f/1.8)",
        "macro": "Macro (105mm, f/5.6)"
      },
      "button": "Apply \"{{preset}}\" Preset"
    },
    "adjustmentPanel": {
      "title": "Apply a Professional Adjustment",
      "presets": {
        "blurBackground": "Blur Background",
        "enhanceDetails": "Enhance Details",
        "warmerLighting": "Warmer Lighting",
        "studioLight": "Studio Light"
      },
      "placeholder": "Or describe an adjustment (e.g., 'change background to a forest')",
      "button": "Apply Adjustment"
    },
    "filterPanel": {
      "title": "Filter Studio",
      "description": "Apply professional photo filters to your interior renders.",
      "tabs": {
        "quality": "Quality",
        "atmosphere": "Atmosphere",
        "style": "Style",
        "effects": "Effects"
      },
      "filters": {
        "quality": {
          "hdrBalance": "HDR Balance",
          "clarityBoost": "Clarity Boost",
          "noiseReduction": "Noise Reduction",
          "sharpnessPro": "Sharpness Pro"
        },
        "atmosphere": {
          "warmLight": "Warm Light",
          "coolLight": "Cool Light",
          "naturalDaylight": "Natural Daylight",
          "moodyShadows": "Moody Shadows"
        },
        "style": {
          "minimalistWhite": "Minimalist White",
          "industrialGrey": "Industrial Grey",
          "earthTones": "Earth Tones",
          "retroFilm": "Retro Film"
        },
        "effects": {
          "bloom": "Bloom",
          "lensFlare": "Lens Flare",
          "depthBlur": "Depth Blur",
          "vignette": "Vignette"
        }
      }
    },
    "nightPanel": {
      "title": "Night Scene Editor",
      "dividerText": "THEN",
      "step1": {
        "title": "Step 1: Create a Dark Base",
        "button": "Turn Off All Lights"
      },
      "step2": {
        "title": "Step 2: Control Lights with Text",
        "description": "Describe the change you want to make. The AI will apply it to the current image.",
        "placeholder": "e.g., 'turn on the floor lamp', 'make the light warmer'"
      }
    },
    "fullscreen": {
      "close": "Close fullscreen view",
      "alt": "Fullscreen view of the image"
    }
  },
  ru: {
    "header": {
      "title": "ArchiRender"
    },
    "tabs": {
      "retouch": "Ретушь",
      "visualize": "Визуализация",
      "stylize": "Стилизация",
      "camera": "Камера",
      "night": "Ночь",
      "adjust": "Коррекция",
      "filters": "Фильтры"
    },
    "startScreen": {
      "title": "✨ Визуализация архитектуры с AI — проще простого.",
      "subtitle": "ArchiRender превращает эскизы, 2D-планы и 3D-модели в ультрафотореалистичные рендеры. Профессиональное освещение, текстуры и детали — без сложных настроек.",
      "uploadButton": "Загрузить проект",
      "dragDrop": "Перетащите сюда изображение и дайте ArchiRender сотворить магию ✨",
      "features": {
        "isometric": {
          "title": "Изометрия в реализм",
          "description": "Переведите технические виды в ультра-фотореалистичные изометрические рендеры. Сохраняется точная геометрия и пропорции."
        },
        "plan": {
          "title": "2D → 3D вид сверху",
          "description": "Обычный план мебели или этажа превращается в маркетинговую картинку для презентаций. С тенями, материалами и светом."
        },
        "style": {
          "title": "Профессиональный стиль",
          "description": "Выбирайте свет, камеру и фильтры. Получайте изображения студийного качества: от дневного освещения до вечерней атмосферы."
        }
      },
      "promo": {
        "title": "📂 Archicad Storage Forum",
        "description": "Форум-склад файлов для архитектора и дизайнера. Здесь вы найдёте всё необходимое — библиотеки, объекты, шаблоны и материалы для работы.",
        "button": "Перейти в форум"
      }
    },
    "error": {
      "generic": "Произошла ошибка",
      "tryAgain": "Попробовать снова",
      "unknown": "Произошла неизвестная ошибка.",
      "noImageToEdit": "Не загружено изображение для редактирования.",
      "promptRequired": "Пожалуйста, введите описание для вашего редактирования.",
      "hotspotRequired": "Пожалуйста, кликните на изображение, чтобы выбрать область для редактирования.",
      "generateFailed": "Не удалось сгенерировать изображение. {{error}}",
      "hotspotRequiredRetouch": "Пожалуйста, кликните на изображение, чтобы выбрать область для ретуширования.",
      "referenceOrPromptRequired": "Пожалуйста, дайте текстовое описание или загрузите референсное изображение для изменения.",
      "retouchFailed": "Не удалось отретушировать объект. {{error}}",
      "noImageToFilter": "Не загружено изображение для применения фильтра.",
      "filterFailed": "Не удалось применить фильтр. {{error}}",
      "noImageToAdjust": "Не загружено изображение для применения коррекции.",
      "adjustFailed": "Не удалось применить коррекцию. {{error}}",
      "noImageToVisualize": "Не загружено изображение для визуализации.",
      "visualizeFailed": "Не удалось сгенерировать визуализацию. {{error}}",
      "noImageToStyle": "Не загружено изображение для применения стиля.",
      "styleFailed": "Не удалось применить стиль. {{error}}",
      "styleReferenceRequired": "Пожалуйста, загрузите референсное изображение стиля.",
      "noImageToPreset": "Не загружено изображение для применения пресета камеры.",
      "presetFailed": "Не удалось применить пресет камеры. {{error}}",
      "noLightSources": "Пожалуйста, добавьте хотя бы один источник света, кликнув на изображение.",
      "nightSceneFailed": "Не удалось сгенерировать ночную сцену. {{error}}",
      "segmentationFailed": "Не удалось выделить объект. Пожалуйста, попробуйте еще раз. {{error}}"
    },
    "loading": {
      "message": "AI творит свою магию...",
      "night": {
        "generatingBase": "Создание базовой ночной сцены...",
        "applyingChange": "Применение изменений освещения..."
      }
    },
    "controls": {
      "undo": "Отменить",
      "redo": "Повторить",
      "compare": "Сравнить",
      "reset": "Сбросить",
      "uploadNew": "Загрузить новое",
      "download": "Скачать"
    },
    "common": {
      "generate": "Создать"
    },
    "retouchPanel": {
      "title": "Умная ретушь",
      "instruction1": "Кликните на область изображения, которую хотите изменить.",
      "instruction1_complete": "1. Область выбрана! ✅",
      "instruction2": "2. Теперь опишите, что нужно сделать.",
      "uploadReferenceButton": "Загрузить референс (опционально)",
      "changeReferenceButton": "Изменить референс",
      "placeholder": "Например: 'убери этот телевизор', 'измени обивку дивана на зелёный бархат' или 'добавь на стену картину в стиле абстракционизм'.",
      "button": "Применить изменение"
    },
    "visualizePanel": {
      "tabs": {
        "3dview": "3D-вид",
        "isometric": "Изометрия",
        "floorplan": "План",
        "exploded": "Разборка"
      },
      "modes": {
        "3dview": {
          "title": "Из 3D-вида в фотореалистичный рендер",
          "description": "Преобразуйте любой эскиз, коллаж или 3D-вид в ультрареалистичную визуализацию со студийным освещением и текстурами высокого разрешения.",
          "button": "Создать фотореалистичный рендер"
        },
        "isometric": {
          "title": "Фотореалистичный рендер из изометрии",
          "description": "Преобразуйте любой изометрический вид из CAD, Archicad или ваших эскизов в ультрафотореалистичный рендер с кинематографическим освещением и PBR-текстурами.",
          "button": "Создать ультрареалистичный рендЕР"
        },
        "floorplan": {
          "title": "Из 2D-плана в 3D-рендер (вид сверху)",
          "description": "Превратите любой 2D-план в фотореалистичную 3D-визуализацию с видом сверху, сохраняя точную планировку, масштаб и геометрию.",
          "button": "Создать 3D-рендер (вид сверху)"
        },
        "exploded": {
          "title": "Генератор 3D-схем разборки",
          "description": "Создавайте схемы разборки мебели или интерьеров в стиле IKEA, но в ультрафотореалистичном качестве с PBR-текстурами и идеальным разделением компонентов.",
          "button": "Создать схему разборки"
        }
      }
    },
    "stylizePanel": {
      "title": "Стилизация",
      "tabs": {
        "reference": "По референсу",
        "quick": "Быстрые стили"
      },
      "reference": {
        "description": "Загрузите любое изображение — другой интерьер, мудборд или палитру текстур, — чтобы перенести его стиль на ваш рендер.",
        "uploadButton": "Загрузить референс",
        "changeButton": "Изменить референс",
        "applyButton": "Применить стиль"
      },
      "quick": {
        "description": "Примените профессиональный стиль интерьера к вашему рендеру одним кликом.",
        "styles": {
          "scandinavian": "Скандинавский",
          "loft": "Лофт",
          "minimalism": "Минимализм",
          "japandi": "Джапанди",
          "contemporary": "Современный",
          "highTech": "Хай-тек",
          "modern": "Модерн",
          "neoclassical": "Неоклассика",
          "classic": "Классический",
          "mediterranean": "Средиземноморский",
          "eco": "Эко-стиль",
          "brutalism": "Брутализм",
          "artDeco": "Арт-деко",
          "midCentury": "Мид-сенчури",
          "fusion": "Фьюжн"
        }
      }
    },
    "cameraPanel": {
      "title": "Профессиональные пресеты камеры",
      "description": "Применяйте профессиональные пресеты камеры для имитации реальных настроек фотосъемки, таких как диафрагма, фокусное расстояние и глубина резкости.",
      "presets": {
        "wide": "Широкоугольный (16мм, f/8)",
        "standard": "Стандартный (50мм, f/4)",
        "portrait": "Портретный (85мм, f/1.8)",
        "macro": "Макро (105мм, f/5.6)"
      },
      "button": "Применить пресет \"{{preset}}\""
    },
    "adjustmentPanel": {
      "title": "Применить профессиональную коррекцию",
      "presets": {
        "blurBackground": "Размыть фон",
        "enhanceDetails": "Усилить детали",
        "warmerLighting": "Теплый свет",
        "studioLight": "Студийный свет"
      },
      "placeholder": "Или опишите коррекцию (напр., 'измени фон на лес')",
      "button": "Применить коррекцию"
    },
    "filterPanel": {
      "title": "Студия фильтров",
      "description": "Применяйте профессиональные фотофильтры к вашим интерьерным рендерам.",
      "tabs": {
        "quality": "Качество",
        "atmosphere": "Атмосфера",
        "style": "Стиль",
        "effects": "Эффекты"
      },
      "filters": {
        "quality": {
          "hdrBalance": "HDR Баланс",
          "clarityBoost": "Усиление четкости",
          "noiseReduction": "Шумоподавление",
          "sharpnessPro": "Проф. резкость"
        },
        "atmosphere": {
          "warmLight": "Теплый свет",
          "coolLight": "Холодный свет",
          "naturalDaylight": "Дневной свет",
          "moodyShadows": "Глубокие тени"
        },
        "style": {
          "minimalistWhite": "Минимализм (белый)",
          "industrialGrey": "Индастриал (серый)",
          "earthTones": "Земляные тона",
          "retroFilm": "Ретро-пленка"
        },
        "effects": {
          "bloom": "Свечение (Bloom)",
          "lensFlare": "Блики объектива",
          "depthBlur": "Размытие фона",
          "vignette": "Виньетка"
        }
      }
    },
     "nightPanel": {
      "title": "Редактор ночной сцены",
      "dividerText": "ЗАТЕМ",
      "step1": {
        "title": "Шаг 1: Создайте темную основу",
        "button": "Выключить весь свет"
      },
      "step2": {
        "title": "Шаг 2: Управляйте светом с помощью текста",
        "description": "Опишите изменение, которое хотите внести. AI применит его к текущему изображению.",
        "placeholder": "напр., 'включи торшер', 'сделай свет теплее'"
      }
    },
    "fullscreen": {
      "close": "Закрыть полноэкранный просмотр",
      "alt": "Полноэкранный просмотр изображения"
    }
  }
}
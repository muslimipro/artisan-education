'use client';

import { motion, useDragControls, PanInfo } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export interface ComponentItem {
    id: string;
    name: string;
    description: string;
    imageSrc: string;
    available: boolean;
}

interface ComponentPaletteProps {
    components: ComponentItem[];
    isDragging: boolean;
    currentComponent: string | null;
    dragControls: ReturnType<typeof useDragControls>;
    onDragStart: (componentId: string) => void;
    onDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
}

const ComponentPalette: React.FC<ComponentPaletteProps> = ({
    components,
    isDragging,
    currentComponent,
    dragControls,
    onDragStart,
    onDragEnd
}) => {
    const t = useTranslations('CircuitBoard');

    return (
        <div className="bg-white rounded-xl shadow-lg p-4 w-[360px]">

            <div className="grid grid-cols-2 gap-4 min-h-[120px]">
                {components.map((component) => (
                    component.available && (
                        <motion.div
                            key={component.id}
                            drag
                            dragSnapToOrigin
                            whileHover={{ scale: 1.05 }}
                            whileDrag={{
                                scale: 1.1,
                                zIndex: 1000
                            }}
                            onDragStart={() => onDragStart(component.id)}
                            onDragEnd={onDragEnd}
                            className="rounded-lg cursor-grab flex flex-col items-center group relative p-2"
                            dragControls={dragControls}
                            dragMomentum={false}
                            dragElastic={0.5}
                            style={{
                                position: 'relative',
                                zIndex: isDragging && currentComponent === component.id ? 1000 : 10
                            }}
                        >
                            <div className="w-20 h-20 rounded-lg flex items-center justify-center pointer-events-none">
                                <div className="relative w-24 h-24">
                                    <Image
                                        src={component.imageSrc}
                                        alt={component.name}
                                        width={96}
                                        height={96}
                                        style={{ objectFit: 'contain', pointerEvents: 'none' }}
                                        draggable="false"
                                        onDragStart={(e) => e.preventDefault()}
                                    />
                                </div>
                            </div>
                            <span className="text-sm font-medium">{component.name}</span>
                        </motion.div>
                    )
                ))}
                {!components.some(comp => comp.available) && (
                    <div className="col-span-2 flex items-center justify-center h-full">
                        <p className="text-slate-400 text-sm">{t('palette.allComponentsPlaced')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComponentPalette; 
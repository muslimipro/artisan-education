import { FC } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { DragControls, PanInfo } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface Component {
    id: string;
    type: string;
    isActive?: boolean;
}

interface Slot {
    id: string;
    position: { x: number; y: number };
    component: Component | null;
    label: string;
    pin: number;
}

interface CircuitBoardDisplayProps {
    slots: Slot[];
    isDragging: boolean;
    currentComponent: string | null;
    dragControls: DragControls;
    boardRef: React.RefObject<HTMLDivElement>;
    onButtonPress: (pressed: boolean) => void;
    onRemoveComponent: (slotId: string) => void;
    onSlotDragStart: (slotId: string, componentType: string) => void;
    onDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
    pulsingSlotsIds: string[];
    correctPlacements: { [key: string]: boolean };
}

const CircuitBoardDisplay: FC<CircuitBoardDisplayProps> = ({
    slots,
    isDragging,
    currentComponent,
    dragControls,
    boardRef,
    onButtonPress,
    onSlotDragStart,
    onDragEnd,
    pulsingSlotsIds,
    correctPlacements
}) => {
    const t = useTranslations('CircuitBoard');

    return (
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden w-[360px]">
            <div
                ref={boardRef}
                className="relative"
                style={{
                    width: '360px',
                    height: '400px'
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full">
                        <Image
                            src="/board/pibody.png"
                            alt={t('components.board.name')}
                            width={600}
                            height={400}
                            style={{ objectFit: 'contain', pointerEvents: 'none' }}
                            draggable="false"
                            onDragStart={(e) => e.preventDefault()}
                        />

                        {slots.map((slot) => (
                            <div
                                key={slot.id}
                                style={{
                                    position: 'absolute',
                                    left: `${slot.position.x}%`,
                                    top: `${slot.position.y}%`,
                                    transform: 'translate(-50%, -50%)',
                                    width: '96px',
                                    height: '96px'
                                }}
                            >
                                <div className="w-full h-full">
                                    {slot.component ? (
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                                            className="relative w-full h-full flex items-center justify-center cursor-grab absolute inset-0"
                                            onPointerDown={() => slot.component?.type === 'button' && onButtonPress(true)}
                                            onPointerUp={() => slot.component?.type === 'button' && onButtonPress(false)}
                                            onPointerLeave={() => slot.component?.type === 'button' && onButtonPress(false)}
                                            drag
                                            dragSnapToOrigin={true}
                                            onDragStart={() => slot.component && onSlotDragStart(slot.id, slot.component.type)}
                                            onDragEnd={onDragEnd}
                                            dragControls={dragControls}
                                            dragMomentum={false}
                                            dragElastic={0}
                                            whileDrag={{
                                                scale: 1.1,
                                                zIndex: 1000
                                            }}
                                            style={{
                                                position: 'relative',
                                                zIndex: isDragging && currentComponent === slot.component?.type ? 1000 : 10,
                                                x: 0,
                                                y: 0
                                            }}
                                        >
                                            {slot.component.type === 'led' && (
                                                <div className="relative w-20 h-20">
                                                    <div
                                                        className={`absolute rounded-full ${slot.component.isActive ? 'bg-green-500 animate-pulse shadow-glow' : 'bg-transparent'}`}
                                                        style={{
                                                            width: '16px',
                                                            height: '16px',
                                                            top: '15px',
                                                            left: '32px',
                                                            zIndex: 20
                                                        }}
                                                    ></div>
                                                    <Image
                                                        src="/board/module-led-green.png"
                                                        alt={t('components.led.name')}
                                                        width={90}
                                                        height={90}
                                                        draggable="false"
                                                        onDragStart={(e) => e.preventDefault()}
                                                        style={{ pointerEvents: 'none' }}
                                                        className="z-10"
                                                    />
                                                    {correctPlacements.led && slot.id === 'slot1' && (
                                                        <motion.div
                                                            className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                            initial={{ scale: 0, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            transition={{ type: "spring", stiffness: 500, damping: 10 }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            )}

                                            {slot.component.type === 'button' && (
                                                <div className="relative w-20 h-20">
                                                    <Image
                                                        src="/board/module-button-blue.png"
                                                        alt={t('components.button.name')}
                                                        width={90}
                                                        height={90}
                                                        draggable="false"
                                                        onDragStart={(e) => e.preventDefault()}
                                                        style={{ pointerEvents: 'none' }}
                                                        className="transform transition-all duration-100"
                                                    />
                                                    <div
                                                        className={`absolute rounded-full transition-all duration-100 ${slot.component.isActive ? 'bg-orange-400' : 'bg-transparent'}`}
                                                        style={{
                                                            width: '21px',
                                                            height: '21px',
                                                            top: '50%',
                                                            left: '50%',
                                                            transform: 'translate(-50%, -50%)',
                                                            zIndex: 20
                                                        }}
                                                    ></div>
                                                    {correctPlacements.button && slot.id === 'slot2' && (
                                                        <motion.div
                                                            className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                            initial={{ scale: 0, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            transition={{ type: "spring", stiffness: 500, damping: 10 }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            )}
                                        </motion.div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            {pulsingSlotsIds.includes(slot.id) && (
                                                <>
                                                    <motion.div
                                                        className={`w-24 h-24 rounded-full absolute ${slot.id === 'slot1' ? 'bg-primary/30' : 'bg-blue-500/30'}`}
                                                        initial={{ scale: 0.8, opacity: 0.5 }}
                                                        animate={{
                                                            scale: [0.8, 1.2, 0.8],
                                                            opacity: [0.3, 0.7, 0.3],
                                                        }}
                                                        transition={{
                                                            duration: 1.5,
                                                            repeat: Infinity,
                                                            repeatType: "loop"
                                                        }}
                                                    />

                                                    <motion.div
                                                        className={`w-16 h-16 rounded-full border-2 absolute ${slot.id === 'slot1' ? 'border-primary' : 'border-blue-500'}`}
                                                        animate={{
                                                            scale: [1, 1.1, 1],
                                                            opacity: [0.7, 1, 0.7]
                                                        }}
                                                        transition={{
                                                            duration: 1.2,
                                                            repeat: Infinity,
                                                            repeatType: "loop"
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
                            {slots.map((slot) => (
                                pulsingSlotsIds.includes(slot.id) && !slot.component && (
                                    <motion.div
                                        key={`hint-${slot.id}`}
                                        className={`absolute text-center text-white text-xs px-2 py-1 rounded-md ${slot.id === 'slot1' ? 'bg-primary' : 'bg-blue-500'}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        style={{
                                            left: `${slot.position.x}%`,
                                            top: `${slot.position.y + 15}%`,
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                    >
                                        {slot.id === 'slot1' ? (
                                            <>
                                                <div>{t('components.placement.placeLed.line1')}</div>
                                                <div>{t('components.placement.placeLed.line2')}</div>
                                            </>
                                        ) : (
                                            <>
                                                <div>{t('components.placement.placeButton.line1')}</div>
                                                <div>{t('components.placement.placeButton.line2')}</div>
                                            </>
                                        )}
                                    </motion.div>
                                )
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CircuitBoardDisplay; 
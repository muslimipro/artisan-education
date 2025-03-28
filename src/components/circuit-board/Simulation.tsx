'use client';

import { useState, useRef, useEffect } from 'react';
import { useDragControls, PanInfo } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Instructions from './Instructions';
import ComponentPalette, { ComponentItem } from './ComponentPalette';
import CodeEditor from './CodeEditor';
import CircuitBoardDisplay from './CircuitBoardDisplay';
import Mission from '../Mission';
import useTutorial, { Slot } from './hooks/useTutorial';
import validateCode from './utils/codeValidation';
import Link from 'next/link';

// Define TFunction to match the one in codeValidation.ts
type TFunction = (key: string, params?: Record<string, unknown>) => string;

const CircuitBoard = () => {
    // Use type assertion to indicate that this function conforms to the expected TFunction interface
    // This allows it to be passed to validateCode without type errors
    const t = useTranslations('CircuitBoard') as unknown as TFunction;

    const [isDragging, setIsDragging] = useState(false);
    const [currentComponent, setCurrentComponent] = useState<string | null>(null);
    const [dragOrigin, setDragOrigin] = useState<'palette' | 'slot' | null>(null);
    const [dragSourceSlotId, setDragSourceSlotId] = useState<string | null>(null);
    const [isProgramRunning, setIsProgramRunning] = useState(false);
    const [isComponentVisible, setIsComponentVisible] = useState(false);
    const [resetInstructions, setResetInstructions] = useState(false);
    const [userCode, setUserCode] = useState(t('codeTemplate.code'));
    const [codeHint, setCodeHint] = useState('');
    const [isCodeValid, setIsCodeValid] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [pulsingSlotsIds, setPulsingSlotsIds] = useState<string[]>([]);

    const [slots, setSlots] = useState<Slot[]>([
        { id: 'slot1', position: { x: 20, y: 18 }, component: null, label: t('slots.slot1'), pin: 0 },
        { id: 'slot2', position: { x: 20, y: 43 }, component: null, label: t('slots.slot2'), pin: 2 },
        { id: 'slot3', position: { x: 20, y: 67 }, component: null, label: t('slots.slot3'), pin: 28 },
        { id: 'slot4', position: { x: 80, y: 18 }, component: null, label: t('slots.slot4'), pin: 4 },
        { id: 'slot5', position: { x: 80, y: 43 }, component: null, label: t('slots.slot5'), pin: 6 },
        { id: 'slot6', position: { x: 80, y: 67 }, component: null, label: t('slots.slot6'), pin: 26 },
    ]);

    const [correctPlacements, setCorrectPlacements] = useState<{ [key: string]: boolean }>({
        led: false,
        button: false
    });

    const boardRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);

    const [components, setComponents] = useState<ComponentItem[]>([
        {
            id: 'led',
            name: t('components.led.name'),
            description: t('components.led.description'),
            imageSrc: '/board/module-led-green.png',
            available: true
        },
        {
            id: 'button',
            name: t('components.button.name'),
            description: t('components.button.description'),
            imageSrc: '/board/module-button-blue.png',
            available: true
        }
    ]);

    // Check if components are in their correct slots
    const checkCorrectPlacements = (updatedSlots: Slot[]): boolean => {
        const ledInSlot1 = updatedSlots.find(slot =>
            slot.id === 'slot1' && slot.component?.type === 'led'
        );

        const buttonInSlot2 = updatedSlots.find(slot =>
            slot.id === 'slot2' && slot.component?.type === 'button'
        );

        const areComponentsPlaced = !!ledInSlot1 && !!buttonInSlot2;

        setCorrectPlacements({
            led: !!ledInSlot1,
            button: !!buttonInSlot2
        });

        // If both components are correctly placed, show a success message
        if (ledInSlot1 && buttonInSlot2) {
            setCodeHint(t('codeHints.componentsPlacedCorrectly'));
            setShowHint(true);
            setTimeout(() => setShowHint(false), 4000);
        }

        // Validate code whenever components are placed or moved
        const validationResult = validateCode(userCode, updatedSlots, t);
        setIsCodeValid(validationResult.isValid);
        setCodeHint(validationResult.hint);

        return areComponentsPlaced;
    };

    // Custom setUserCode function that also detects code resets for tutorial loops
    const handleSetUserCode = (newCode: string | ((prevCode: string) => string)) => {
        // First, get the string value of the code
        const resolvedCode = typeof newCode === 'function'
            ? newCode(userCode) // Apply the function to get the new code
            : newCode;  // Or use the string directly

        // Check if this is a reset to the initial state
        const isReset = resolvedCode.includes('# Установка пинов') &&
            !resolvedCode.includes('led = Pin') &&
            !resolvedCode.includes('button = Pin');

        if (isReset && userCode !== resolvedCode) {
            console.log("Code reset detected, triggering instruction reset");
            // If the code was reset to initial state, trigger instruction reset
            setResetInstructions(true);
            // Schedule turning it off so the effect can trigger again on next reset
            setTimeout(() => setResetInstructions(false), 100);
        }

        setUserCode(resolvedCode);
    };

    const {
        isTutorialActive,
        setIsTutorialActive,
        tutorialStep,
        handleUserInteraction,
        userInteractionDetected,
        isTypingCode,
        restartTutorial
    } = useTutorial({
        slots,
        setSlots,
        userCode,
        setUserCode: handleSetUserCode,
        setComponents,
        setCurrentComponent,
        setIsDragging,
        setDragOrigin,
        setDragSourceSlotId,
        setPulsingSlotsIds,
        setIsProgramRunning,
        setCodeHint,
        setShowHint,
        setIsCodeValid,
        checkCorrectPlacements,
        validateCode: (code) => {
            const result = validateCode(code, slots, t);
            return result.isValid;
        },
        isComponentVisible
    });

    // Handler for reloading the tutorial manually
    const handleReloadTutorial = () => {
        console.log("Manual tutorial reload requested");
        if (isTutorialActive) {
            // If the tutorial is already running, just restart it
            restartTutorial();
        } else {
            // If the tutorial was stopped due to user interaction, re-enable it first
            setIsTutorialActive(true);
            // Wait a bit for state to update
            setTimeout(() => restartTutorial(), 100);
        }

        // Show feedback to the user
        setCodeHint(t('codeHints.restartingDemo'));
        setShowHint(true);
        setTimeout(() => setShowHint(false), 3000);
    };

    // Reset instructions when tutorial step changes to 'placing-led'
    // This ensures that at the start of a new iteration, all steps are unmarked
    useEffect(() => {
        if (tutorialStep === 'placing-led') {
            console.log("Tutorial step changed to placing-led, resetting instructions");
            setResetInstructions(true);
            setTimeout(() => setResetInstructions(false), 100);
        }
    }, [tutorialStep]);

    // Monitor program state to ensure consistency with tutorial steps
    useEffect(() => {
        if (tutorialStep === 'placing-led' && isProgramRunning) {
            console.log("Correcting program state for new tutorial cycle");
            setIsProgramRunning(false);
        }
    }, [tutorialStep, isProgramRunning]);

    useEffect(() => {
        const buttonSlot = slots.find(slot => slot.component?.type === 'button');
        const buttonPressed = buttonSlot?.component?.isActive || false;
        const ledSlot = slots.find(slot => slot.component?.type === 'led');

        if (!ledSlot) return;

        if (!isCodeValid) {
            if (ledSlot.component?.isActive) {
                setSlots(prev => prev.map(slot => {
                    if (slot.component?.type === 'led') {
                        return {
                            ...slot,
                            component: {
                                ...slot.component,
                                isActive: false
                            }
                        };
                    }
                    return slot;
                }));
            }
            return;
        }

        if (ledSlot.component?.isActive !== buttonPressed) {
            setSlots(prev => prev.map(slot => {
                if (slot.component?.type === 'led') {
                    return {
                        ...slot,
                        component: {
                            ...slot.component,
                            isActive: buttonPressed
                        }
                    };
                }
                return slot;
            }));
        }
    }, [isCodeValid, slots]);

    // Validate code whenever components on the board change
    useEffect(() => {
        // Extract slot component types into a stable variable for dependency tracking
        const componentTypes = slots.map(slot => slot.component?.type);

        // Check if both LED and button are on the board
        const ledOnBoard = componentTypes.includes('led');
        const buttonOnBoard = componentTypes.includes('button');

        // Only validate if both components are on the board
        if (ledOnBoard && buttonOnBoard) {
            const validationResult = validateCode(userCode, slots, t);
            setIsCodeValid(validationResult.isValid);
            setCodeHint(validationResult.hint);
        }

        // Stop tutorial if there is user interaction with components
        if (isTutorialActive && userInteractionDetected(componentTypes)) {
            handleUserInteraction();
        }
    }, [userCode, slots, isTutorialActive, userInteractionDetected, handleUserInteraction, t]);

    // Set up Intersection Observer to detect when component is visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsComponentVisible(entry.isIntersecting);
            },
            { threshold: 0.5 }
        );

        // Save a reference to the current value of sectionRef
        const currentSectionRef = sectionRef.current;

        if (currentSectionRef) {
            observer.observe(currentSectionRef);
        }

        return () => {
            if (currentSectionRef) {
                observer.unobserve(currentSectionRef);
            }
        };
    }, []);

    // Attach event listeners for user interaction once on component mount
    useEffect(() => {
        const boardElement = boardRef.current;

        // Main user interaction handler
        const interactionHandler = () => handleUserInteraction();

        // Add event listeners to all interactive elements
        if (boardElement) {
            boardElement.addEventListener('mousedown', interactionHandler);
            boardElement.addEventListener('touchstart', interactionHandler);
        }

        // Clean up event listeners on unmount
        return () => {
            if (boardElement) {
                boardElement.removeEventListener('mousedown', interactionHandler);
                boardElement.removeEventListener('touchstart', interactionHandler);
            }
        };
    }, [handleUserInteraction]);

    // Handle code changes - and stop tutorial if user edits code
    const handleCodeChange = (newCode: string) => {
        if (isTutorialActive && newCode !== userCode) {
            handleUserInteraction();
        }

        setUserCode(newCode);
        const validationResult = validateCode(newCode, slots, t);
        setIsCodeValid(validationResult.isValid);
        setCodeHint(validationResult.hint);
        setShowHint(true);
        setTimeout(() => setShowHint(false), 4000);
    };

    // Handle button press - and stop tutorial if user presses button
    const handleButtonPress = (pressed: boolean) => {
        if (isTutorialActive) {
            handleUserInteraction();
        }

        setSlots(prev => {
            return prev.map(slot => {
                if (slot.component?.type === 'button') {
                    return {
                        ...slot,
                        component: {
                            ...slot.component,
                            isActive: pressed
                        }
                    };
                }
                return slot;
            });
        });
    };

    // Handle starting to drag a component from the palette - and stop tutorial
    const handleDragStart = (componentId: string) => {
        if (isTutorialActive) {
            handleUserInteraction();
        }

        setIsDragging(true);
        setCurrentComponent(componentId);
        setDragOrigin('palette');
        setDragSourceSlotId(null);

        // Set pulsing slots based on component type
        if (componentId === 'button') {
            // Make slot 2 pulse when dragging a button
            setPulsingSlotsIds(['slot2']);
        } else if (componentId === 'led') {
            // Make slot 1 pulse when dragging an LED
            setPulsingSlotsIds(['slot1']);
        } else {
            setPulsingSlotsIds([]);
        }
    };

    // Handle starting to drag a component from a slot - and stop tutorial
    const handleSlotDragStart = (slotId: string, componentType: string) => {
        if (isTutorialActive) {
            handleUserInteraction();
        }

        setIsDragging(true);
        setCurrentComponent(componentType);
        setDragOrigin('slot');
        setDragSourceSlotId(slotId);

        // Set pulsing slots based on component type, but don't pulse if it's already in the correct slot
        if (componentType === 'button' && slotId !== 'slot2') {
            // Make slot 2 pulse when dragging a button from another slot
            setPulsingSlotsIds(['slot2']);
        } else if (componentType === 'led' && slotId !== 'slot1') {
            // Make slot 1 pulse when dragging an LED from another slot
            setPulsingSlotsIds(['slot1']);
        } else {
            setPulsingSlotsIds([]);
        }
    };

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        setIsDragging(false);
        // Clear pulsing slots when drag ends
        setPulsingSlotsIds([]);

        // Use info parameter for any additional drag info if needed in the future
        console.log('Drag velocity:', info.velocity);

        if (!currentComponent) return;

        const boardRect = boardRef.current?.getBoundingClientRect();
        if (!boardRect) return;

        // Handle touch and mouse events
        const point = {
            x: event instanceof TouchEvent && event.touches?.[0]
                ? event.touches[0].clientX
                : (event as MouseEvent).clientX,
            y: event instanceof TouchEvent && event.touches?.[0]
                ? event.touches[0].clientY
                : (event as MouseEvent).clientY
        };

        const relativeX = ((point.x - boardRect.left) / boardRect.width) * 100;
        const relativeY = ((point.y - boardRect.top) / boardRect.height) * 100;

        // Check if dropped back onto the palette area (left side)
        const paletteDropped = point.x < boardRect.left - 50;

        if (paletteDropped) {
            if (dragOrigin === 'slot' && dragSourceSlotId) {
                setSlots(prev => {
                    const updatedSlots = prev.map(slot => {
                        if (slot.id === dragSourceSlotId) {
                            return { ...slot, component: null };
                        }
                        return slot;
                    });

                    // Check if components are in their correct slots
                    checkCorrectPlacements(updatedSlots);

                    return updatedSlots;
                });

                setComponents(prev => prev.map(comp => {
                    if (comp.id === currentComponent) {
                        return { ...comp, available: true };
                    }
                    return comp;
                }));
            }

            setCurrentComponent(null);
            setDragOrigin(null);
            setDragSourceSlotId(null);
            return;
        }

        let closestSlot: Slot | null = null;
        let minDistance = Infinity;

        slots.forEach(slot => {
            const distance = Math.sqrt(
                Math.pow(slot.position.x - relativeX, 2) +
                Math.pow(slot.position.y - relativeY, 2)
            );

            if (distance < minDistance) {
                minDistance = distance;
                closestSlot = slot;
            }
        });

        if (closestSlot && minDistance < 15) {
            const targetSlot = slots.find(s => s.id === closestSlot?.id);
            if (!targetSlot) return;

            // If trying to drop onto the same slot we started from, just cancel the operation
            if (dragOrigin === 'slot' && dragSourceSlotId === targetSlot.id) {
                setCurrentComponent(null);
                setDragOrigin(null);
                setDragSourceSlotId(null);
                return;
            }

            // If target slot already has a component, don't allow the drop
            if (targetSlot.component) {

                if (dragOrigin === 'slot' && dragSourceSlotId) {
                }
                setCurrentComponent(null);
                setDragOrigin(null);
                setDragSourceSlotId(null);
                return;
            }
            const componentAlreadyOnBoard = slots.some(slot =>
                slot.component?.type === currentComponent &&
                (!dragSourceSlotId || slot.id !== dragSourceSlotId)
            );

            if (componentAlreadyOnBoard && dragOrigin === 'palette') {
                setCurrentComponent(null);
                setDragOrigin(null);
                setDragSourceSlotId(null);
                return;
            }

            if (dragOrigin === 'slot' && dragSourceSlotId) {
                setSlots(prev => {
                    return prev.map(slot => {
                        if (slot.id === dragSourceSlotId) {
                            return { ...slot, component: null };
                        }
                        return slot;
                    });
                });
            }

            setSlots(prev => {
                const updatedSlots = prev.map(slot => {
                    if (slot.id === targetSlot.id) {
                        return {
                            ...slot,
                            component: {
                                id: `${currentComponent}-${Date.now()}`,
                                type: currentComponent,
                                isActive: false
                            }
                        };
                    }
                    return slot;
                });

                checkCorrectPlacements(updatedSlots);

                return updatedSlots;
            });

            if (dragOrigin === 'palette') {
                setComponents(prev => prev.map(comp => {
                    if (comp.id === currentComponent) {
                        return { ...comp, available: false };
                    }
                    return comp;
                }));
            }
        } else if (dragOrigin === 'slot' && dragSourceSlotId) {
            setSlots(prev => {
                const updatedSlots = prev.map(slot => {
                    if (slot.id === dragSourceSlotId) {
                        return { ...slot, component: null };
                    }
                    return slot;
                });

                checkCorrectPlacements(updatedSlots);

                return updatedSlots;
            });

            setComponents(prev => prev.map(comp => {
                if (comp.id === currentComponent) {
                    return { ...comp, available: true };
                }
                return comp;
            }));
        }

        setCurrentComponent(null);
        setDragOrigin(null);
        setDragSourceSlotId(null);
    };

    const removeComponent = (slotId: string) => {
        const slot = slots.find(s => s.id === slotId);
        if (slot && slot.component) {
            const componentType = slot.component.type;

            setComponents(prev => prev.map(comp => {
                if (comp.id === componentType) {
                    return { ...comp, available: true };
                }
                return comp;
            }));

            const updatedSlots = slots.map(s => {
                if (s.id === slotId) {
                    return { ...s, component: null };
                }
                return s;
            });

            setSlots(updatedSlots);
            checkCorrectPlacements(updatedSlots);
        }
    };

    const dragControls = useDragControls();

    return (
        <section id="demo" className="py-12 md:py-20 bg-gray-light relative" ref={sectionRef}>

            {/* Grid background */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                    opacity: 0.7
                }}
            />
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
                <Mission />
                <h2 className="section-title">{t('pageContent.title')}</h2>
                <p className="section-subtitle">
                    {t('pageContent.subtitle')}
                </p>
                <div className="flex justify-center">
                    <Link
                        href="https://learn.artisan.education/signup" className="bg-primary text-white hover:shadow-lg hover:scale-[1.04] font-semibold py-3 px-5 rounded-xl transition-all duration-300">
                        {t('buttons.openFullPlatform')}
                    </Link>
                </div>

                <div className="mt-12 animate-fade-in">
                    <div className="flex flex-col gap-6 items-center">
                        <div className="lg:w-[1250px] w-full flex flex-col lg:flex-row gap-6 lg:gap-4">
                            <div className="flex flex-col items-center gap-4">
                                <CircuitBoardDisplay
                                    slots={slots}
                                    isDragging={isDragging}
                                    currentComponent={currentComponent}
                                    dragControls={dragControls}
                                    boardRef={boardRef}
                                    onButtonPress={handleButtonPress}
                                    onRemoveComponent={removeComponent}
                                    onSlotDragStart={handleSlotDragStart}
                                    onDragEnd={handleDragEnd}
                                    pulsingSlotsIds={pulsingSlotsIds}
                                    correctPlacements={correctPlacements}
                                />

                                <ComponentPalette
                                    components={components}
                                    isDragging={isDragging}
                                    currentComponent={currentComponent}
                                    dragControls={dragControls}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handleDragEnd}
                                />
                            </div>

                            <div className="flex-1 flex">
                                <CodeEditor
                                    userCode={userCode}
                                    isCodeValid={isCodeValid && !isTypingCode}
                                    isProgramRunning={isProgramRunning}
                                    showHint={showHint}
                                    codeHint={codeHint}
                                    onCodeChange={handleCodeChange}
                                    onCodeEditorClick={() => {
                                        if (isTutorialActive) {
                                            if (tutorialStep === 'entering-code') {
                                                setCodeHint(t('codeHints.autoTypingStopped'));
                                            } else {
                                                setCodeHint(t('codeHints.manualModeActivated'));
                                            }
                                            handleUserInteraction();
                                        }
                                    }}
                                    onRunProgram={() => {
                                        // Don't allow running program while code is being typed
                                        if (isTypingCode) {
                                            setCodeHint(t('codeHints.waitForCodeInput'));
                                            setShowHint(true);
                                            setTimeout(() => setShowHint(false), 3000);
                                            return;
                                        }

                                        if (isTutorialActive) {
                                            handleUserInteraction();
                                            return;
                                        }

                                        if (isProgramRunning) {
                                            setIsProgramRunning(false);
                                            setCodeHint(t('codeHints.programStopped'));
                                            setShowHint(true);
                                            setTimeout(() => setShowHint(false), 4000);
                                        } else if (isCodeValid) {
                                            setIsProgramRunning(true);
                                            setCodeHint(t('codeHints.programStarted'));
                                            setShowHint(true);
                                            setTimeout(() => setShowHint(false), 4000);
                                            console.log('Executing code:', userCode);
                                        } else {
                                            setCodeHint(t('codeHints.completeCodeBeforeRunning'));
                                            setShowHint(true);
                                            setTimeout(() => setShowHint(false), 4000);
                                        }
                                    }}
                                />
                            </div>
                            <div className="w-[360px] flex">
                                <Instructions
                                    codeEntered={isCodeValid}
                                    modulesPlaced={correctPlacements.led && correctPlacements.button && !(tutorialStep === 'placing-led')}
                                    runButtonPressed={isProgramRunning}
                                    buttonPressedLedOn={isProgramRunning && slots.find(slot => slot.component?.type === 'button')?.component?.isActive === true && slots.find(slot => slot.component?.type === 'led')?.component?.isActive === true}
                                    resetInstructions={resetInstructions}
                                    onReloadTutorial={handleReloadTutorial}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CircuitBoard;
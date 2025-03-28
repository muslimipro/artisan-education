import React, { useState, useEffect, useRef } from 'react';
import Instructions from './Instructions';
import CodeEditor from './CodeEditor';
import CircuitBoardDisplay from './CircuitBoardDisplay';
import ComponentPalette from './ComponentPalette';
import Simulation from './Simulation';
import { useDragControls, PanInfo } from 'framer-motion';

// Define module interfaces for proper type checking
interface Module {
    id: string;
    type: string;
    position: {
        x: number;
        y: number;
    };
    isPlaced: boolean;
}

// Define the Slot interface for CircuitBoardDisplay
interface Slot {
    id: string;
    position: { x: number; y: number };
    component: {
        id: string;
        type: string;
        isActive?: boolean;
    } | null;
    label: string;
    pin: number;
}

// Define the ComponentItem interface for ComponentPalette
interface ComponentItem {
    id: string;
    name: string;
    description: string;
    imageSrc: string;
    available: boolean;
}

const CircuitBoard: React.FC = () => {
    const [codeEntered, setCodeEntered] = useState(false);
    const [modulesPlaced, setModulesPlaced] = useState(false);
    const [runButtonPressed, setRunButtonPressed] = useState(false);
    const [isSimulationRunning, setIsSimulationRunning] = useState(false);
    const [placedModules, setPlacedModules] = useState<Module[]>([]);
    const dragControls = useDragControls();
    const [isDragging, setIsDragging] = useState(false);
    const [currentComponent, setCurrentComponent] = useState<string | null>(null);
    const boardRef = useRef<HTMLDivElement>(null);

    const [slots, setSlots] = useState<Slot[]>([
        {
            id: 'slot1',
            position: { x: 70, y: 25 },
            component: null,
            label: 'LED',
            pin: 0
        },
        {
            id: 'slot2',
            position: { x: 70, y: 75 },
            component: null,
            label: 'Button',
            pin: 2
        }
    ]);

    const [components, setComponents] = useState<ComponentItem[]>([
        {
            id: 'led',
            name: 'LED',
            description: 'A light-emitting diode',
            imageSrc: '/board/module-led-green.png',
            available: true
        },
        {
            id: 'button',
            name: 'Button',
            description: 'A push button',
            imageSrc: '/board/module-button-blue.png',
            available: true
        }
    ]);

    const [pulsingSlotsIds, _setPulsingSlotsIds] = useState<string[]>(['slot1', 'slot2']);
    const [correctPlacements, setCorrectPlacements] = useState({ led: false, button: false });

    const [userCode, setUserCode] = useState('from machine import Pin\nimport time\n\n# Define the LED pin\n\n# Define the button pin\n\nwhile True:\n    if button.value() == 1:  # Button is pressed\n        led.value(1)  # Turn on LED\n    else:\n        led.value(0)  # Turn off LED\n    time.sleep(0.1)  # Small delay');
    const [codeHint, _setCodeHint] = useState('Define the LED pin with Pin(0, Pin.OUT) and button pin with Pin(2, Pin.IN)');
    const [showHint, _setShowHint] = useState(true);

    useEffect(() => {
        console.log("CircuitBoard state updated:", {
            codeEntered,
            modulesPlaced,
            runButtonPressed,
            isSimulationRunning,
            modulesCount: placedModules.length
        });
    }, [codeEntered, modulesPlaced, runButtonPressed, isSimulationRunning, placedModules]);

    // Robust code validation function
    const checkForRequiredCode = (code: string) => {
        const ledPattern = /led\s*=\s*Pin\s*\(\s*0\s*,\s*Pin\.OUT\s*\)/;
        const buttonPattern = /button\s*=\s*Pin\s*\(\s*2\s*,\s*Pin\.IN\s*\)/;
        const hasLedDefinition = ledPattern.test(code);
        const hasButtonDefinition = buttonPattern.test(code);

        console.log("Code validation result:", {
            hasLedDefinition,
            hasButtonDefinition,
            isValid: hasLedDefinition && hasButtonDefinition
        });

        if (hasLedDefinition && hasButtonDefinition) {
            _setCodeHint('Great job! Both LED and button pins are correctly defined.');
            _setShowHint(true);
        } else if (!hasLedDefinition && !hasButtonDefinition) {
            _setCodeHint('Define the LED pin with Pin(0, Pin.OUT) and button pin with Pin(2, Pin.IN)');
            _setShowHint(true);
        } else if (!hasLedDefinition) {
            _setCodeHint('Define the LED pin with Pin(0, Pin.OUT)');
            _setShowHint(true);
        } else if (!hasButtonDefinition) {
            _setCodeHint('Define the button pin with Pin(2, Pin.IN)');
            _setShowHint(true);
        }

        return hasLedDefinition && hasButtonDefinition;
    };

    const checkForModulesPlacement = (modules: Module[]) => {
        setPlacedModules([...modules]);
        const hasLed = modules.some(module => module.type === 'led' && module.isPlaced);
        const hasButton = modules.some(module => module.type === 'button' && module.isPlaced);

        console.log("Module validation result:", {
            hasLed,
            hasButton,
            moduleCount: modules.length,
            isValid: hasLed && hasButton
        });

        return hasLed && hasButton;
    };

    const handleCodeChange = (code: string) => {
        console.log("Code changed, validating...");
        setUserCode(code);
        const isCodeValid = checkForRequiredCode(code);

        if (isCodeValid !== codeEntered) {
            console.log(`Code validation state changing: ${codeEntered} -> ${isCodeValid}`);
            setCodeEntered(isCodeValid);
        }
    };

    // Module update handler
    const handleModuleUpdate = (modules: Module[]) => {
        console.log("Modules updated, validating...");
        const areModulesValid = checkForModulesPlacement(modules);

        // Only update if the validation status changes
        if (areModulesValid !== modulesPlaced) {
            console.log(`Module validation state changing: ${modulesPlaced} -> ${areModulesValid}`);
            setModulesPlaced(areModulesValid);
        }
    };

    // Run button handler with proper state reset
    const handleRunButtonClick = () => {
        console.log("Run button clicked");

        // Toggle simulation state
        setIsSimulationRunning(prev => !prev);

        // Set flag to true to trigger instruction completion
        setRunButtonPressed(true);

        // Reset the flag after a delay to allow for detecting subsequent clicks
        setTimeout(() => {
            setRunButtonPressed(false);
            console.log("Run button state reset for next click detection");
        }, 500);
    };

    // Handle slot drag start
    const handleSlotDragStart = (slotId: string, componentType: string) => {
        setIsDragging(true);
        setCurrentComponent(componentType);
    };

    // Handle component drag start
    const handleComponentDragStart = (componentId: string) => {
        setIsDragging(true);
        setCurrentComponent(componentId);

        // Update pulsing slots based on the component being dragged
        if (componentId === 'led') {
            // Make the LED slot pulse when dragging an LED
            _setPulsingSlotsIds(['slot1']);
        } else if (componentId === 'button') {
            // Make the button slot pulse when dragging a button
            _setPulsingSlotsIds(['slot2']);
        }
    };

    // Handle button press
    const handleButtonPress = (pressed: boolean) => {
        // Update button state in slots
        setSlots(prev =>
            prev.map(slot =>
                slot.component?.type === 'button'
                    ? { ...slot, component: { ...slot.component, isActive: pressed } }
                    : slot
            )
        );
    };

    // Calculate if a component is dropped onto a slot
    const isComponentOverSlot = (dragInfo: PanInfo, slotId: string) => {
        if (!boardRef.current) return false;

        const boardRect = boardRef.current.getBoundingClientRect();
        const slotInfo = slots.find(s => s.id === slotId);

        if (!slotInfo) return false;

        // Calculate slot position in screen coordinates
        const slotX = boardRect.left + (boardRect.width * slotInfo.position.x / 100);
        const slotY = boardRect.top + (boardRect.height * slotInfo.position.y / 100);

        // Define drop area dimensions (px)
        const dropAreaSize = 50;

        // Check if drag endpoint is within the slot's drop area
        const dragEndX = dragInfo.point.x;
        const dragEndY = dragInfo.point.y;

        return (
            Math.abs(dragEndX - slotX) < dropAreaSize &&
            Math.abs(dragEndY - slotY) < dropAreaSize
        );
    };

    // Handle drag end
    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (!currentComponent) {
            setIsDragging(false);
            _setPulsingSlotsIds([]); // Reset pulsing slots
            return;
        }

        // Check if component is dropped on any slot
        let isDroppedOnSlot = false;
        const updatedSlots = [...slots];

        // Check each slot for potential drop
        slots.forEach((slot, index) => {
            if (isComponentOverSlot(info, slot.id)) {
                // Only allow drop if slot is empty
                if (!slot.component) {
                    // Place component in slot
                    updatedSlots[index] = {
                        ...slot,
                        component: {
                            id: currentComponent,
                            type: currentComponent,
                            isActive: false
                        }
                    };

                    // Update component availability
                    setComponents(prev =>
                        prev.map(comp =>
                            comp.id === currentComponent
                                ? { ...comp, available: false }
                                : comp
                        )
                    );

                    isDroppedOnSlot = true;

                    // Update correct placement state
                    if (
                        (currentComponent === 'led' && slot.id === 'slot1') ||
                        (currentComponent === 'button' && slot.id === 'slot2')
                    ) {
                        setCorrectPlacements(prev => ({
                            ...prev,
                            [currentComponent]: true
                        }));
                    }
                }
            }
        });

        if (isDroppedOnSlot) {
            setSlots(updatedSlots);
        }

        setIsDragging(false);
        setCurrentComponent(null);
        _setPulsingSlotsIds([]); // Reset pulsing slots when drag ends

        // Update modules based on slots for validation
        setTimeout(() => {
            const modules: Module[] = updatedSlots
                .filter(slot => slot.component !== null)
                .map(slot => ({
                    id: slot.component?.id || '',
                    type: slot.component?.type || '',
                    position: { x: slot.position.x, y: slot.position.y },
                    isPlaced: true
                }));

            handleModuleUpdate(modules);
        }, 0);
    };

    // Handle component removal
    const handleRemoveComponent = (slotId: string) => {
        // Get the component type before removal
        const slotToUpdate = slots.find(slot => slot.id === slotId);
        const componentType = slotToUpdate?.component?.type;

        // Update slots
        setSlots(prev =>
            prev.map(slot =>
                slot.id === slotId
                    ? { ...slot, component: null }
                    : slot
            )
        );

        // Make component available again in palette
        if (componentType) {
            setComponents(prev =>
                prev.map(comp =>
                    comp.id === componentType
                        ? { ...comp, available: true }
                        : comp
                )
            );

            // Reset correct placement if applicable
            setCorrectPlacements(prev => ({
                ...prev,
                [componentType]: false
            }));
        }

        // Update modules after removal
        setTimeout(() => {
            const updatedModules: Module[] = slots
                .filter(slot => slot.id !== slotId && slot.component !== null)
                .map(slot => ({
                    id: slot.component?.id || '',
                    type: slot.component?.type || '',
                    position: { x: slot.position.x, y: slot.position.y },
                    isPlaced: true
                }));

            handleModuleUpdate(updatedModules);
        }, 0);
    };

    // Step completion handler
    const handleStepComplete = (stepId: string) => {
        console.log(`Instruction step completed: ${stepId}`);

        // Additional actions based on completed step
        switch (stepId) {
            case 'modules':
                console.log("🎉 Both modules successfully placed on the board!");
                break;
            case 'code':
                console.log("🎉 Both pin definitions correctly added to the code!");
                break;
            case 'run':
                console.log("🎉 Simulation successfully started!");
                break;
        }
    };

    return (
        <div className="grid grid-cols-12 gap-4 p-4 h-full">
            <div className="col-span-3 h-full">
                <Instructions
                    codeEntered={codeEntered}
                    modulesPlaced={modulesPlaced}
                    runButtonPressed={runButtonPressed}
                    buttonPressedLedOn={runButtonPressed && slots.some(slot => slot.component?.type === 'button' && slot.component?.isActive) && slots.some(slot => slot.component?.type === 'led' && slot.component?.isActive)}
                    onStepComplete={handleStepComplete}
                />
            </div>

            <div className="col-span-6 flex flex-col gap-4 h-full">
                <div className="flex-grow">
                    <CircuitBoardDisplay
                        slots={slots}
                        isDragging={isDragging}
                        currentComponent={currentComponent}
                        dragControls={dragControls}
                        boardRef={boardRef}
                        onButtonPress={handleButtonPress}
                        onRemoveComponent={handleRemoveComponent}
                        onSlotDragStart={handleSlotDragStart}
                        onDragEnd={handleDragEnd}
                        pulsingSlotsIds={pulsingSlotsIds}
                        correctPlacements={correctPlacements}
                    />
                </div>

                <div className="h-1/3">
                    <CodeEditor
                        userCode={userCode}
                        isCodeValid={codeEntered}
                        isProgramRunning={isSimulationRunning}
                        showHint={showHint}
                        codeHint={codeHint}
                        onCodeChange={handleCodeChange}
                        onRunProgram={handleRunButtonClick}
                    />
                </div>
            </div>

            <div className="col-span-3 flex flex-col gap-4 h-full">
                <div className="flex-grow">
                    <ComponentPalette
                        components={components}
                        isDragging={isDragging}
                        currentComponent={currentComponent}
                        dragControls={dragControls}
                        onDragStart={handleComponentDragStart}
                        onDragEnd={handleDragEnd}
                    />
                </div>

                <div className="flex justify-center mt-4">
                    <button
                        onClick={handleRunButtonClick}
                        className={`px-6 py-2 rounded-lg font-medium text-white ${isSimulationRunning
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-green-500 hover:bg-green-600'
                            } transition-colors duration-300`}
                    >
                        {isSimulationRunning ? 'Остановить' : 'Запустить'}
                    </button>
                </div>

                {isSimulationRunning && (
                    <div className="mt-4">
                        <Simulation />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CircuitBoard; 
import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export type TutorialStep = 'placing-led' | 'placing-button' | 'entering-code' | 'running-program' | 'pressing-button' | 'completed';

export interface Slot {
    id: string;
    position: { x: number, y: number };
    component: Component | null;
    label: string;
    pin: number;
}

export interface Component {
    id: string;
    type: string;
    isActive?: boolean;
}

interface UseTutorialProps {
    slots: Slot[];
    setSlots: React.Dispatch<React.SetStateAction<Slot[]>>;
    userCode: string;
    setUserCode: React.Dispatch<React.SetStateAction<string>>;
    setComponents: React.Dispatch<React.SetStateAction<{
        id: string;
        name: string;
        description: string;
        imageSrc: string;
        available: boolean;
    }[]>>;
    setCurrentComponent: React.Dispatch<React.SetStateAction<string | null>>;
    setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
    setDragOrigin: React.Dispatch<React.SetStateAction<'palette' | 'slot' | null>>;
    setDragSourceSlotId: React.Dispatch<React.SetStateAction<string | null>>;
    setPulsingSlotsIds: React.Dispatch<React.SetStateAction<string[]>>;
    setIsProgramRunning: React.Dispatch<React.SetStateAction<boolean>>;
    setCodeHint: React.Dispatch<React.SetStateAction<string>>;
    setShowHint: React.Dispatch<React.SetStateAction<boolean>>;
    setIsCodeValid: React.Dispatch<React.SetStateAction<boolean>>;
    checkCorrectPlacements: (updatedSlots: Slot[]) => boolean;
    validateCode: (code: string) => boolean;
    isComponentVisible: boolean;
}

export const useTutorial = ({
    setSlots,
    userCode,
    setUserCode,
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
    validateCode,
    isComponentVisible
}: UseTutorialProps) => {
    const t = useTranslations('CircuitBoard');
    const [isTutorialActive, setIsTutorialActive] = useState(true);
    const [tutorialStep, setTutorialStep] = useState<TutorialStep>('placing-led');
    const [isTypingCode, setIsTypingCode] = useState(false);
    const tutorialTimersRef = useRef<NodeJS.Timeout[]>([]);

    // Reset tutorial state and prepare for a new run
    const resetTutorial = () => {
        // Clear any pending timers and intervals
        tutorialTimersRef.current.forEach(timer => {
            clearTimeout(timer);
            clearInterval(timer as unknown as NodeJS.Timeout);
        });
        tutorialTimersRef.current = [];

        // Signal to other components that instructions should be reset first
        // This is key for resetting the Instructions component at the right time
        const resetSignal = new CustomEvent('tutorialReset');
        window.dispatchEvent(resetSignal);

        // Reset all tutorial-related state
        setIsTypingCode(false);
        setIsDragging(false);
        setPulsingSlotsIds([]);
        setCurrentComponent(null);
        setDragOrigin(null);
        setDragSourceSlotId(null);
        setIsProgramRunning(false);

        // Return components to palette
        setComponents(prev => prev.map(comp => ({
            ...comp,
            available: true
        })));

        // Clear slots
        setSlots(prev => prev.map(slot => ({
            ...slot,
            component: null
        })));

        // Reset code to initial state using translation
        setUserCode(`from machine import Pin

# ${t('codeTemplate.pinSetupComment')}

while True:
    if button.value() == True:
        led.on()
    else:
        led.off()`);

        // Reset code validity
        setIsCodeValid(false);

        // Reset tutorial to first step
        setTutorialStep('placing-led');

        // Show a hint that tutorial is restarting
        setCodeHint(t('codeHints.restartingDemo'));
        setShowHint(true);

        setTimeout(() => setShowHint(false), 3000);
    };

    // Instead of ending tutorial, restart it after a short delay
    const restartTutorial = () => {
        if (isTutorialActive) {
            // Reset and restart the tutorial
            resetTutorial();

            // Add a slight delay before starting the first step again
            const timer3 = setTimeout(() => {
                if (isComponentVisible) {
                    // Explicitly reset tutorial step to first step to ensure Instructions component knows we're starting fresh
                    setTutorialStep('placing-led');
                    placeLedInSlot();
                }
            }, 2000);

            tutorialTimersRef.current.push(timer3);
        }
    };

    // Tutorial animation to place LED in slot1
    const placeLedInSlot = () => {
        // Make LED component appear as if it's being dragged
        setCurrentComponent('led');
        setIsDragging(true);
        setDragOrigin('palette');
        setDragSourceSlotId(null);
        setPulsingSlotsIds(['slot1']);

        // After a delay, "drop" it into slot1
        const timer1 = setTimeout(() => {
            setIsDragging(false);
            setPulsingSlotsIds([]);

            // Update slots and components state
            setSlots(prev => {
                const updatedSlots = prev.map(slot => {
                    if (slot.id === 'slot1') {
                        return {
                            ...slot,
                            component: {
                                id: `led-${Date.now()}`,
                                type: 'led',
                                isActive: false
                            }
                        };
                    }
                    return slot;
                });

                // Check for correct placements
                checkCorrectPlacements(updatedSlots);

                return updatedSlots;
            });

            setComponents(prev => prev.map(comp => {
                if (comp.id === 'led') {
                    return { ...comp, available: false };
                }
                return comp;
            }));

            setCurrentComponent(null);
            setDragOrigin(null);
            setDragSourceSlotId(null);

            // Move to next tutorial step
            setTutorialStep('placing-button');

            // Start next step after a delay
            const timer2 = setTimeout(() => placeButtonInSlot(), 3000);
            tutorialTimersRef.current.push(timer2);

        }, 2000);

        tutorialTimersRef.current.push(timer1);
    };

    // Tutorial animation to place button in slot2
    const placeButtonInSlot = () => {
        // Make button component appear as if it's being dragged
        setCurrentComponent('button');
        setIsDragging(true);
        setDragOrigin('palette');
        setDragSourceSlotId(null);
        setPulsingSlotsIds(['slot2']);

        // After a delay, "drop" it into slot2
        const timer1 = setTimeout(() => {
            setIsDragging(false);
            setPulsingSlotsIds([]);

            // Update slots and components state
            setSlots(prev => {
                const updatedSlots = prev.map(slot => {
                    if (slot.id === 'slot2') {
                        return {
                            ...slot,
                            component: {
                                id: `button-${Date.now()}`,
                                type: 'button',
                                isActive: false
                            }
                        };
                    }
                    return slot;
                });

                // Check for correct placements
                checkCorrectPlacements(updatedSlots);

                return updatedSlots;
            });

            setComponents(prev => prev.map(comp => {
                if (comp.id === 'button') {
                    return { ...comp, available: false };
                }
                return comp;
            }));

            setCurrentComponent(null);
            setDragOrigin(null);
            setDragSourceSlotId(null);

            // Move to next tutorial step
            setTutorialStep('entering-code');

            // Start next step after a delay
            const timer2 = setTimeout(() => enterCode(), 3000);
            tutorialTimersRef.current.push(timer2);

        }, 2000);

        tutorialTimersRef.current.push(timer1);
    };

    // Tutorial animation to enter code
    const enterCode = () => {
        // Set isTypingCode to true at the start
        setIsTypingCode(true);
        // Ensure code is not valid while typing
        setIsCodeValid(false);

        // We'll only type the two configuration lines
        const codeToType = `led = Pin(0, Pin.OUT)
button = Pin(2, Pin.IN, Pin.PULL_DOWN)`;

        // Reset code to ensure we're starting with a clean state
        const templateCode = `from machine import Pin

# ${t('codeTemplate.pinSetupComment')}

while True:
    if button.value() == True:
        led.on()
    else:
        led.off()`;

        // First, reset to template 
        setUserCode(templateCode);

        // Find the position where we need to insert the code
        const insertPosition = templateCode.indexOf(`# ${t('codeTemplate.pinSetupComment')}`) +
            `# ${t('codeTemplate.pinSetupComment')}`.length;

        // Prepare the final code prefix and suffix
        const codePrefix = templateCode.substring(0, insertPosition);
        const codeSuffix = templateCode.substring(insertPosition);

        // Initialize with just a newline after the pin setup comment
        const initialCode = codePrefix + '\n' + codeSuffix;
        setUserCode(initialCode);

        // Enhanced symbol-by-symbol typing using recursive setTimeout
        let charIndex = 0;

        // Using setTimeout recursively instead of interval for more reliable typing
        const typeNextCharacter = () => {
            // If we haven't typed all characters yet
            if (charIndex < codeToType.length) {
                // Get the next character
                const nextChar = codeToType.charAt(charIndex);

                // Create current state of typed text
                const currentTyped = codeToType.substring(0, charIndex + 1);

                // Update code with the new character
                const updatedCode = codePrefix + '\n' + currentTyped + codeSuffix;
                setUserCode(updatedCode);

                // Increment index for next character
                charIndex++;

                // Determine delay for next character
                let nextDelay = 100; // Base delay between characters

                // Use longer delay after newline
                if (nextChar === '\n') {
                    nextDelay = 400; // Longer pause after line break
                }

                // Schedule next character typing
                const timer = setTimeout(() => {
                    typeNextCharacter();
                }, nextDelay);

                // Add to timers for cleanup
                tutorialTimersRef.current.push(timer);
            } else {
                // Typing is complete - set the final formatted code
                const completeCode = `from machine import Pin

# ${t('codeTemplate.pinSetupComment')}
led = Pin(0, Pin.OUT)
button = Pin(2, Pin.IN, Pin.PULL_DOWN)

while True:
    if button.value() == True:
        led.on()
    else:
        led.off()`;

                // Update the final code
                setUserCode(completeCode);
                setIsTypingCode(false);

                // Validate the code
                const isValid = validateCode(completeCode);
                setIsCodeValid(isValid);

                // Move to next step
                setTutorialStep('running-program');

                // Schedule next step
                const timer = setTimeout(() => runProgram(), 3000);
                tutorialTimersRef.current.push(timer);
            }
        };

        // Wait a moment before starting the typing
        const initialDelay = setTimeout(() => {
            typeNextCharacter();
        }, 500);

        tutorialTimersRef.current.push(initialDelay);
    };

    // Tutorial animation to run the program
    const runProgram = () => {
        setIsProgramRunning(true);
        setCodeHint(t('codeHints.programStarted'));
        setShowHint(true);

        const timer1 = setTimeout(() => {
            setShowHint(false);

            // Move to next tutorial step
            setTutorialStep('pressing-button');

            // Start next step after a delay
            const timer2 = setTimeout(() => pressButton(), 2000);
            tutorialTimersRef.current.push(timer2);
        }, 2000);

        tutorialTimersRef.current.push(timer1);
    };

    // Tutorial animation to press the button and show LED lighting up
    const pressButton = () => {
        // Simulate button press
        setSlots(prev => {
            return prev.map(slot => {
                if (slot.component?.type === 'button') {
                    return {
                        ...slot,
                        component: {
                            ...slot.component,
                            isActive: true
                        }
                    };
                }
                return slot;
            });
        });

        // After a delay, release the button
        const timer = setTimeout(() => {
            setSlots(prev => {
                return prev.map(slot => {
                    if (slot.component?.type === 'button') {
                        return {
                            ...slot,
                            component: {
                                ...slot.component,
                                isActive: false
                            }
                        };
                    }
                    return slot;
                });
            });

            // Tutorial completed
            setTutorialStep('completed');

            // Restart the tutorial after completion
            const timer2 = setTimeout(() => restartTutorial(), 3000);
            tutorialTimersRef.current.push(timer2);

        }, 2000);

        tutorialTimersRef.current.push(timer);
    };

    // Handle user interaction to stop tutorial
    const handleUserInteraction = () => {
        if (isTutorialActive) {
            // Clear all pending tutorial timers
            tutorialTimersRef.current.forEach(timer => {
                clearTimeout(timer);
                clearInterval(timer as unknown as NodeJS.Timeout); // Also clear any intervals
            });
            tutorialTimersRef.current = [];

            // Stop typing and reset state
            setIsTypingCode(false);

            // Stop all automated processes - but preserve the current state
            const currentStep = tutorialStep;

            // Reset tutorial state
            setIsTutorialActive(false);
            setTutorialStep('completed'); // Setting to a valid step instead of null

            // Log user interaction
            console.log('Tutorial stopped due to user interaction at step:', currentStep);
            console.log('Current code state preserved:', userCode);

            // Show hint about manual mode
            if (currentStep === 'entering-code') {
                setCodeHint(t('codeHints.autoTypingStopped'));
            } else {
                setCodeHint(t('codeHints.manualModeActivated'));
            }
            setShowHint(true);
            setTimeout(() => setShowHint(false), 4000);
        }
    };

    // Helper function to compare arrays
    const arraysEqual = (a: string[], b: string[]) => {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    };

    // Helper function to detect real user interaction with components
    const userInteractionDetected = (componentTypes: (string | undefined)[]) => {
        // Detect if components changed in a way that's inconsistent with the tutorial
        const tutorialStateMapping: Record<TutorialStep, string[]> = {
            'placing-led': [],
            'placing-button': ['led'],
            'entering-code': ['led', 'button'],
            'running-program': ['led', 'button'],
            'pressing-button': ['led', 'button'],
            'completed': ['led', 'button']
        };

        const expectedComponents = tutorialStep ? tutorialStateMapping[tutorialStep as TutorialStep] : [];
        const actualComponents = componentTypes.filter(Boolean) as string[];

        return !arraysEqual(expectedComponents.sort(), actualComponents.sort());
    };

    // Start the tutorial automatically when the component becomes visible
    useEffect(() => {
        if (!isTutorialActive || !isComponentVisible || userInteractionDetected(['button', 'led'])) return;

        let isEffectActive = true; // Track whether effect is still active

        // Start tutorial with a slight delay after component becomes visible
        const timer = setTimeout(() => {
            if (!isEffectActive) return; // Skip if effect is no longer active

            if (tutorialStep === 'placing-led') {
                placeLedInSlot();
            }
        }, 500);

        tutorialTimersRef.current.push(timer);

        // Cleanup function
        return () => {
            isEffectActive = false; // Mark effect as inactive
            clearTimeout(timer);
            tutorialTimersRef.current = tutorialTimersRef.current.filter(t => t !== timer);
        };
    }, [isTutorialActive, isComponentVisible, tutorialStep, placeLedInSlot, userInteractionDetected]);

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            tutorialTimersRef.current.forEach(timer => clearTimeout(timer));
        };
    }, []);

    return {
        isTutorialActive,
        setIsTutorialActive,
        tutorialStep,
        setTutorialStep,
        handleUserInteraction,
        userInteractionDetected,
        isTypingCode,
        restartTutorial
    };
};

export default useTutorial; 
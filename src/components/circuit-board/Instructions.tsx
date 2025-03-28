import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface InstructionItem {
    id: string;
    title: string;
    description: string;
    codeExample?: string;
    isCompleted: boolean;
}

interface InstructionsProps {
    codeEntered: boolean;
    modulesPlaced: boolean;
    runButtonPressed: boolean;
    buttonPressedLedOn: boolean;
    onStepComplete?: (stepId: string) => void;
    resetInstructions?: boolean;
    onReloadTutorial?: () => void;
}

const Instructions: React.FC<InstructionsProps> = ({
    codeEntered = false,
    modulesPlaced = false,
    runButtonPressed = false,
    buttonPressedLedOn = false,
    onStepComplete,
    resetInstructions = false,
    onReloadTutorial
}) => {
    const t = useTranslations('CircuitBoard');

    const [instructionItems, setInstructionItems] = useState<InstructionItem[]>([
        {
            id: 'modules',
            title: t('instructions.step1.title'),
            description: t('instructions.step1.description'),
            isCompleted: false,
        },
        {
            id: 'code',
            title: t('instructions.step2.title'),
            description: t('instructions.step2.description'),
            codeExample: `led = Pin(0, Pin.OUT)
button = Pin(2, Pin.IN)`,
            isCompleted: false,
        },
        {
            id: 'run',
            title: t('instructions.step3.title'),
            description: t('instructions.step3.description'),
            isCompleted: false,
        },
        {
            id: 'press',
            title: t('instructions.step4.title'),
            description: t('instructions.step4.description'),
            isCompleted: false,
        }
    ]);
    const [copiedItemId, setCopiedItemId] = useState<string | null>(null);

    const isInitialMount = useRef(true);

    const prevProps = useRef({
        codeEntered: false,
        modulesPlaced: false,
        runButtonPressed: false,
        buttonPressedLedOn: false
    });

    // Function to reset all instruction steps
    const resetAllInstructions = useCallback(() => {
        console.log("Resetting all instruction steps");
        setInstructionItems(prev =>
            prev.map(item => ({
                ...item,
                isCompleted: false
            }))
        );

        prevProps.current = {
            codeEntered: false,
            modulesPlaced: false,
            runButtonPressed: false,
            buttonPressedLedOn: false
        };
    }, []);

    // Listen for custom tutorialReset event
    useEffect(() => {
        const handleTutorialReset = () => {
            resetAllInstructions();
        };

        window.addEventListener('tutorialReset', handleTutorialReset);

        return () => {
            window.removeEventListener('tutorialReset', handleTutorialReset);
        };
    }, [resetAllInstructions]);

    const completeStep = useCallback((stepId: string) => {
        const stepItem = instructionItems.find(item => item.id === stepId);
        if (!stepItem || stepItem.isCompleted) {
            console.log(`Step ${stepId} already completed or not found`);
            return;
        }

        console.log(`Completing step: ${stepId}`);

        setInstructionItems(prev =>
            prev.map(item =>
                item.id === stepId ? { ...item, isCompleted: true } : item
            )
        );

        if (onStepComplete) {
            onStepComplete(stepId);
        }
    }, [instructionItems, onStepComplete]);

    const copyToClipboard = (text: string, itemId: string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopiedItemId(itemId);
                setTimeout(() => {
                    setCopiedItemId(null);
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    };

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            prevProps.current = {
                codeEntered,
                modulesPlaced,
                runButtonPressed,
                buttonPressedLedOn
            };
            return;
        }

        console.log("Current state:", {
            modulesPlaced,
            codeEntered,
            runButtonPressed,
            buttonPressedLedOn
        });
        console.log("Previous state:", prevProps.current);

        // Only track step changes when props transition from false to true
        // This prevents marking steps as complete at the beginning of a new iteration
        if (modulesPlaced && !prevProps.current.modulesPlaced) {
            console.log("MODULE PLACEMENT DETECTED!");
            completeStep('modules');
        }

        if (codeEntered && !prevProps.current.codeEntered) {
            console.log("CODE ENTRY DETECTED!");
            completeStep('code');
        }

        if (runButtonPressed && !prevProps.current.runButtonPressed) {
            console.log("RUN BUTTON PRESS DETECTED!");
            completeStep('run');
        }

        if (buttonPressedLedOn && !prevProps.current.buttonPressedLedOn) {
            console.log("BUTTON PRESS AND LED ON DETECTED!");
            completeStep('press');
        }

        // Update previous props for next comparison
        prevProps.current = {
            codeEntered,
            modulesPlaced,
            runButtonPressed,
            buttonPressedLedOn
        };
    }, [codeEntered, modulesPlaced, runButtonPressed, buttonPressedLedOn, completeStep]);

    // Reset instructions when resetInstructions prop changes
    useEffect(() => {
        if (resetInstructions) {
            console.log("Resetting instructions via prop");
            resetAllInstructions();
        }
    }, [resetInstructions, resetAllInstructions]);

    return (
        <div className="circuit-instructions bg-white rounded-xl shadow-lg p-5 h-full flex flex-col w-full relative">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">{t('instructions.header')}</h3>
                <button
                    onClick={onReloadTutorial}
                    className="p-2 rounded-lg hover:text-primary border border-slate-300 hover:border-primary"
                    title={t('instructions.restart')}
                    aria-label={t('instructions.restart')}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                </button>
            </div>
            <div className="flex flex-col gap-3 flex-1">
                {instructionItems.map((item) => (
                    <div
                        key={item.id}
                        className={`flex flex-col p-4 rounded-xl ${item.isCompleted
                            ? 'bg-green-50 border-green-400'
                            : 'bg-slate-50 hover:border-primary border-transparent'
                            } border transition-all duration-500`}
                    >
                        <div className="flex items-start gap-1">
                            <div className={`w-4 h-4 mt-0.5 rounded-full flex items-center justify-center flex-shrink-0 ${item.isCompleted
                                ? 'bg-green-500 animate-custom-pulse'
                                : 'border-2 border-slate-300'
                                }`}>
                                {item.isCompleted && (
                                    <svg
                                        className="w-3 h-3 text-white animate-custom-fade-in"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M5 13l4 4L19 7"
                                            strokeDasharray="30"
                                            strokeDashoffset="0"
                                            className="animate-checkmark-appear"
                                        />
                                    </svg>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <h4 className="text-sm font-semibold text-gray-800 mb-1">{item.title}</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                            </div>
                        </div>
                        {item.codeExample && (
                            <div className="ml-6 mt-2 p-2 border border-slate-400 rounded font-mono text-xs text-slate-700 relative">
                                <pre>{item.codeExample}</pre>
                                <button
                                    onClick={() => copyToClipboard(item.codeExample || '', item.id)}
                                    className={`absolute top-2 right-2 p-1.5 rounded-md hover:bg-slate-200 transition-colors ${copiedItemId === item.id ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                        }`}
                                    title={t('instructions.copyCode')}
                                    aria-label={t('instructions.copyCode')}
                                >
                                    {copiedItemId === item.id ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zm-.5 2h3l.5 1H8l.5-1z" />
                                            <path d="M8.293 7.293a1 1 0 011.414 0L11 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Instructions; 
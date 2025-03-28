import { Slot } from '../hooks/useTutorial';

type TFunction = (key: string, params?: Record<string, unknown>) => string;

export const validateCode = (code: string, slots: Slot[], t: TFunction): { isValid: boolean; hint: string } => {
    try {
        const ledSlot = slots.find(slot => slot.component?.type === 'led');
        const buttonSlot = slots.find(slot => slot.component?.type === 'button');

        if (!ledSlot || !buttonSlot) {
            return {
                isValid: false,
                hint: t('validation.placeComponents')
            };
        }

        const hasImport = code.includes('from machine import Pin');
        const hasWhileLoop = code.includes('while True:') || code.includes('while(True):') || code.includes('while (True):');
        const hasButtonCheck = code.includes('if button.value() == True:') ||
            code.includes('if button.value():') ||
            code.includes('if button.value()') ||
            code.includes('if (button.value())');
        const hasLedOn = code.includes('led.on()') || code.includes('led.value(1)') || code.includes('led.value(True)');
        const hasLedOff = code.includes('led.off()') || code.includes('led.value(0)') || code.includes('led.value(False)');
        const ledPinRegex = /led\s*=\s*Pin\s*\(\s*(\d+)/;
        const buttonPinRegex = /button\s*=\s*Pin\s*\(\s*(\d+)/;
        const ledPinMatch = code.match(ledPinRegex);
        const buttonPinMatch = code.match(buttonPinRegex);

        const missingElements = [];

        if (!hasImport) missingElements.push(t('validation.missingImport'));
        if (!hasWhileLoop) missingElements.push(t('validation.missingLoop'));
        if (!hasButtonCheck) missingElements.push(t('validation.missingButtonCheck'));
        if (!hasLedOn) missingElements.push(t('validation.missingLedOn'));
        if (!hasLedOff) missingElements.push(t('validation.missingLedOff'));
        if (!ledPinMatch) missingElements.push(t('validation.missingLedPin'));
        if (!buttonPinMatch) missingElements.push(t('validation.missingButtonPin'));

        if (missingElements.length > 0) {
            return {
                isValid: false,
                hint: `${t('validation.incompleteCode')}: ${missingElements.join(', ')}`
            };
        }

        const ledPin = ledPinMatch ? parseInt(ledPinMatch[1]) : -1;
        const buttonPin = buttonPinMatch ? parseInt(buttonPinMatch[1]) : -1;

        const correctLedSlot = slots.find(slot => slot.component?.type === 'led' && slot.pin === ledPin);
        const correctButtonSlot = slots.find(slot => slot.component?.type === 'button' && slot.pin === buttonPin);

        if (!correctLedSlot) {
            return {
                isValid: false,
                hint: t('validation.wrongLedPin', { slotPin: ledSlot.pin, codePin: ledPin })
            };
        }

        if (!correctButtonSlot) {
            return {
                isValid: false,
                hint: t('validation.wrongButtonPin', { slotPin: buttonSlot.pin, codePin: buttonPin })
            };
        }

        return {
            isValid: true,
            hint: t('validation.codeValid')
        };
    } catch (error) {
        console.error('Error validating code:', error);
        return {
            isValid: false,
            hint: t('validation.codeError')
        };
    }
};

export default validateCode; 